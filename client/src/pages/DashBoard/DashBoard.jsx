import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { BsPeople, BsFileEarmark, BsExclamationTriangle, BsX } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import useContracts from "../../hooks/useContracts";
import useContribution from "../../hooks/useContribution";
import { ContractForm } from "../../components/Contracts/ContractForm";
import { ContractList } from "../../components/Contracts/ContractList";

export const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user ? user.rol : null;
  const { contracts } = useContracts();
  const { contributions } = useContribution();
  const [showForm, setShowForm] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Totales
  const totalContratos = contracts.length;
  const activos = contracts.filter((c) => c.estado === "Activo").length;
  const finalizados = contracts.filter((c) => c.estado !== "Activo").length;
  const totalCalculos = contributions ? contributions.length : 0;
  const getContratosProximosAVencer = () => {
    const hoy = new Date();
    const en7Dias = new Date();
    en7Dias.setDate(hoy.getDate() + 7);

    return contracts.filter(contrato => {
      // Solo verificar contratos activos
      if (contrato.estado !== "Activo") return false;
      
      // Verificar si el contrato tiene fecha de fin
      if (!contrato.fecha_fin) return false;
      
      const fechaFin = new Date(contrato.fecha_fin);
      
      // Verificar si la fecha de fin está entre hoy y 7 días
      return fechaFin >= hoy && fechaFin <= en7Dias;
    });
  };

  const contratosProximosAVencer = getContratosProximosAVencer();
  const handleDismissAlert = (contratoId) => {
    setDismissedAlerts(prev => new Set([...prev, contratoId]));
  };
  const getDiasRestantes = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diferencia = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    return diferencia;
  };
  // Contratos recientes (últimos 5)
  const contratosRecientes = [...contracts]
    .sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))
    .slice(0, 5);

  return (
    <Container className="py-4">
      <h1 className="mb-4">Dashboard</h1>
       {/* Alertas de contratos próximos a vencer */}
      {contratosProximosAVencer.length > 0 && (
        <div className="mb-4">
          {contratosProximosAVencer
            .filter(contrato => !dismissedAlerts.has(contrato.id))
            .map(contrato => {
              const diasRestantes = getDiasRestantes(contrato.fecha_fin);
              return (
                <Alert 
                  key={contrato.id} 
                  variant="warning" 
                  className="d-flex align-items-center justify-content-between"
                  dismissible
                  onClose={() => handleDismissAlert(contrato.id)}
                >
                  <div className="d-flex align-items-center">
                    <BsExclamationTriangle className="me-2" size={20} />
                    <div>
                      <strong>¡Contrato próximo a vencer!</strong>
                      <br />
                      El contrato "<strong>{contrato.titulo}</strong>" con {contrato.empleado?.username || contrato.empleado?.email || contrato.empleado} 
                      {diasRestantes === 1 ? 
                        " vence mañana" : 
                        ` vence en ${diasRestantes} días`
                      } ({new Date(contrato.fecha_fin).toLocaleDateString()})
                    </div>
                  </div>
                </Alert>
              );
            })
          }
        </div>
      )}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm rounded-3"
          style={{ width: "100%", minHeight: "168px" }}>
            <Card.Body>
              <Card.Subtitle className="text-secondary">
                Total Contratos
              </Card.Subtitle>
              <div className="d-flex align-items-center my-2">
                <h2 className="mb-0 me-auto">{totalContratos}</h2>
                <BsPeople className="fs-3 text-secondary" />
              </div>
              <small className="text-muted">
                {activos} activos, {finalizados} finalizados
                {contratosProximosAVencer.length > 0 && (
                  <span className="text-warning d-block">
                    ⚠️ {contratosProximosAVencer.length} por vencer pronto
                  </span>
                )}
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm rounded-3"
          style={{ width: "100%", minHeight: "168px" }}>
            <Card.Body>
              <Card.Subtitle className="text-secondary">
                Cálculos Recientes
              </Card.Subtitle>
              <div className="d-flex align-items-center my-2">
                <h2 className="mb-0 me-auto">{totalCalculos}</h2>
                <BsFileEarmark className="fs-3 text-secondary" />
              </div>
              <small className="text-muted"></small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm rounded-3">
            <Card.Body>
              <Card.Subtitle className="text-secondary">
                Acciones Rápidas
              </Card.Subtitle>
              <Form className="mt-3 d-grid gap-2"
              style={{ width: "100%", minHeight: "100px" }}>
                {userRole === "empleador" && (
                  <>
                    <Button
                      variant="dark"
                      size="lg"
                      onClick={() => setShowForm(true)}
                    >
                      + Nuevo Contrato
                    </Button>
                    <Button variant="outline-dark" size="lg">
                      Nuevo Cálculo
                    </Button>
                  </>
                )}
                {userRole === "contador" && (
                  <Button variant="outline-dark" size="lg">
                    Nuevo Cálculo
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contratos Recientes */}
      <Card className="shadow-sm rounded-3 p-4">
        <Card.Subtitle className="text-secondary mb-3">
          Contratos Recientes
        </Card.Subtitle>
        <ContractList contracts={contratosRecientes} />
      </Card>

      <ContractForm
        show={showForm}
        handleClose={() => setShowForm(false)}
      />
    </Container>
  );
};
