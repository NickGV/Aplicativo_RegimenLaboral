import React, { useState } from "react";
import { Card, Button, Container, Table } from "react-bootstrap";
import { BiCalculator, BiPlus } from "react-icons/bi";
import CalculationsForm from "../../components/Calculations/CalculationsForm";
import useAuth from "../../hooks/useAuth";

const CalculationsPage = () => {
  const { user } = useAuth();
  const userRole = user ? user.rol : null;

  const [showForm, setShowForm] = useState(false);
  const [calculos, setCalculos] = useState([]);
  const [contratos] = useState([
    // ← Datos de ejemplo
    { id: 1, titulo: "Contrato 1", salario: 2500000 },
    { id: 2, titulo: "Contrato 2", salario: 3500000 },
  ]);

  const guardarCalculo = (nuevoCalculo) => {
    setCalculos([nuevoCalculo, ...calculos]);
  };

  return (
    <Container className="py-4">
      {calculos.length === 0 ? (
        <Card className="shadow-sm text-center py-5">
          <BiCalculator
            className="text-muted mx-auto"
            style={{ fontSize: "3rem" }}
          />
          <Card.Title className="mt-3">Cálculos de Aportes</Card.Title>
          <Card.Text className="text-muted mb-4">
            No hay cálculos registrados
            <br />
            Realice su primer cálculo de aportes para ver los resultados aquí
          </Card.Text>
          {(userRole === "empleador" || userRole === "contador") && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowForm(true)}
            >
              <BiPlus /> Realizar Primer Cálculo
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Cálculos de Aportes</h2>
            {(userRole === "empleador" || userRole === "contador") && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <BiPlus /> Nuevo Cálculo
              </Button>
            )}
          </div>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Contrato</th>
                <th>Salario Base</th>
                <th>Total Aportes</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calculos.map((calculo, index) => {
                const contrato = contratos.find(
                  (c) => c.id === calculo.contratoId
                );
                return (
                  <tr key={index}>
                    <td>{contrato?.titulo || "Contrato no encontrado"}</td>
                    <td>${parseFloat(calculo.salarioBase).toLocaleString()}</td>
                    <td>${calculo.total.toLocaleString()}</td>
                    <td>{calculo.fecha}</td>
                    <td>
                      <Button variant="outline-primary" size="sm">
                        Detalles
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      <CalculationsForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        contratos={contratos}
        guardarCalculo={guardarCalculo}
      />
    </Container>
  );
};

export default CalculationsPage;
