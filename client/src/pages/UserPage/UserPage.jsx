import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

export const UserPage = () => {
  const [user, setUser] = useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    role: "Empleado",
    phoneNumber: "123-456-7890",
  });

  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    // Aquí puedes agregar la lógica para guardar los cambios
    setEditing(false);
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para deslogear al usuario
    setUser(null);
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
                  <Form.Group controlId="name">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="role">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.role}
                      onChange={(e) => setUser({ ...user, role: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="phoneNumber">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.phoneNumber}
                      onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSave}>
                    Guardar cambios
                  </Button>
                </Form>
              ) : (
                <div>
                  <p>Nombre: {user.name}</p>
                  <p>Correo electrónico: {user.email}</p>
                  <p>Rol: {user.role}</p>
                  <p>Teléfono: {user.phoneNumber}</p>
                  <Button variant="primary" onClick={handleEdit}>
                    Editar perfil
                  </Button>
                  <Button variant="danger" onClick={handleLogout}>
                    Cerrar sesión
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