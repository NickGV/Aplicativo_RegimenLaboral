import React, { useEffect, useState } from "react";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import { BiSearch, BiPencil, BiTrash, BiDollar, BiPlus } from "react-icons/bi";
import { ContractForm } from "../../components/Contracts/ContractForm";
import useAuth from "../../hooks/useAuth";
import useContracts from "../../hooks/useContracts";

export const ContractsPage = () => {
  const { user } = useAuth();
  const userRole = user ? user.rol : null;  const {
    contracts,
    loading,
    handleTerminateContract,
    handleUpdateContract,
    handleCreateContract
  } = useContracts();
  const [showForm, setShowForm] = useState(false);
  const [editContract, setEditContract] = useState(null);



  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este contrato?")) {
      handleTerminateContract(id, new Date().toISOString().split("T")[0]);
    }
  };

  const handleEdit = (contrato) => {
    setEditContract(contrato);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditContract(null);
  };
  const handleFormSave = async (formData) => {
    if (editContract) {
      await handleUpdateContract(editContract.id, formData);
    } else {
      await handleCreateContract(formData);
    }
    handleFormClose();
  };

  const handleToggleEstado = (contrato) => {
    const nuevoEstado = contrato.estado === "Activo" ? "Terminado" : "Activo";
    handleUpdateContract(contrato.id, { estado: nuevoEstado });
  };

  return (
    <Container className="py-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Contratos</h2>
        {userRole === "empleador" && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <BiPlus /> Nuevo Contrato
          </Button>
        )}
      </div>

      {/* Tabla de contratos */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Título</th>
              <th>Empleado</th>
              <th>Tipo</th>
              <th>Fecha Inicio</th>
              <th>Salario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contracts && contracts.length > 0 ? (
              contracts.map((contrato) => (
                <tr key={contrato.id}>
                  <td>{contrato.titulo}</td>
                  <td>{contrato.empleado?.username || contrato.empleado?.email || contrato.empleado}</td>
                  <td>{contrato.tipo?.replace(/_/g, " ")}</td>
                  <td>{contrato.fecha_inicio}</td>
                  <td>${parseInt(contrato.salario).toLocaleString("es-CO")}</td>
                  <td>
                    <Button
                      variant={
                        contrato.estado === "Activo" ? "success" : "secondary"
                      }
                      size="sm"
                      className="w-100"
                      onClick={() => handleToggleEstado(contrato)}
                      title="Cambiar estado"
                    >
                      {contrato.estado || (contrato.terminated ? "Terminado" : "Activo")}
                    </Button>
                  </td>
                  <td>
                    {userRole === "empleador" && (
                      <>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(contrato)}
                        >
                          <BiPencil /> Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDelete(contrato.id)}
                        >
                          <BiTrash /> Eliminar
                        </Button>

                      </>
                    )}
                    <Button variant="outline-success" size="sm">
                      <BiDollar /> Pagar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay contratos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <ContractForm
        show={showForm}
        handleClose={handleFormClose}
        initialData={editContract}
        onSave={handleFormSave}
      />
    </Container>
  );
};
