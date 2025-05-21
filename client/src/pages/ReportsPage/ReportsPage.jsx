import React from "react";
import { Container, Row, Col, Card, Button, Tab, Tabs } from "react-bootstrap";
import { BsFileEarmark, BsDownload } from "react-icons/bs";
import { jsPDF } from "jspdf";
import useAuth from "../../hooks/useAuth";
import useContracts from "../../hooks/useContracts";
import useContribution from "../../hooks/useContribution";

export const ReportsPage = () => {
  const { user } = useAuth();
  const { contracts } = useContracts();
  const { contributions } = useContribution();
  const userRole = user ? user.rol : null;

  // Combina cada contrato con sus contribuciones asociadas
  const combinedReports = contracts.map((contract) => {
    const relatedContributions = contributions.filter(
      (c) => c.contractId === contract.id
    );
    return { contract, contributions: relatedContributions };
  });

  // Función para generar y descargar un PDF con los datos de contrato y sus contribuciones
  const downloadPDF = (contract, contributions) => {
    const doc = new jsPDF();

    let yOffset = 20;
    doc.setFontSize(16);
    doc.text(`Reporte de Contrato #${contract.id}`, 20, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.text("Datos del Contrato:", 20, yOffset);
    yOffset += 8;

    // Listar propiedades principales del contrato
    const {
      id,
      salary,
      fecha_inicio,
      fecha_fin,
      ...otherFields
    } = contract;
    doc.text(`ID: ${id}`, 20, yOffset);
    yOffset += 6;
    doc.text(`Salario: ${salary}`, 20, yOffset);
    yOffset += 6;
    doc.text(
      `Fecha inicio: ${new Date(fecha_inicio).toLocaleDateString()}`,
      20,
      yOffset
    );
    yOffset += 6;
    doc.text(
      `Fecha fin: ${
        fecha_fin ? new Date(fecha_fin).toLocaleDateString() : "—"
      }`,
      20,
      yOffset
    );
    yOffset += 6;

    // Mostrar cualquier otro campo adicional del contrato
    Object.entries(otherFields).forEach(([key, value]) => {
      const textLine = `${key}: ${value !== null ? value : "—"}`;
      doc.text(textLine, 20, yOffset);
      yOffset += 6;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    yOffset += 4;
    doc.text("Contribuciones Asociadas:", 20, yOffset);
    yOffset += 8;

    if (contributions.length === 0) {
      doc.text("No hay contribuciones para este contrato.", 20, yOffset);
      yOffset += 6;
    } else {
      // Encabezado de tabla de contribuciones
      doc.setFont(undefined, "bold");
      doc.text("ID", 20, yOffset);
      doc.text("Monto", 60, yOffset);
      doc.text("Fecha", 110, yOffset);
      doc.setFont(undefined, "normal");
      yOffset += 6;

      contributions.forEach((c) => {
        if (yOffset > 280) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(String(c.id), 20, yOffset);
        doc.text(String(c.amount), 60, yOffset);
        doc.text(new Date(c.date).toLocaleDateString(), 110, yOffset);
        yOffset += 6;
      });
    }

    // Generar nombre de archivo y descargar
    const fileName = `reporte-contrato-${contract.id}.pdf`;
    doc.save(fileName);
  };

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
          {combinedReports.length === 0 ? (
            <p className="text-muted">No hay contratos disponibles para mostrar.</p>
          ) : (
            <Row className="g-4">
              {combinedReports.map(({ contract, contributions }) => (
                <Col key={contract.id} xs={12} md={6}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Contrato #{contract.id}</Card.Title>
                      <Card.Text>
                        <strong>Salario:</strong> {contract.salary} <br />
                        <strong>Fecha inicio:</strong>{" "}
                        {new Date(contract.fecha_inicio).toLocaleDateString()} <br />
                        <strong>Fecha fin:</strong>{" "}
                        {contract.fecha_fin
                          ? new Date(contract.fecha_fin).toLocaleDateString()
                          : "—"}{" "}
                        <br />
                        <strong>Otros campos:</strong>{" "}
                        {Object.entries(contract)
                          .filter(
                            ([key]) =>
                              ![
                                "id",
                                "salary",
                                "fecha_inicio",
                                "fecha_fin",
                              ].includes(key)
                          )
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ") || "N/A"}
                      </Card.Text>

                      <hr />

                      <Card.Subtitle className="mb-2">Contribuciones:</Card.Subtitle>
                      {contributions.length === 0 ? (
                        <p className="text-muted">No hay contribuciones para este contrato.</p>
                      ) : (
                        <ul className="ps-3">
                          {contributions.map((c) => (
                            <li key={c.id}>
                              <strong>ID contribución:</strong> {c.id} —{" "}
                              <strong>Monto:</strong> {c.amount} —{" "}
                              <strong>Fecha:</strong>{" "}
                              {new Date(c.date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      )}

                      {["empleador", "contador", "asesor_legal", "entidad_gubernamental"].includes(
                        userRole
                      ) && (
                        <div className="d-flex justify-content-end mt-3">
                          <Button
                            variant="outline-secondary"
                            onClick={() => downloadPDF(contract, contributions)}
                          >
                            <BsDownload size={20} className="me-2" />
                            Descargar PDF
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        <Tab eventKey="summary" title="Resumen (Próximamente)" disabled>
          <p className="text-muted">Esta sección estará disponible próximamente.</p>
        </Tab>
      </Tabs>
    </Container>
  );
};
