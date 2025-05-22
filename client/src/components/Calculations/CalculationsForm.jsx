import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Table, Card } from 'react-bootstrap';
import { BiSave, BiCalculator } from 'react-icons/bi';

const CalculationsForm = ({ show, handleClose, contratos, guardarCalculo }) => {
  const [formData, setFormData] = useState({
    contratoId: '',
    salario: 0
  });

  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    if (formData.contratoId) {
      const contratoSeleccionado = contratos.find(c => c.id === parseInt(formData.contratoId));
      if (contratoSeleccionado) {
        setFormData(prev => ({
          ...prev,
          salario: contratoSeleccionado.salario
        }));
      }
    }
  }, [formData.contratoId, contratos]);

  const calcularAportes = () => {
    const salario = parseFloat(formData.salario) || 0;
    
    const nuevosResultados = {
      eps: parseFloat((salario * 0.085 ).toFixed(2)) ,
      arl: parseFloat((salario * 0.00522).toFixed(2)),
      pension: parseFloat((salario * 0.12 ).toFixed(2)),
      cesantias: parseFloat((salario * 0.0833 ).toFixed(2)),
      total: parseFloat((salario * (0.085 + 0.00522 + 0.12 + 0.0833) )).toFixed(2) 
    };
    
    setResultados(nuevosResultados);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resultados) {
      guardarCalculo({
        contratoId: formData.contratoId,
        contrato: formData.contratoId,
        salarioBase: formData.salario,
        ...resultados,
        fecha: new Date().toISOString().split('T')[0]
      });
      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
              Seleccione un contrato y calcule los aportes al sistema de seguridad social según la normativa colombiana
            </p>

            <Form.Group className="mb-3">
              <Form.Label><strong>Contrato</strong></Form.Label>
              <Form.Select 
                name="contratoId" 
                value={formData.contratoId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un contrato</option>
                {contratos.map(contrato => (
                  <option key={contrato.id} value={contrato.id}>
                    {contrato.titulo} (${parseInt(contrato.salario).toLocaleString('es-CO')})
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
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                El salario base se toma del contrato seleccionado, pero puede modificarlo si necesita hacer un cálculo específico.
              </Form.Text>
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
                    <th>Concepto</th>
                    <th>Porcentaje</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Aporte a EPS</td>
                    <td>8.5%</td>
                    <td>${parseInt(resultados.eps).toLocaleString('es-CO')}</td>
                  </tr>
                  <tr>
                    <td>Aporte a ARL (Riesgo I)</td>
                    <td>0.522%</td>
                    <td>${parseInt(resultados.arl).toLocaleString('es-CO')}</td>
                  </tr>
                  <tr>
                    <td>Aporte a Pensión</td>
                    <td>12%</td>
                    <td>${parseInt(resultados.pension).toLocaleString('es-CO')}</td>
                  </tr>
                  <tr>
                    <td>Aporte a Cesantías</td>
                    <td>8.33%</td>
                    <td>${parseInt(resultados.cesantias).toLocaleString('es-CO')}</td>
                  </tr>
                  <tr className="table-primary">
                    <td colSpan="2"><strong>Total Aportes</strong></td>
                    <td><strong>${parseInt(resultados.total).toLocaleString('es-CO')}</strong></td>
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