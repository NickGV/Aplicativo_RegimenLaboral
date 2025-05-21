import React, { useState, useEffect } from "react";
import { Card, Button, Container, Table, Spinner, Modal } from "react-bootstrap";
import { BiCalculator, BiPlus, BiTrash, BiInfoCircle, BiPrinter } from "react-icons/bi";
import CalculationsForm from "../../components/Calculations/CalculationsForm";
import useAuth from "../../hooks/useAuth";
import useContracts from "../../hooks/useContracts";
import useContribution from "../../hooks/useContribution";

const CalculationsPage = () => {
  const { user } = useAuth();
  const userRole = user ? user.rol : null;
  const { contracts, loading: loadingContracts } = useContracts();
  const { 
    contributions, 
    loading: loadingContributions, 
    handleCreateContribution,
    handleDeleteContribution 
  } = useContribution();

  const [showForm, setShowForm] = useState(false);
  const [calculos, setCalculos] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCalculo, setSelectedCalculo] = useState(null);

  useEffect(() => {
    if (contributions) {
      setCalculos(contributions);
    }
  }, [contributions]);

  const guardarCalculo = async (nuevoCalculo) => {
    try {
      const contratoId = parseInt(nuevoCalculo.contratoId);
      
      const contributionData = {
        contrato: contratoId,
        salario_base: parseFloat(nuevoCalculo.salarioBase),
        eps: parseFloat(nuevoCalculo.eps),
        arl: parseFloat(nuevoCalculo.arl),
        pension: parseFloat(nuevoCalculo.pension),
        cesantias: parseFloat(nuevoCalculo.cesantias),
        total: parseFloat(nuevoCalculo.total)
      };
      
      await handleCreateContribution(contributionData);
      setCalculos([nuevoCalculo, ...calculos]);
    } catch (error) {
      console.error("Error al guardar el cálculo:", error);
    }
  };

  const handleDeleteCalculo = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este cálculo? Esta acción no se puede deshacer.")) {
      try {
        await handleDeleteContribution(id);
        setCalculos(calculos.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error al eliminar el cálculo:", error);
      }
    }
  };

  const handleShowDetail = (calculo) => {
    setSelectedCalculo(calculo);
    setShowDetailModal(true);
  };

  const handlePrintCalculo = (calculo) => {
    const printWindow = window.open('', '_blank');
    const contrato = contracts.find(c => c.id === parseInt(calculo.contrato || calculo.contratoId));
    const fechaCalculo = calculo.fecha_calculo ? new Date(calculo.fecha_calculo).toLocaleDateString() : new Date().toLocaleDateString();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Cálculo de Aportes</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f4f4f4; }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cálculo de Aportes</h1>
              <p>Fecha: ${fechaCalculo}</p>
            </div>
            
            <h2>Información del Contrato</h2>
            <table>
              <tr>
                <th>Contrato</th>
                <td>${contrato?.titulo || "No disponible"}</td>
              </tr>
              <tr>
                <th>Salario Base</th>
                <td>$${parseInt(calculo.salarioBase || 0).toLocaleString("es-CO")}</td>
              </tr>
            </table>
            
            <h2>Detalle de Aportes</h2>
            <table>
              <tr>
                <th>Concepto</th>
                <th>Porcentaje</th>
                <th>Valor</th>
              </tr>
              <tr>
                <td>Aporte a EPS</td>
                <td>8.5%</td>
                <td>$${parseInt(calculo.eps || 0).toLocaleString("es-CO")}</td>
              </tr>
              <tr>
                <td>Aporte a ARL (Riesgo I)</td>
                <td>0.522%</td>
                <td>$${parseInt(calculo.arl || 0).toLocaleString("es-CO")}</td>
              </tr>
              <tr>
                <td>Aporte a Pensión</td>
                <td>12%</td>
                <td>$${parseInt(calculo.pension || 0).toLocaleString("es-CO")}</td>
              </tr>
              <tr>
                <td>Aporte a Cesantías</td>
                <td>8.33%</td>
                <td>$${parseInt(calculo.cesantias || 0).toLocaleString("es-CO")}</td>
              </tr>
              <tr>
                <th colspan="2">Total Aportes</th>
                <th>$${parseInt(calculo.total || 0).toLocaleString("es-CO")}</th>
              </tr>
            </table>
            
            <div class="footer">
              <p>Este documento es un cálculo informativo generado por el sistema de Régimen Laboral.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const loading = loadingContributions || loadingContracts;

  return (
    <Container fluid className="py-3 px-md-4">
      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <h2 className="mb-0">Cálculos de Aportes</h2>
        {(userRole === "empleador" || userRole === "contador") && (
          <Button variant="primary" onClick={() => setShowForm(true)} className="ms-md-2">
            <BiPlus className="me-1" /> Nuevo Cálculo
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : calculos.length === 0 ? (
        <Card className="shadow-sm text-center py-5">
          <BiCalculator className="text-muted mx-auto" style={{ fontSize: "3rem" }} />
          <Card.Title className="mt-3">Cálculos de Aportes</Card.Title>
          <Card.Text className="text-muted mb-4">
            No hay cálculos registrados
            <br />
            Realice su primer cálculo de aportes para ver los resultados aquí
          </Card.Text>
          {(userRole === "empleador" || userRole === "contador") && (
            <Button variant="primary" size="lg" onClick={() => setShowForm(true)}>
              <BiPlus /> Realizar Primer Cálculo
            </Button>
          )}
        </Card>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="mb-0">
            <thead>
              <tr>
                <th>Contrato</th>
                <th className="text-nowrap">Salario Base</th>
                <th>EPS</th>
                <th>ARL</th>
                <th>Pensión</th>
                <th>Cesantías</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calculos.map((calculo, index) => {
                const contrato = contracts.find(
                  (c) => c.id === parseInt(calculo.contrato || calculo.contratoId)
                );
                return (
                  <tr key={index}>
                    <td className="text-nowrap">{contrato?.titulo || "Contrato no encontrado"}</td>
                    <td>${parseInt(calculo.salarioBase || calculo.salario_base || 0).toLocaleString("es-CO")}</td>
                    <td>${parseInt(calculo.eps || 0).toLocaleString("es-CO")}</td>
                    <td>${parseInt(calculo.arl || 0).toLocaleString("es-CO")}</td>
                    <td>${parseInt(calculo.pension || 0).toLocaleString("es-CO")}</td>
                    <td>${parseInt(calculo.cesantias || 0).toLocaleString("es-CO")}</td>
                    <td>${parseInt(calculo.total || 0).toLocaleString("es-CO")}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleShowDetail(calculo)}
                          title="Ver detalles"
                          className="p-1"
                        >
                          <BiInfoCircle />
                        </Button>
                        
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handlePrintCalculo(calculo)}
                          title="Imprimir"
                          className="p-1"
                        >
                          <BiPrinter />
                        </Button>

                        {(userRole === "empleador" || userRole === "contador") && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteCalculo(calculo.id)}
                            title="Eliminar cálculo"
                            className="p-1"
                          >
                            <BiTrash />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      <CalculationsForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        contratos={contracts || []}
        guardarCalculo={guardarCalculo}
      />

      {/* Modal para mostrar detalles del cálculo */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)} 
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="h5">Detalle del Cálculo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedCalculo && (
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <h5 className="mb-3">Información del Contrato</h5>
                  <Table bordered className="mb-4 w-100">
                    <tbody>
                      <tr>
                        <th className="bg-light" style={{width: '40%'}}>Contrato</th>
                        <td>
                          {contracts.find(c => c.id === parseInt(selectedCalculo.contrato || selectedCalculo.contratoId))?.titulo || "No disponible"}
                        </td>
                      </tr>
                      <tr>
                        <th className="bg-light">Salario Base</th>
                        <td>${parseInt(selectedCalculo.salarioBase || 0).toLocaleString("es-CO")}</td>
                      </tr>
                    </tbody>
                  </Table>

                  <h5 className="mb-3">Desglose de Aportes</h5>
                  <div className="table-responsive">
                    <Table bordered className="mb-4">
                      <thead className="bg-light">
                        <tr>
                          <th>Concepto</th>
                          <th>Porcentaje</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Aporte a EPS</td>
                          <td>8.5%</td>
                          <td>${parseInt(selectedCalculo.eps || 0).toLocaleString("es-CO")}</td>
                        </tr>
                        <tr>
                          <td>Aporte a ARL</td>
                          <td>0.522%</td>
                          <td>${parseInt(selectedCalculo.arl || 0).toLocaleString("es-CO")}</td>
                        </tr>
                        <tr>
                          <td>Aporte a Pensión</td>
                          <td>12%</td>
                          <td>${parseInt(selectedCalculo.pension || 0).toLocaleString("es-CO")}</td>
                        </tr>
                        <tr>
                          <td>Aporte a Cesantías</td>
                          <td>8.33%</td>
                          <td>${parseInt(selectedCalculo.cesantias || 0).toLocaleString("es-CO")}</td>
                        </tr>
                        <tr className="table-primary">
                          <th colSpan="2">Total Aportes</th>
                          <th>${parseInt(selectedCalculo.total || 0).toLocaleString("es-CO")}</th>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <div className="alert alert-info mb-0">
                    <small>
                      <strong>Nota:</strong> Los cálculos se realizan de acuerdo a la normativa colombiana vigente. 
                      El cálculo de ARL asume un nivel de riesgo I (0.522%). Los porcentajes pueden variar según 
                      el sector y categoría de riesgo específico.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <div className="d-flex w-100 justify-content-between">
            <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
              Cerrar
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowDetailModal(false);
                handlePrintCalculo(selectedCalculo);
              }}
            >
              <BiPrinter className="me-1" /> Imprimir
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CalculationsPage;