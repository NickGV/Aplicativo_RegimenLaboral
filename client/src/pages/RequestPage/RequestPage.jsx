// src/pages/RequestPage/RequestPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Spinner, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getRequests, createRequest, updateRequest, deleteRequest } from "../../services/requestService";
import { AuthContext } from "../../context/AuthProvider";
import { useTheme } from "../../hooks/useTheme.jsx"; // Importar el hook del tema

/**
 * Helper: formatea un valor de fecha (ISO o timestamp) a YYYY-MM-DD para inputs type="date"
 */
function formatDateForInput(value) {
  if (!value) return "";
  // si ya está en formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  // intentar parsear como fecha ISO o Date
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toISOString().slice(0, 10);
}

/* Componente RequestForm (integrado para que el page sea autocontenido) */
function RequestForm({ initialData = {}, onSubmit, onCancel, submitting, theme }) {
  const [form, setForm] = useState({
    tipo: "",
    descripcion: "",
    fecha_creacion: "",
    ...initialData
  });

  useEffect(() => {
    setForm({
      tipo: initialData.tipo || "",
      descripcion: initialData.descripcion || "",
      // aseguramos formato YYYY-MM-DD
      fecha_creacion: formatDateForInput(initialData.fecha_creacion) || "",
      ...initialData
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Clases condicionales para modo oscuro
  const textClass = theme === 'dark' ? 'text-light' : '';
  const formControlClass = theme === 'dark' ? 'dark-form-control' : '';

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className={`form-label ${textClass}`}>Tipo</label>
        <select
          className={`form-select ${formControlClass}`}
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="Actualización de información personal">Actualización de información personal</option>
          <option value="Agregar información">Agregar información</option>
        </select>
      </div>

      <div className="mb-3">
        <label className={`form-label ${textClass}`}>Fecha de Creación</label>
        <input
          className={`form-control ${formControlClass}`}
          type="date"
          name="fecha_creacion"
          value={form.fecha_creacion}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className={`form-label ${textClass}`}>Descripción</label>
        <textarea
          className={`form-control ${formControlClass}`}
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>

      <div className="d-flex justify-content-end">
        <button 
          type="button" 
          className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-secondary'} me-2`} 
          onClick={onCancel} 
          disabled={submitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
              Guardando...
            </>
          ) : initialData && initialData.id ? "Guardar Cambios" : "Crear"
          }
        </button>
      </div>
    </form>
  );
}

/* Page principal */
export default function RequestPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme] = useTheme(); // Usar el hook del tema
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialData, setInitialData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Usuario del contexto:', user);
    console.log('User ID:', user?.id);
    console.log('Token en localStorage:', localStorage.getItem('access_token'));
    
    if (!user) {
      console.log('Usuario es null - redirigiendo al login');
      navigate('/auth');
      return;
    }
    
    fetchRequests();
  }, [user, navigate]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("No fue posible obtener las solicitudes.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModalForCreate = () => {
     if (!user) {
      alert('Debes iniciar sesión para crear una solicitud');
      navigate('/auth');
      return;
    }
    
    setInitialData({ 
      tipo: "", 
      descripcion: "", 
      fecha_creacion: new Date().toISOString().split('T')[0] // Fecha actual
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleShowModalForEdit = (req) => {
    setInitialData({
      id: req.id,
      tipo: req.tipo || "",
      descripcion: req.descripcion || "",
      fecha_creacion: formatDateForInput(req.fecha_creacion)
    });
    setEditingId(req.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInitialData({});
    setEditingId(null);
  };

  const handleSubmitForm = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      }
      const payload = {
        ...formData,
        usuario: user.id,
      };
      if (editingId) {
        await updateRequest(editingId, payload);
      } else {
        await createRequest(payload);
      }
      await fetchRequests();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving request:", err);
      setError("No se pudo guardar la solicitud. Revisa la consola.");
      if (err.message.includes('autenticado') || err.message.includes('401')) {
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta solicitud?")) return;
    try {
      await deleteRequest(id);
      await fetchRequests();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("No se pudo eliminar la solicitud.");
    }
  };

  // Clases condicionales para modo oscuro
  const textClass = theme === 'dark' ? 'text-light' : '';
  const cardClass = theme === 'dark' ? 'bg-dark text-light' : 'bg-white';
  const requestCardClass = theme === 'dark' ? 'bg-secondary text-light' : 'bg-light';
  const mutedTextClass = theme === 'dark' ? 'text-light-50' : 'text-muted';

  return (
    <Container className={`py-4 ${textClass}`}>
      <div className="text-center mb-4">
        <h1 className="fw-bold">Solicitudes Laborales</h1>
        <p className={mutedTextClass}>
          Bienvenido usuario, aquí puedes hacer tus solicitudes laborales sin necesidad
          de acercarte directamente a la oficina
        </p>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <Card className={cardClass} style={{ borderRadius: "16px", padding: "2rem" }}>
          <Button 
            variant={theme === 'dark' ? 'outline-light' : 'dark'} 
            onClick={handleShowModalForCreate}
          >
            <i className="bi bi-file-earmark"></i> Crear Nueva Solicitud
          </Button>
        </Card>
      </div>

      <div className="mx-auto" style={{ maxWidth: "700px" }}>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'dark'} />
          </div>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : requests.length === 0 ? (
          <p className={`text-center ${mutedTextClass}`}>No hay solicitudes registradas.</p>
        ) : (
          requests.map((req) => (
            <Card 
              key={req.id} 
              className={`mb-3 ${requestCardClass}`}
              border={theme === 'dark' ? 'secondary' : 'light'}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <Card.Title className="h6">{req.tipo}</Card.Title>
                    <Card.Text className={textClass}>{req.descripcion}</Card.Text>
                    <small className={mutedTextClass}>
                      Creado: {formatDateForInput(req.fecha_creacion) || "—"}
                    </small>
                  </div>
                  <div className="d-flex flex-column gap-2 ms-3">
                    <Button 
                      size="sm" 
                      variant={theme === 'dark' ? 'outline-light' : 'outline-primary'} 
                      onClick={() => handleShowModalForEdit(req)}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant={theme === 'dark' ? 'outline-danger' : 'outline-danger'} 
                      onClick={() => handleDelete(req.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        data-bs-theme={theme} // Para mejor soporte en modales de Bootstrap 5.3+
      >
        <Modal.Header 
          closeButton 
          className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
        >
          <Modal.Title className={textClass}>
            {editingId ? "Editar Solicitud" : "Nueva Solicitud"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-dark text-light' : ''}>
          <RequestForm
            initialData={initialData}
            onSubmit={handleSubmitForm}
            onCancel={handleCloseModal}
            submitting={submitting}
            theme={theme}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}