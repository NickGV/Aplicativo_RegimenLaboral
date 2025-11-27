import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Modal,
  FloatingLabel,
  Row,
  Col,
  InputGroup,
  Alert
} from "react-bootstrap";
import { BiX, BiSave } from "react-icons/bi";
import useContract from "../../hooks/useContracts";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const ContractForm = ({ show, handleClose, initialData = null, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "",
    fecha_inicio: "",
    fecha_fin: "",
    salario: "",
    descripcion: "",
    empleado: "",
  });

  const { handleListUsers } = useAuth();
  const { handleCreateContract } = useContract();
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpleados = async () => {
      // Verificar si hay token antes de hacer la petición
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No estás autenticado. Redirigiendo al login...");
        setTimeout(() => navigate("/auth"), 2000);
        return;
      }

      setLoading(true);
      setError("");
      
      try {
        const users = await handleListUsers();
        if (users && Array.isArray(users)) {
          setEmpleados(users.filter((u) => u.rol === "empleado"));
        }
      } catch (err) {
        console.error("Error al cargar empleados:", err);
        if (err.response?.status === 401) {
          setError("Sesión expirada. Por favor inicia sesión nuevamente.");
          // El interceptor ya se encargará de redirigir
        } else {
          setError("Error al cargar la lista de empleados");
        }
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchEmpleados();
    }
  }, [handleListUsers, show, navigate]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        empleado: initialData.empleado?.id || initialData.empleado || "",
      });
    } else {
      setFormData({
        titulo: "",
        tipo: "",
        fecha_inicio: "",
        fecha_fin: "",
        salario: "",
        descripcion: "",
        empleado: "",
      });
    }
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Verificar token antes de enviar
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    console.log("Form data:", formData);
    
    // Preparar datos del contrato con el estado
    const contractData = {
      ...formData,
      estado: "Activo",
      empleado: formData.empleado,
    };
    
    try {
      if (onSave) {
        console.log("Using onSave function with data:", contractData);
        await onSave(contractData);
      } else {
        console.log("No onSave function provided, using handleCreateContract directly");
        await handleCreateContract(contractData);
      }
      
      handleClose();
    } catch (err) {
      console.error("Error al guardar contrato:", err);
      if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor inicia sesión nuevamente.");
      } else {
        setError("Error al guardar el contrato. Intenta nuevamente.");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Editar Contrato" : "Nuevo Contrato"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          Complete la información para {initialData ? "editar" : "registrar"} un contrato
        </p>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <h5>Empleado</h5>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <span className="ms-2">Cargando empleados...</span>
              </div>
            ) : (
              <Form.Select
                name="empleado"
                required
                value={formData.empleado}
                onChange={handleChange}
                disabled={!!initialData}
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.username || emp.email}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <h5>Título del Contrato</h5>
            <Form.Control
              type="text"
              name="titulo"
              placeholder="Ej: Contrato de Trabajo a Término Fijo"
              required
              value={formData.titulo}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <h5>Tipo de Contrato</h5>
            <Form.Select
              name="tipo"
              required
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="">Seleccione un tipo</option>
              <option value="fijo">Término Fijo</option>
              <option value="indefinido">Término Indefinido</option>
              <option value="obra">Obra </option>
            </Form.Select>
          </Form.Group>

          <Row className="mb-4">
            <Col md={6}>
              <h5>Fecha de Inicio</h5>
              <Form.Control
                type="date"
                name="fecha_inicio"
                required
                value={formData.fecha_inicio}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">mm/dd/yyyy</Form.Text>
            </Col>
            <Col md={6}>
              <h5>Fecha de Finalización (opcional)</h5>
              <Form.Control
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">mm/dd/yyyy</Form.Text>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <h5>Salario Mensual (COP)</h5>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                name="salario"
                placeholder="Ej: 1000000"
                required
                value={formData.salario}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <h5>Descripción (opcional)</h5>
            <FloatingLabel label="Detalles adicionales del contrato">
              <Form.Control
                as="textarea"
                name="descripcion"
                style={{ height: "100px" }}
                value={formData.descripcion}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Form.Group>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="outline-secondary" onClick={handleClose}>
              <BiX /> Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              <BiSave /> {loading ? "Guardando..." : "Guardar Contrato"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};