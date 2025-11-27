import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import CalculationsPage from "./pages/CalculationsPage/CalculationsPage.jsx";
import { ContractsPage } from "./pages/ContractsPage/ContractsPage";
import { ReportsPage } from "./pages/ReportsPage/ReportsPage";
import { NavBar } from "./components/NavBar/NavBar";
import { Dashboard } from "./pages/DashBoard/DashBoard";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthProvider";
import { ContractProvider } from "./context/ContractsProvider.jsx";
import { ContributionProvider } from "./context/ContributionProvider";
import { UserPage } from './pages/UserPage/UserPage.jsx';
import RequestPage from './pages/RequestPage/RequestPage.jsx';
import { ThemeProvider, useTheme } from "./hooks/useTheme.jsx";
import { SecurityPage } from "./pages/Seguridad/SecurityPage.jsx";
import './dark-mode.css';

// Componente que maneja el layout con tema
const AppLayout = () => {
  const [theme] = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-dark text-light min-vh-100' : 'min-vh-100'}>
      <NavBar />
      <div className="container-fluid p-0"> {/* ← Cambiado aquí */}
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contratos/*" element={<ContractsPage />} />
          <Route path="/calculos/*" element={<CalculationsPage />} />
          <Route path="/reportes/*" element={<ReportsPage />} />
          <Route path="/solicitudes" element={<RequestPage />} />
          <Route path="/seguridad/*" element={<SecurityPage />}/>
          <Route path="/info/*" element={<UserPage />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ContractProvider>
          <ContributionProvider>
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </ContributionProvider>
        </ContractProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;