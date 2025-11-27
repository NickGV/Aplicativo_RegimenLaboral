import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme.jsx"; // Importar el hook del tema

export const UserPage = () => {
  const { user, setUser, handleUpdateUser, handleDeleteUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [theme] = useTheme(); // Usar el hook del tema

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

  // Clases condicionales para modo oscuro
  const textClass = theme === 'dark' ? 'text-light' : '';
  const cardClass = theme === 'dark' ? 'bg-dark text-light' : 'bg-white';
  const headerClass = theme === 'dark' ? 'bg-secondary text-light' : 'bg-primary text-white';
  const mutedTextClass = theme === 'dark' ? 'text-light-50' : 'text-muted';
  const darkTextClass = theme === 'dark' ? 'text-light' : 'text-dark';
  const formControlClass = theme === 'dark' ? 'dark-form-control' : '';

  return (
    <Container className={`py-5 ${textClass}`}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className={`border-0 shadow-sm rounded-lg overflow-hidden ${cardClass}`}>
            <Card.Header className={`py-3 ${headerClass}`}>
              <Card.Title className="mb-0">
                <i className="fas fa-user-circle me-2"></i>
                Perfil de Usuario
              </Card.Title>
            </Card.Header>
            
            <Card.Body className="p-4">
              {editing ? (
                <Form>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className={mutedTextClass}>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className={`py-2 ${formControlClass}`}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className={mutedTextClass}>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`py-2 ${formControlClass}`}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="rol">
                    <Form.Label className={mutedTextClass}>Rol</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.rol}
                      onChange={(e) =>
                        setFormData({ ...formData, rol: e.target.value })
                      }
                      className={`py-2 ${formControlClass}`}
                      disabled // Normalmente el rol no se debería editar
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4" controlId="numero_telefono">
                    <Form.Label className={mutedTextClass}>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.numero_telefono}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numero_telefono: e.target.value,
                        })
                      }
                      className={`py-2 ${formControlClass}`}
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
                      variant={theme === 'dark' ? 'outline-light' : 'outline-secondary'} 
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
                      <i className={`fas fa-user me-3 fs-4 ${theme === 'dark' ? 'text-light' : 'text-primary'}`}></i>
                      <div>
                        <h5 className={`mb-0 ${darkTextClass}`}>{user.username}</h5>
                        <small className={mutedTextClass}>{user.rol}</small>
                      </div>
                    </div>
                    
                    <div className="ps-4">
                      <div className="d-flex align-items-center mb-2">
                        <i className={`fas fa-envelope me-3 ${mutedTextClass}`}></i>
                        <span className={darkTextClass}>{user.email}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className={`fas fa-phone me-3 ${mutedTextClass}`}></i>
                        <span className={darkTextClass}>{user.numero_telefono || "No especificado"}</span>
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
                      variant={theme === 'dark' ? 'outline-light' : 'outline-secondary'} 
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