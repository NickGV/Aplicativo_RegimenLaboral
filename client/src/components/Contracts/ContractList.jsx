import { Table, Badge } from "react-bootstrap";

export const ContractList = ({ contracts = [] }) => {
  if (!contracts.length) {
    return <div className="text-center text-muted py-4">No hay contratos registrados.</div>;
  }
  return (
    <Table striped bordered hover responsive size="sm" className="mb-0">
      <thead>
        <tr>
          <th>Título</th>
          <th>Tipo</th>
          <th>Fecha Inicio</th>
          <th>Salario</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map((contrato) => (
          <tr key={contrato.id}>
            <td>{contrato.titulo}</td>
            <td>{contrato.tipo?.replace(/_/g, " ")}</td>
            <td>{contrato.fecha_inicio}</td>
            <td>${parseInt(contrato.salario).toLocaleString("es-CO")}</td>
            <td>
              <Badge bg={contrato.estado === "Activo" ? "success" : "secondary"}>
                {contrato.estado || (contrato.terminated ? "Terminado" : "Activo")}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
