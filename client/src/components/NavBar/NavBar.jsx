import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./NavBar.css";

export const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   setIsLoggedIn(!!token);
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/auth/login";
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      sticky="top"
      className="border-bottom shadow-sm"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          GestiónLaboral
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNavDropdown" />
        <Navbar.Collapse id="navbarNavDropdown">
          {isLoggedIn && (
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link
                as={Link}
                to="/dashboard"
                active={pathname === "/dashboard"}
                className="fw-bold"
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contratos"
                active={pathname.startsWith("/contratos")}
                className="fw-bold"
              >
                Contratos
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/calculos"
                active={pathname.startsWith("/calculos")}
                className="fw-bold"
              >
                Cálculos
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/reportes"
                active={pathname.startsWith("/reportes")}
                className="fw-bold"
              >
                Reportes
              </Nav.Link>
            </Nav>
          )}
          <Nav className="ms-auto mb-2 mb-lg-0">
            {isLoggedIn ? (
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-box-arrow-right me-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a.5.5 0 0 1 1 0v1h6V3H7v1a.5.5 0 0 1-1 0V3z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H9.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                  />
                </svg>
                <span>Cerrar sesión</span>
              </Button>
            ) : (
              <Button as={Link} to="/auth" variant="dark">
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
