import React, { useState } from 'react';
import { Modal, Form, Button, Table, Card } from 'react-bootstrap';
import { BiSave, BiCalculator } from 'react-icons/bi';

const CalculationsForm = ({ show, handleClose, contratos, guardarCalculo }) => {
  const [formData, setFormData] = useState({
    contratoId: '',
    salario: 0
  });

  const [resultados, setResultados] = useState(null);

  const calcularAportes = () => {
    const salario = parseFloat(formData.salario) || 0;
    const nuevosResultados = {
      eps: salario * 0.085,
      arl: salario * 0.00522,
      pension: salario * 0.12,
      cesantias: salario * 0.0833,
      total: salario * (0.085 + 0.00522 + 0.12 + 0.0833)
    };
    setResultados(nuevosResultados);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resultados) {
      guardarCalculo({
        contratoId: formData.contratoId,
        salarioBase: formData.salario,
        ...resultados,
        fecha: new Date().toLocaleDateString()
      });
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Cálculo de Aportes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="mb-4">
          <Card.Body>
            <p className="text-muted">
              Seleccione un contrato y calcule los aportes al sistema de seguridad social
            </p>

            <Form.Group className="mb-3">
              <Form.Label><strong>Contrato</strong></Form.Label>
              <Form.Select 
                name="contratoId" 
                value={formData.contratoId}
                onChange={(e) => setFormData({...formData, contratoId: e.target.value})}
                required
              >
                <option value="">Seleccione un contrato</option>
                {contratos.map(contrato => (
                  <option key={contrato.id} value={contrato.id}>
                    {contrato.titulo} (${contrato.salario?.toLocaleString() || '0'})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label><strong>Salario Base de Cotización</strong></Form.Label>
              <Form.Control
                type="number"
                name="salario"
                value={formData.salario}
                onChange={(e) => setFormData({...formData, salario: e.target.value})}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" onClick={calcularAportes}>
                <BiCalculator /> Calcular Aportes
              </Button>
            </div>
          </Card.Body>
        </Card>

        {resultados && (
          <Card>
            <Card.Body>
              <h5 className="mb-3">Resultados del Cálculo</h5>
              <p className="text-muted mb-4">
                Aportes al sistema de seguridad social según la normativa colombiana
              </p>

              <Table bordered className="mb-4">
                <thead>
                  <tr>
                    <th>Aporte a EPS (8.5%)</th>
                    <th>Aporte a ARL (0.522%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${resultados.eps.toLocaleString()}</td>
                    <td>${resultados.arl.toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>

              <Table bordered className="mb-4">
                <thead>
                  <tr>
                    <th>Aporte a Pensión (12%)</th>
                    <th>Aporte a Cesantías (8.33%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${resultados.pension.toLocaleString()}</td>
                    <td>${resultados.cesantias.toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="text-end">
                Total Aportes: ${resultados.total.toLocaleString()}
              </h5>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!resultados}
        >
          <BiSave /> Guardar Cálculo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CalculationsForm;