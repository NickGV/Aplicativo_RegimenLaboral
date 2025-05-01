import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom sticky-top shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          GestiónLaboral
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          {isLoggedIn && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link${
                    pathname === "/dashboard" ? " active fw-bold" : ""
                  }`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link${
                    pathname.startsWith("/contratos") ? " active fw-bold" : ""
                  }`}
                  to="/contratos"
                >
                  Contratos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link${
                    pathname.startsWith("/calculos") ? " active fw-bold" : ""
                  }`}
                  to="/calculos"
                >
                  Cálculos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link${
                    pathname.startsWith("/reports") ? " active fw-bold" : ""
                  }`}
                  to="/reportes"
                >
                  Reportes
                </Link>
              </li>
            </ul>
          )}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isLoggedIn ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center"
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
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/auth" className="btn bg-black text-white">
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
