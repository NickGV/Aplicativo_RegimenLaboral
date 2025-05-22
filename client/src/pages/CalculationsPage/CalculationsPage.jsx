import React, { useEffect, useState } from "react";
import { Card, Button, Container, Table, Spinner, Modal, Form, Row, Col } from "react-bootstrap";
import { BiCalculator, BiPlus, BiTrash, BiInfoCircle, BiPrinter } from "react-icons/bi";
import CalculationsForm from "../../components/Calculations/CalculationsForm";
import useAuth from "../../hooks/useAuth";
import useContracts from "../../hooks/useContracts";
import useContribution from "../../hooks/useContribution";
import jsPDF from 'jspdf';
import { BiSolidFilePdf } from 'react-icons/bi';

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
  const [filterContract, setFilterContract] = useState("");
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
                <td>$${parseInt(calculo.salario_base || 0).toLocaleString("es-CO")}</td>
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

  const handleDownloadPdf = (calculo) => {
    const contrato = contracts.find(c => c.id === parseInt(calculo.contrato || calculo.contratoId));
    const fechaCalculo = calculo.fecha_calculo ? new Date(calculo.fecha_calculo).toLocaleDateString() : new Date().toLocaleDateString();
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Cálculo de Aportes', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Fecha: ${fechaCalculo}`, 190, 10, { align: 'right' });
    let y = 30;
    doc.setFontSize(14);
    doc.text('Información del Contrato', 10, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Contrato:`, 10, y);
    doc.text(`${contrato?.titulo || "No disponible"}`, 40, y);
    y += 7;
    doc.text(`Salario Base:`, 10, y);
    doc.text(`$${parseInt(calculo.salario_base || 0).toLocaleString("es-CO")}`, 40, y);
    y += 12;
    doc.setFontSize(14);
    doc.text('Detalle de Aportes', 10, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Concepto', 10, y);
    doc.text('Porcentaje', 90, y);
    doc.text('Valor', 150, y);
    doc.setFont(undefined, 'normal');
    y += 6;
    doc.text('Aporte a EPS', 10, y);
    doc.text('8.5%', 90, y);
    doc.text(`$${parseInt(calculo.eps || 0).toLocaleString("es-CO")}`, 150, y);
    y += 6;
    doc.text('Aporte a ARL (Riesgo I)', 10, y);
    doc.text('0.522%', 90, y);
    doc.text(`$${parseInt(calculo.arl || 0).toLocaleString("es-CO")}`, 150, y);
    y += 6;
    doc.text('Aporte a Pensión', 10, y);
    doc.text('12%', 90, y);
    doc.text(`$${parseInt(calculo.pension || 0).toLocaleString("es-CO")}`, 150, y);
    y += 6;
    doc.text('Aporte a Cesantías', 10, y);
    doc.text('8.33%', 90, y);
    doc.text(`$${parseInt(calculo.cesantias || 0).toLocaleString("es-CO")}`, 150, y);
    y += 8;
    doc.setFont(undefined, 'bold');
    doc.text('Total Aportes', 10, y);
    doc.text(`$${parseInt(calculo.total || 0).toLocaleString("es-CO")}`, 150, y);
    doc.setFont(undefined, 'normal');
    y += 15;
    doc.setFontSize(9);
    doc.text('Este documento es un cálculo informativo generado por el sistema de Régimen Laboral.', 10, y, { maxWidth: 190 });
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculo_de_aportes.pdf';
    a.click();
  };

  const loading = loadingContributions || loadingContracts;

  const filteredCalculos = calculos.filter((calculo) => {
    const contrato = contracts.find(c => c.id === parseInt(calculo.contrato || calculo.contratoId));
    const titulo = contrato?.titulo?.toLowerCase() || "";
    return (
      !filterContract ||
      titulo.includes(filterContract.trim().toLowerCase())
    );
  });

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Cálculos de Aportes</h2>
        {(userRole === "empleador" || userRole === "contador") && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <BiPlus /> Nuevo Cálculo
          </Button>
        )}
      </div>

      <Form className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Label>Filtrar por Contrato</Form.Label>
            <Form.Control
              type="text"
              value={filterContract}
              onChange={(e) => setFilterContract(e.target.value)}
            />
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : filteredCalculos.length === 0 ? (
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Contrato</th>
              <th>Salario Base</th>
              <th>EPS (8.5%)</th>
              <th>ARL (0.522%)</th>
              <th>Pensión (12%)</th>
              <th>Cesantías (8.33%)</th>
              <th>Total Aportes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalculos.map((calculo, index) => {
              const contrato = contracts.find(
                (c) => c.id === parseInt(calculo.contrato || calculo.contratoId)
              );
              return (
                <tr key={index}>
                  <td>{contrato?.titulo || "Contrato no encontrado"}</td>
                  <td>
                    ${parseInt(calculo.salarioBase || calculo.salario_base || 0).toLocaleString("es-CO")}
                  </td>
                  <td>${parseInt(calculo.eps || 0).toLocaleString("es-CO")}</td>
                  <td>${parseInt(calculo.arl || 0).toLocaleString("es-CO")}</td>
                  <td>${parseInt(calculo.pension || 0).toLocaleString("es-CO")}</td>
                  <td>${parseInt(calculo.cesantias || 0).toLocaleString("es-CO")}</td>
                  <td>${parseInt(calculo.total || 0).toLocaleString("es-CO")}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleShowDetail(calculo)}
                        title="Ver detalles"
                      >
                        <BiInfoCircle />
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => handlePrintCalculo(calculo)}
                        title="Imprimir"
                      >
                        <BiPrinter />
                      </Button>
                      {(userRole === "empleador" || userRole === "contador") && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteCalculo(calculo.id)}
                          title="Eliminar cálculo"
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
      )}

      <CalculationsForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        contratos={contracts || []}
        guardarCalculo={guardarCalculo}
      />

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Cálculo de Aportes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCalculo && (
            <div>
              <h5>Información del Contrato</h5>
              <Table bordered className="mb-4">
                <tbody>
                  <tr>
                    <th className="bg-light" width="30%">Contrato</th>
                    <td>
                      {contracts.find(c => c.id === parseInt(selectedCalculo.contrato || selectedCalculo.contratoId))?.titulo || "No disponible"}
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-light">Salario Base</th>
                    <td>${parseInt(selectedCalculo.salario_base || 0).toLocaleString("es-CO")}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">Fecha de Cálculo</th>
                    <td>
                      {selectedCalculo.fecha_calculo 
                        ? new Date(selectedCalculo.fecha_calculo).toLocaleString() 
                        : new Date().toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
              <h5>Desglose de Aportes</h5>
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
                    <td>Aporte a ARL (Riesgo I)</td>
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
              <div className="alert alert-info">
                <small>
                  <strong>Nota:</strong> Los cálculos se realizan de acuerdo a la normativa colombiana vigente. 
                  El cálculo de ARL asume un nivel de riesgo I (0.522%). Los porcentajes pueden variar según 
                  el sector y categoría de riesgo específico.
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Cerrar
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowDetailModal(false);
              handlePrintCalculo(selectedCalculo);
            }}
          >
            <BiPrinter /> Imprimir
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowDetailModal(false);
              handleDownloadPdf(selectedCalculo);
            }}
          >
            <BiSolidFilePdf /> Descargar PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CalculationsPage;
