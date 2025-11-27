import { Container, Row, Col, Card, Accordion } from 'react-bootstrap';
import { useTheme } from "../../hooks/useTheme.jsx";

export const SecurityPage = () => {
  const [theme] = useTheme();

  // Datos de leyes y normativas
  const leyesContratacion = [
    {
      id: 1,
      titulo: "Ley 100 de 1993",
      articulos: ["Artículo 2 - Objeto de la ley", "Artículo 48 - Afiliación al sistema", "Artículo 162 - Prestaciones sociales"],
      descripcion: "Sistema de Seguridad Social Integral, que regula la afiliación de los trabajadores al sistema de salud, pensiones y riesgos laborales."
    },
    {
      id: 2,
      titulo: "Codigo sustantivo del trabajo",
      articulos: ["Artículo 20 - Contrato de trabajo", "Artículo 39 - Jornada laboral", "Artículo 132 - Seguridad social"],
      descripcion: "Regula las relaciones laborales, incluyendo la creación de contratos de trabajo y derechos de los empleados, establece las obligaciones en materia de seguridad social para los trabajadores."
    },
    {
      id: 3,
      titulo: "Ley 1581 de 2012",
      articulos: ["Artículo 4 - Principios de protección de datos", "Artículo 8 - Derechos de los titulares", "Artículo 15 - Deberes de los responsables"],
      descripcion: "Protección de datos personales y privacidad en el manejo de información almacenada en el sistema."
    },
    {
      id: 4,
      titulo: "Ley 789 de 2002",
      articulos: ["Artículo 10 - Prevención del lavado de activos", "Artículo 12 - Obligaciones de los empleadores", "Artículo 15 - Sanciones por incumplimiento"],
      descripcion: "Reformas laborales, que establecen nuevas condiciones para la contratacion y los derechos laborales de los trabajadores."
    }
  ];

  const medidasSeguridad = [
    {
      titulo: "Protección de Datos Personales",
      medidas: [
        "Cifrado de información sensible",
        "Acceso restringido por roles",
        "Registro de auditoría de accesos",
        "Eliminación segura de datos"
      ]
    },
    {
      titulo: "Cumplimiento Legal",
      medidas: [
        "Validación automática de formatos contractuales",
        "Control de versiones de documentos",
        "Registro de cambios y modificaciones",
        "Alertas de vencimientos"
      ]
    },
    {
      titulo: "Seguridad Informática",
      medidas: [
        "Contraseñas encriptadas",
        "Backups automáticos",
        "Protocolos HTTPS/SSL"
      ]
    }
  ];

  return (
    <Container fluid className={`py-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Seguridad y Cumplimiento Legal</h1>
          <p className="lead">
            Marco normativo y medidas de seguridad implementadas en el gestor de contratos
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={8}>
          <Card className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''} shadow-sm`}>
            <Card.Header>
              <h4 className="mb-0">Marco Legal Aplicable</h4>
            </Card.Header>
            <Card.Body>
              <Accordion flush className={theme === 'dark' ? 'accordion-dark' : ''}>
                {leyesContratacion.map((ley) => (
                  <Accordion.Item key={ley.id} eventKey={ley.id.toString()}>
                    <Accordion.Header>
                      <strong>{ley.titulo}</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>{ley.descripcion}</p>
                      <h6>Artículos relevantes:</h6>
                      <ul>
                        {ley.articulos.map((articulo, index) => (
                          <li key={index}>{articulo}</li>
                        ))}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''} shadow-sm mb-4`}>
            <Card.Header>
              <h5 className="mb-0">Medidas de Seguridad</h5>
            </Card.Header>
            <Card.Body>
              {medidasSeguridad.map((grupo, index) => (
                <div key={index} className="mb-3">
                  <h6 className="text-primary">{grupo.titulo}</h6>
                  <ul className="small">
                    {grupo.medidas.map((medida, idx) => (
                      <li key={idx}>{medida}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''} shadow-sm`}>
            <Card.Header>
              <h5 className="mb-0">ℹ️ Información Adicional</h5>
            </Card.Header>
            <Card.Body>
              <p className="small">
                Este gestor de contratos cumple con la legislación laboral colombiana vigente 
                y implementa las mejores prácticas de seguridad informática.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};