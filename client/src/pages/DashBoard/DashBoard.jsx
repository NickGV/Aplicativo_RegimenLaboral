import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { BiPeople, BiFile } from 'react-icons/bi';

export default function Dashboard() {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Dashboard</h1>

      <Row className="g-4 mb-4">
        {/* Total Contratos */}
        <Col md={4}>
          <Card className="shadow-sm rounded-3">
            <Card.Body>
              <Card.Subtitle className="text-secondary">Total Contratos</Card.Subtitle>
              <div className="d-flex align-items-center my-2">
                <h2 className="mb-0 me-auto">1</h2>
                <BiPeople className="fs-3 text-secondary" />
              </div>
              <small className="text-muted">1 activos, 0 finalizados</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Cálculos Recientes */}
        <Col md={4}>
          <Card className="shadow-sm rounded-3">
            <Card.Body>
              <Card.Subtitle className="text-secondary">Cálculos Recientes</Card.Subtitle>
              <div className="d-flex align-items-center my-2">
                <h2 className="mb-0 me-auto">0</h2>
                <BiFile className="fs-3 text-secondary" />
              </div>
              <small className="text-muted">Realiza tu primer cálculo</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Acciones Rápidas */}
        <Col md={4}>
          <Card className="shadow-sm rounded-3">
            <Card.Body>
              <Card.Subtitle className="text-secondary">Acciones Rápidas</Card.Subtitle>
              <Form className="mt-3 d-grid gap-2">
                <Button variant="dark" size="lg">+ Nuevo Contrato</Button>
                <Button variant="outline-dark" size="lg">Nuevo Cálculo</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contratos Recientes */}
      <Card className="shadow-sm rounded-3 p-4">
        <Card.Subtitle className="text-secondary mb-3">Contratos Recientes</Card.Subtitle>
        <div className="text-center text-muted py-5">
          Cargando contratos recientes...
        </div>
      </Card>
    </Container>
  );
}
