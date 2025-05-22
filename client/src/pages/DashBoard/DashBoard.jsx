import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { BsPeople, BsFileEarmark } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import useContracts from "../../hooks/useContracts";
import CalculationsForm from "../../components/Calculations/CalculationsForm";
import { ContractForm } from "../../components/Contracts/ContractForm";
import { ContractList } from "../../components/Contracts/ContractList";

export const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user ? user.rol : null;
  const { contracts } = useContracts();
  const [showForm, setShowForm] = useState(false);
  const [showCalcForm, setShowCalcForm] = useState(false);
  const [calculations, setCalculations] = useState([]);

  const totalContratos = contracts.length;
  const activos = contracts.filter((c) => c.estado === "Activo").length;
  const finalizados = contracts.filter((c) => c.estado !== "Activo").length;

  const contratosRecientes = [...contracts]
    .sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))
    .slice(0, 5);

  const guardarCalculo = (newCalc) => {
    setCalculations((prev) => [...prev, newCalc]);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Dashboard</h1>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm rounded-3" style={{ width: "100%", minHeight: "168px" }}>
            <Card.Body>
              <Card.Subtitle className="text-secondary">Total Contratos</Card.Subtitle>
              <div className="d-flex align-items-center my-2">
                <h2 className="mb-0 me-auto">{totalContratos}</h2>
                <BsPeople className="fs-3 text-secondary" />
              </div>
              <small className="text-muted">{activos} activos, {finalizados} finalizados</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm rounded-3" style={{ width: "100%", minHeight: "168px" }}>
            <Card.Body>
              <Card.Subtitle className="text-secondary">Cálculos Recientes</Card.Subtitle>
              <div className="d-flex align-items-center my-2">
                <h2 className="mb-0 me-auto">{calculations.length}</h2>
                <BsFileEarmark className="fs-3 text-secondary" />
              </div>
              <small className="text-muted">
                {calculations.length > 0
                  ? `Último: ${calculations[calculations.length - 1].fecha}`
                  : "Realiza tu primer cálculo"}
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm rounded-3">
            <Card.Body>
              <Card.Subtitle className="text-secondary">Acciones Rápidas</Card.Subtitle>
              <Form className="mt-3 d-grid gap-2" style={{ width: "100%", minHeight: "100px" }}>
                {userRole === "empleador" && (
                  <>
                    <Button variant="dark" size="lg" onClick={() => setShowForm(true)}>
                      + Nuevo Contrato
                    </Button>
                    <Button variant="outline-dark" size="lg" onClick={() => setShowCalcForm(true)}>
                      Nuevo Cálculo
                    </Button>
                  </>
                )}
                {userRole === "contador" && (
                  <Button variant="outline-dark" size="lg" onClick={() => setShowCalcForm(true)}>
                    Nuevo Cálculo
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm rounded-3 p-4 mb-4">
        <Card.Subtitle className="text-secondary mb-3">Contratos Recientes</Card.Subtitle>
        <ContractList contracts={contratosRecientes} />
      </Card>

      <ContractForm show={showForm} handleClose={() => setShowForm(false)} />

      <CalculationsForm
        show={showCalcForm}
        handleClose={() => setShowCalcForm(false)}
        contratos={contracts}
        guardarCalculo={guardarCalculo}
      />
    </Container>
  );
};
