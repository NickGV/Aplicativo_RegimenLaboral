import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

export const UserPage = () => {
  const { user, setUser, handleUpdateUser, handleDeleteUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  if (!user) return <div className="d-flex justify-content-center mt-5"><p className="text-muted">No hay usuario logueado.</p></div>;

  const handleEdit = () => {
    setFormData(user);
    setEditing(true);
  };

  const handleSave = async () => {
    const updated = await handleUpdateUser(user.id, formData);
    if (updated) {
      setEditing(false);
      alert("Cambios guardados exitosamente!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/auth/";
  };

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      await handleDeleteUser(user.id);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
            <Card.Header className="bg-primary text-white py-3">
              <Card.Title className="mb-0">
                <i className="fas fa-user-circle me-2"></i>
                Perfil de Usuario
              </Card.Title>
            </Card.Header>
            
            <Card.Body className="p-4">
              {editing ? (
                <Form>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="text-secondary">Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="py-2"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="text-secondary">Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="py-2"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="rol">
                    <Form.Label className="text-secondary">Rol</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.rol}
                      onChange={(e) =>
                        setFormData({ ...formData, rol: e.target.value })
                      }
                      className="py-2"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4" controlId="numero_telefono">
                    <Form.Label className="text-secondary">Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.numero_telefono}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numero_telefono: e.target.value,
                        })
                      }
                      className="py-2"
                    />
                  </Form.Group>
                  
                  <div className="d-flex gap-3">
                    <Button 
                      variant="primary" 
                      onClick={handleSave}
                      className="flex-grow-1 py-2"
                    >
                      Guardar cambios
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setEditing(false)}
                      className="flex-grow-1 py-2"
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-user text-primary me-3 fs-4"></i>
                      <div>
                        <h5 className="mb-0 text-dark">{user.username}</h5>
                        <small className="text-muted">{user.rol}</small>
                      </div>
                    </div>
                    
                    <div className="ps-4">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-envelope text-muted me-3"></i>
                        <span className="text-dark">{user.email}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-phone text-muted me-3"></i>
                        <span className="text-dark">{user.numero_telefono || "No especificado"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex flex-column gap-2">
                    <Button 
                      variant="primary" 
                      onClick={handleEdit}
                      className="py-2"
                    >
                      <i className="fas fa-edit me-2"></i>
                      Editar perfil
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleLogout}
                      className="py-2"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Cerrar sesión
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={handleDelete}
                      className="py-2"
                    >
                      <i className="fas fa-trash-alt me-2"></i>
                      Eliminar cuenta
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};