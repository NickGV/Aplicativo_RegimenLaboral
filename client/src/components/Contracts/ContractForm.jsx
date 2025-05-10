import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Modal,
  FloatingLabel,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { BiX, BiSave } from "react-icons/bi";
import useContract from "../../hooks/useContracts";
import useAuth from "../../hooks/useAuth";
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

  useEffect(() => {
    const fetchEmpleados = async () => {
      const users = await handleListUsers();
      if (users && Array.isArray(users)) {
        setEmpleados(users.filter((u) => u.rol === "empleado"));
      }
    };
    fetchEmpleados();
  }, [handleListUsers]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      handleCreateContract({
        ...formData,
        estado: "Active",
        empleado: formData.empleado,
      });
    }
    handleClose();
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

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <h5>Empleado</h5>
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
            <Button variant="primary" type="submit">
              <BiSave /> Guardar Contrato
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
