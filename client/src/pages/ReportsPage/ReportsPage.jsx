import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Tab, Tabs, Form } from "react-bootstrap";

import { BsFileEarmark, BsDownload } from "react-icons/bs";
import { jsPDF } from "jspdf";
import useAuth from "../../hooks/useAuth";
import useContribution from "../../hooks/useContribution";
import { userDetail } from "../../services/authService";

export const ReportsPage = () => {
  const { user } = useAuth();
  const { contributions } = useContribution();
  const userRole = user ? user.rol : null;
  const [employerData, setEmployerData] = useState({});

  useEffect(() => {
    const fetchEmployersData = async () => {
      const employerIds = [...new Set(contributions.map((c) => c.contrato_detalle.empleador))];
      const employerInfo = {};

      for (const id of employerIds) {
        try {
          const data = await userDetail(id);
          employerInfo[id] = data;
        } catch (error) {
          console.error(`Error fetching employer data for ID ${id}:`, error);
          employerInfo[id] = { username: `Empleador ID: ${id}` }; // Fallback
        }
      }

      setEmployerData(employerInfo);
    };

    if (contributions.length > 0) {
      fetchEmployersData();
    }
  }, [contributions]);

  const [filterContractId, setFilterContractId] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFechaInicio, setFilterFechaInicio] = useState("");
  const [filterFechaFin, setFilterFechaFin] = useState("");
  const [filterContributionId, setFilterContributionId] = useState("");
  const [filterFechaCalculo, setFilterFechaCalculo] = useState("");
 

  const downloadPDF = (contribution) => {
    const doc = new jsPDF();
    let yOffset = 20;
    const {
      id: contributionId,
      arl,
      cesantias,
      eps,
      pension,
      total,
      fecha_calculo,
      contrato_detalle,
    } = contribution;
    const {
      id: contractId,
      titulo,
      tipo,
      salario,
      fecha_inicio,
      fecha_fin,
      descripcion,
      estado,
      empleado,
      empleador,
    } = contrato_detalle;
    doc.setFontSize(16);
    doc.text(`Reporte de Contrato #${contractId}`, 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text("Datos del Contrato:", 20, yOffset);
    yOffset += 8;
    doc.text(`ID: ${contractId}`, 20, yOffset);
    yOffset += 6;
    doc.text(`Título: ${titulo}`, 20, yOffset);
    yOffset += 6;
    doc.text(`Tipo: ${tipo}`, 20, yOffset);
    yOffset += 6;
    doc.text(`Salario Base: ${salario}`, 20, yOffset);
    yOffset += 6;
    doc.text(
      `Fecha inicio: ${new Date(fecha_inicio).toLocaleDateString()}`,
      20,
      yOffset
    );
    yOffset += 6;
    doc.text(
      `Fecha fin: ${fecha_fin ? new Date(fecha_fin).toLocaleDateString() : "—"}`,
      20,
      yOffset
    );
    yOffset += 6;
    doc.text(`Estado: ${estado}`, 20, yOffset);
    yOffset += 6;
    doc.text(`Descripción: ${descripcion || "—"}`, 20, yOffset);
    yOffset += 6;    doc.text(`Empleado: ${empleado.username} (ID: ${empleado.id})`, 20, yOffset);
    yOffset += 6;
    const employerName = employerData[empleador]?.username || `Empleador ID: ${empleador}`;
    doc.text(`Empleador: ${employerName}`, 20, yOffset);
    yOffset += 6;
    yOffset += 4;
    doc.text("Detalles de la Contribución:", 20, yOffset);
    yOffset += 8;
    doc.text(`ID Contribución: ${contributionId}`, 20, yOffset);
    yOffset += 6;
    doc.text(
      `Fecha de Cálculo: ${new Date(fecha_calculo).toLocaleDateString()}`,
      20,
      yOffset
    );
    yOffset += 6;
    doc.setFont(undefined, "bold");
    doc.text("Concepto", 20, yOffset);
    doc.text("Monto", 100, yOffset);
    doc.setFont(undefined, "normal");
    yOffset += 6;
    const lineItems = [
      { label: "ARL", value: arl },
      { label: "Cesantías", value: cesantias },
      { label: "EPS", value: eps },
      { label: "Pensión", value: pension },
      { label: "Total", value: total },
    ];
    lineItems.forEach(({ label, value }) => {
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20;
      }
      doc.text(label, 20, yOffset);
      doc.text(String(value), 100, yOffset);
      yOffset += 6;
    });
    const fileName = `reporte-contrato-${contractId}-contribucion-${contributionId}.pdf`;
    doc.save(fileName);
  };

  const filteredContributions = contributions.filter((c) => {
    const cd = c.contrato_detalle;
    if (
      filterContractId &&
      String(cd.id) !== filterContractId.trim()
    ) {
      return false;
    }
    if (
      filterTitle &&
      !cd.titulo.toLowerCase().includes(filterTitle.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      filterType &&
      !cd.tipo.toLowerCase().includes(filterType.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      filterFechaInicio &&
      new Date(cd.fecha_inicio).toISOString().slice(0, 10) !== filterFechaInicio
    ) {
      return false;
    }
    if (
      filterFechaFin &&
      cd.fecha_fin &&
      new Date(cd.fecha_fin).toISOString().slice(0, 10) !== filterFechaFin
    ) {
      return false;
    }
    if (
      filterContributionId &&
      String(c.id) !== filterContributionId.trim()
    ) {
      return false;
    }
    if (
      filterFechaCalculo &&
      new Date(c.fecha_calculo).toISOString().slice(0, 10) !== filterFechaCalculo
    ) {
      return false;
    }
    return true;
  });

  return (
    <Container className="p-4">
      <h1 className="mb-4">Reportes</h1>

      <Tabs defaultActiveKey="all" id="reports-tabs" className="mb-4">
        <Tab
          eventKey="all"
          title="Todos los reportes"
          disabled={
            !["empleador", "contador", "asesor_legal", "entidad_gubernamental"].includes(
              userRole
            )
          }
        >
          <Form className="mb-4">
            <Row className="g-3">
              <Col md={2}>
                <Form.Label>Contrato ID</Form.Label>
                <Form.Control
                  type="text"
                  value={filterContractId}
                  onChange={(e) => setFilterContractId(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={filterFechaInicio}
                  onChange={(e) => setFilterFechaInicio(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={filterFechaFin}
                  onChange={(e) => setFilterFechaFin(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Contribución ID</Form.Label>
                <Form.Control
                  type="text"
                  value={filterContributionId}
                  onChange={(e) => setFilterContributionId(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Fecha Cálculo</Form.Label>
                <Form.Control
                  type="date"
                  value={filterFechaCalculo}
                  onChange={(e) => setFilterFechaCalculo(e.target.value)}
                />
              </Col>
            </Row>
          </Form>

          {filteredContributions.length === 0 ? (
            <p className="text-muted">No hay cálculos disponibles para mostrar.</p>
          ) : (
            <Row className="g-4">
              {filteredContributions.map((c) => {
                if (userRole === "empleado" && c.contrato_detalle?.empleado?.id !== user.id) {
                  return null;
                }
                
                const { contrato_detalle } = c;
                const {
                  id: contractId,
                  titulo,
                  tipo,
                  salario,
                  fecha_inicio,
                  fecha_fin,
                  empleador
                } = contrato_detalle;
                
                const employerName = employerData[empleador]?.username || `Empleador ID: ${empleador}`;

                return (
                  <Col key={c.id} xs={12} md={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Contrato #{contractId}</Card.Title>
                        <Card.Text>
                          <strong>Título:</strong> {titulo} <br />
                          <strong>Tipo:</strong> {tipo} <br />                          <strong>Salario Base:</strong> {salario} <br />
                          <strong>Fecha inicio:</strong>{" "}
                          {new Date(fecha_inicio).toLocaleDateString()} <br />
                          <strong>Fecha fin:</strong>{" "}
                          {fecha_fin ? new Date(fecha_fin).toLocaleDateString() : "—"}<br />
                          <strong>Empleador:</strong> {employerName}
                        </Card.Text>

                        <hr />

                        <Card.Subtitle className="mb-2">
                          Detalles de la Contribución
                        </Card.Subtitle>
                        <ul className="ps-3">
                          <li>
                            <strong>ID Contribución:</strong> {c.id}
                          </li>
                          <li>
                            <strong>Fecha de Cálculo:</strong>{" "}
                            {new Date(c.fecha_calculo).toLocaleDateString()}
                          </li>
                          <li>
                            <strong>ARL:</strong> {c.arl}
                          </li>
                          <li>
                            <strong>Cesantías:</strong> {c.cesantias}
                          </li>
                          <li>
                            <strong>EPS:</strong> {c.eps}
                          </li>
                          <li>
                            <strong>Pensión:</strong> {c.pension}
                          </li>
                          <li>
                            <strong>Total:</strong> {c.total}
                          </li>
                        </ul>

                        {["empleador", "contador", "asesor_legal", "entidad_gubernamental", "empleado"].includes(
                          userRole
                        ) && (
                          <div className="d-flex justify-content-end mt-3">
                            <Button
                              variant="outline-secondary"
                              onClick={() => downloadPDF(c)}
                            >
                              <BsDownload size={20} className="me-2" />
                              Descargar PDF
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};
