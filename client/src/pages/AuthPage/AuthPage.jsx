import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { BsEnvelope, BsLock, BsPerson } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { handleRegister, handleLogin } = useAuth();
  const [theme, toggleTheme] = useTheme();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    username: "",
    numero_telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "empleado",
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const switchMode = (mode) => {
    setIsLogin(mode === "login");
    setLoginError("");
    setRegisterError("");
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const token = await handleLogin(loginData);
      if (!token) {
        setLoginError("Error al iniciar sesión. Intente de nuevo.");
        return;
      }
      localStorage.setItem("access_token", token.access);
      navigate("/dashboard");
    } catch {
      setLoginError("Credenciales inválidas. Por favor intente de nuevo.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Las contraseñas no coinciden");
      setRegisterLoading(false);
      return;
    }
    try {
      const userData = {
        username: registerData.username,
        numero_telefono: registerData.numero_telefono,
        email: registerData.email,
        password: registerData.password,
        rol: registerData.rol,
      };
      const response = await handleRegister(userData);
      if (!response) {
        setRegisterError("Error al registrar el usuario. Intente de nuevo.");
        return;
      }
      localStorage.setItem("access_token", response.access);
      navigate("/dashboard");
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Container
      fluid
      // 1. ADAPTACIÓN DEL CONTENEDOR (Fondo de la página)
      className={`d-flex align-items-center justify-content-center min-vh-100 position-relative ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
    >
      <Button 
        onClick={toggleTheme}
        className={`position-absolute top-0 end-0 m-3 ${theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`}
        style={{ zIndex: 100 }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </Button>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={10} lg={7} xl={6} xxl={5}>
          <Card
            // 2. ADAPTACIÓN DE LA TARJETA (Card)
            className={`shadow-lg border-0 rounded-4 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}
          >
            <Card.Header
              // 3. ADAPTACIÓN DEL HEADER (Eliminar bg-white fijo)
              className={`text-center border-0 pb-0 pt-4 ${theme === 'dark' ? 'bg-secondary' : 'bg-white'}`}
            >
              <h2
                className="fw-bold mb-1"
                style={{ letterSpacing: 1 }}
              >
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </h2>
              <p
                // 4. ADAPTACIÓN DEL TEXTO SECUNDARIO (text-muted en claro / text-light en oscuro)
                className={`mb-0 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}
                style={{ fontSize: 16 }}
              >
                {isLogin
                  ? "Ingrese sus credenciales para acceder al sistema"
                  : "Complete los datos para crear su cuenta"}
              </p>
            </Card.Header>
            <Card.Body className="px-4 py-4">
              {isLogin ? (
                <Form onSubmit={handleLoginSubmit} autoComplete="off">
                  {loginError && <Alert variant="danger">{loginError}</Alert>}
                  <Form.Group className="mb-3" controlId="login-email">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <InputGroup>
                      {/* Los iconos dentro de InputGroup.Text deberían heredar el color de la Card. */}
                      <InputGroup.Text>
                        <BsEnvelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        autoFocus
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="login-password">
                    <Form.Label>Contraseña</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <BsLock />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="********"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  <div className="d-grid mb-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loginLoading}
                      className="rounded-pill fw-bold"
                    >
                      {loginLoading ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                  </div>
                  <div className="text-center mt-2">
                    <a
                      href="#"
                      // 5. ADAPTACIÓN DEL LINK DE CONTRASEÑA
                      className={`text-decoration-none small ${theme === 'dark' ? 'text-info' : 'text-muted'}`}
                    >
                      ¿Olvidó su contraseña?
                    </a>
                  </div>
                </Form>
              ) : (
                <Form onSubmit={handleRegisterSubmit} autoComplete="off">
                  {registerError && (
                    <Alert variant="danger">{registerError}</Alert>
                  )}
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="register-name">
                        <Form.Label>Nombre Completo</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <BsPerson />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder="Juan Pérez"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                            required
                            autoFocus
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="register-phone">
                        <Form.Label>Número de Teléfono</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <BsPerson />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="numero_telefono"
                            placeholder="1234567890"
                            value={registerData.numero_telefono}
                            onChange={handleRegisterChange}
                            required
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="register-email">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <BsEnvelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="register-password">
                    <Form.Label>Contraseña</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <BsLock />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="********"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="register-confirmPassword"
                  >
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <BsLock />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="********"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="register-role">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                      as="select"
                      name="rol"
                      value={registerData.rol}
                      onChange={handleRegisterChange}
                      required
                    >
                      <option value="empleado">Empleado</option>
                      <option value="empleador">Empleador</option>
                      <option value="contador">Contador</option>
                      <option value="asesor_legal">Asesor Legal</option>
                      <option value="entidad_gubernamental">
                        Entidad Gubernamental
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <div className="d-grid mb-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={registerLoading}
                      className="rounded-pill fw-bold"
                    >
                      {registerLoading ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        "Registrarse"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
            <Card.Footer
              // 6. ADAPTACIÓN DEL FOOTER (Eliminar bg-white fijo)
              className={`text-center border-0 pb-4 pt-3 ${theme === 'dark' ? 'bg-secondary' : 'bg-white'}`}
            >
              {isLogin ? (
                <p className="mb-0">
                  ¿No tiene una cuenta?{" "}
                  <Button
                    variant="link"
                    className="p-0 align-baseline"
                    onClick={() => switchMode("register")}
                  >
                    Registrarse
                  </Button>
                </p>
              ) : (
                <p className="mb-0">
                  ¿Ya tiene cuenta?{" "}
                  <Button
                    variant="link"
                    className="p-0 align-baseline"
                    onClick={() => switchMode("login")}
                  >
                    Iniciar Sesión
                  </Button>
                </p>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
