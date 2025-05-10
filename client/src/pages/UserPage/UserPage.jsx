import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

export const UserPage = () => {
  const { user, setUser, handleUpdateUser, handleDeleteUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  if (!user) return <p>No hay usuario logueado.</p>;

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
    if (window.confirm("¿Seguro que deseas eliminar tu cuenta?")) {
      await handleDeleteUser(user.id);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Perfil de usuario</Card.Title>
              {editing ? (
                <Form>
                  <Form.Group controlId="username">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="rol">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.rol}
                      onChange={(e) =>
                        setFormData({ ...formData, rol: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="numero_telefono">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.numero_telefono}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numero_telefono: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSave}>
                    Guardar cambios
                  </Button>
                </Form>
              ) : (
                <div>
                  <p>Nombre: {user.username}</p>
                  <p>Correo electrónico: {user.email}</p>
                  <p>Rol: {user.rol}</p>
                  <p>Teléfono: {user.numero_telefono}</p>
                  <Button variant="primary" onClick={handleEdit}>
                    Editar perfil
                  </Button>
                  <Button variant="danger" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={handleDelete}
                    className="mt-2"
                  >
                    Eliminar cuenta
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
