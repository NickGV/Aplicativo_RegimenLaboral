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
} from "react-bootstrap";
import { BsEnvelope, BsLock, BsPerson } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { handleRegister } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    numero_telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      // const token = await loginUser(loginData);
      // localStorage.setItem("token", token);
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
      };
      await handleRegister(userData);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setRegisterError(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card>
            <Card.Header className="text-center">
              <h2>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
              <p>
                {isLogin
                  ? "Ingrese sus credenciales para acceder al sistema"
                  : "Complete los datos para crear su cuenta"}
              </p>
            </Card.Header>
            <Card.Body>
              {isLogin ? (
                <Form onSubmit={handleLoginSubmit}>
                  {loginError && <Alert variant="danger">{loginError}</Alert>}
                  <Form.Group className="mb-3" controlId="login-email">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <InputGroup>
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
                  <div className="d-grid">
                    <Button
                      variant="dark"
                      type="submit"
                      disabled={loginLoading}
                    >
                      {loginLoading ? "Iniciando..." : "Iniciar Sesión"}
                    </Button>
                  </div>
                  <div className="text-center mt-3">
                    <a href="#">¿Olvidó su contraseña?</a>
                  </div>
                </Form>
              ) : (
                <Form onSubmit={handleRegisterSubmit}>
                  {registerError && (
                    <Alert variant="danger">{registerError}</Alert>
                  )}
                  <Form.Group className="mb-3" controlId="register-name">
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
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="register-phone">
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
                  <div className="d-grid">
                    <Button
                      variant="dark"
                      type="submit"
                      disabled={registerLoading}
                    >
                      {registerLoading ? "Registrando..." : "Registrarse"}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
            <Card.Footer className="text-center">
              {isLogin ? (
                <p>
                  ¿No tiene una cuenta?{" "}
                  <Button variant="link" onClick={() => switchMode("register")}>
                    Registrarse
                  </Button>
                </p>
              ) : (
                <p>
                  ¿Ya tiene cuenta?{" "}
                  <Button variant="link" onClick={() => switchMode("login")}>
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
