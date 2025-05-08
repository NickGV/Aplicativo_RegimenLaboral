import React from "react";
import { Container, Row, Col, Card, Button, Tab, Tabs } from "react-bootstrap";
import { BsFileEarmark, BsDownload } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";

export const ReportsPage = () => {
  const { user } = useAuth();
  const userRole = user ? user.rol : null;

  return (
    <Container className="p-4">
      <h1 className="mb-4">Reportes</h1>

      <Tabs defaultActiveKey="all" id="reports-tabs" className="mb-4">
        <Tab
          eventKey="all"
          title="Todos los reportes"
          disabled={
            userRole !== "empleador" &&
            userRole !== "contador" &&
            userRole !== "asesor_legal" &&
            userRole !== "entidad_gubernamental"
          }
        ></Tab>
        <Tab eventKey="summary" title="Resumen (Próximamente)" disabled></Tab>
      </Tabs>

      <Row className="g-4">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Todos los Cálculos</Card.Title>
              <Card.Text>
                Descargue todos los cálculos en formato JSON
              </Card.Text>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="d-flex align-items-center">
                  <BsFileEarmark size={34} className="me-2" />
                  <div>
                    <div className="fw-bold">todos-los-calculos.json</div>
                    <small className="text-muted">0 cálculos disponibles</small>
                  </div>
                </div>
                {(userRole === "empleador" ||
                  userRole === "contador" ||
                  userRole === "asesor_legal" ||
                  userRole === "entidad_gubernamental") && (
                  <Button variant="outline-secondary">
                    <BsDownload size={20} />
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Último Cálculo</Card.Title>
              <Card.Text>
                Descargue el cálculo más reciente en formato JSON
              </Card.Text>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="d-flex align-items-center">
                  <BsFileEarmark size={34} className="me-2" />
                  <div>
                    <div className="fw-bold">ultimo-calculo.json</div>
                    <small className="text-muted">
                      No hay cálculos disponibles
                    </small>
                  </div>
                </div>
                {(userRole === "empleador" ||
                  userRole === "contador" ||
                  userRole === "asesor_legal" ||
                  userRole === "entidad_gubernamental") && (
                  <Button variant="outline-secondary">
                    <BsDownload size={20} />
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
