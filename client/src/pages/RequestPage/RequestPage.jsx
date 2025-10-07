import { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ tipo: "", descripcion: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.tipo && form.descripcion) {
      setRequests([...requests, { ...form, id: Date.now() }]);
      setForm({ tipo: "", descripcion: "" });
    }
  };

  return (
    <Container className="p-4">
      <h1 className="mb-4">Solicitudes</h1>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Label>Tipo de Solicitud</Form.Label>
            <Form.Control
              type="text"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button type="submit" variant="primary">
              Agregar Solicitud
            </Button>
          </Col>
        </Row>
      </Form>
      <Row className="g-4">
        {requests.length === 0 ? (
          <Col>
            <p className="text-muted">No hay solicitudes registradas.</p>
          </Col>
        ) : (
          requests.map((req) => (
            <Col key={req.id} xs={12} md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>{req.tipo}</Card.Title>
                  <Card.Text>{req.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default RequestPage;