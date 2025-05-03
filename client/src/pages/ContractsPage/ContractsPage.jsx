import React, { useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { BiSearch, BiPencil, BiTrash, BiDollar, BiPlus } from 'react-icons/bi';
import {ContractForm} from '../../components/Contracts/ContractForm';

export const ContractsPage = () => {
  const [contratos, setContratos] = useState([
    {
      id: 1,
      titulo: 'Contrato Ejemplo',
      tipo: 'termino_indefinido',
      fechaInicio: '01/01/2023',
      fechaFin: '',
      salario: '3000000',
      estado: 'Active'
    }
  ]);

  const [showForm, setShowForm] = useState(false);

  const agregarContrato = (nuevoContrato) => {
    setContratos([...contratos, nuevoContrato]);
  };

  return (
    <Container className="py-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Contratos</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <BiPlus /> Nuevo Contrato
        </Button>
      </div>

      {/* Tabla de contratos */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Fecha Inicio</th>
            <th>Salario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contratos.map(contrato => (
            <tr key={contrato.id}>
              <td>{contrato.titulo}</td>
              <td>{contrato.tipo.replace(/_/g, ' ')}</td>
              <td>{contrato.fechaInicio}</td>
              <td>${parseInt(contrato.salario).toLocaleString('es-CO')}</td>
              <td>
                <span className={`badge ${contrato.estado === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                  {contrato.estado}
                </span>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2">
                  <BiPencil /> Editar
                </Button>
                <Button variant="outline-danger" size="sm" className="me-2">
                  <BiTrash /> Eliminar
                </Button>
                <Button variant="outline-success" size="sm">
                  <BiDollar /> Pagar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Formulario modal */}
      <ContractForm 
        show={showForm} 
        handleClose={() => setShowForm(false)} 
        agregarContrato={agregarContrato} 
      />
    </Container>
  );
};