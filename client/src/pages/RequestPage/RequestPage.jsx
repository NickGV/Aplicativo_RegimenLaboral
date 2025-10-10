// src/pages/RequestPage/RequestPage.jsx
import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { getRequests, createRequest, updateRequest, deleteRequest } from "../../services/requestService";

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
function RequestForm({ initialData = {}, onSubmit, onCancel, submitting }) {
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <select
          className="form-select"
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
        <label className="form-label">Fecha de Creación</label>
        <input
          className="form-control"
          type="date"
          name="fecha_creacion"
          value={form.fecha_creacion}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel} disabled={submitting}>
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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialData, setInitialData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequests();
      // si el backend devuelve fecha con timestamp, lo dejamos; el form lo transforma
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
    setInitialData({ tipo: "", descripcion: "", fecha_creacion: "" });
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
      // Si editingId está presente usamos update; si no, creamos.
      if (editingId) {
        await updateRequest(editingId, formData);
      } else {
        await createRequest(formData);
      }
      await fetchRequests();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving request:", err);
      setError("No se pudo guardar la solicitud. Revisa la consola.");
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

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1 style={{ fontWeight: "bold" }}>Solicitudes Laborales</h1>
      <p>
        Bienvenido usuario, aquí puedes hacer tus solicitudes laborales sin necesidad
        de acercarte directamente a la oficina
      </p>

      <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 8px #eee" }}>
          <Button variant="dark" onClick={handleShowModalForCreate}>
            <i className="bi bi-file-earmark"></i> Crear Nueva Solicitud
          </Button>
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : requests.length === 0 ? (
          <p className="text-muted">No hay solicitudes registradas.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} style={{ background: "#f8f9fa", borderRadius: "8px", padding: "1rem", marginBottom: "1rem", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <strong>{req.tipo}</strong>
                  <div style={{ color: "#555" }}>{req.descripcion}</div>
                  <small className="text-muted">Creado: {formatDateForInput(req.fecha_creacion) || "—"}</small>
                </div>
                <div>
                  <Button size="sm" variant="outline-primary" onClick={() => handleShowModalForEdit(req)} style={{ marginRight: "0.5rem" }}>Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(req.id)}>Eliminar</Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Editar Solicitud" : "Nueva Solicitud"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RequestForm
            initialData={initialData}
            onSubmit={handleSubmitForm}
            onCancel={handleCloseModal}
            submitting={submitting}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
