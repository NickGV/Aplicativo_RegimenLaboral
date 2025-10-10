import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
function App() {
  return (
    <AuthProvider>
      <ContractProvider>
        <ContributionProvider>
          <BrowserRouter>
            <NavBar />
            <div className="container mt-4">
              <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contratos/*" element={<ContractsPage />} />
                <Route path="/calculos/*" element={<CalculationsPage />} />
                <Route path="/reportes/*" element={<ReportsPage />} />
                <Route path="/solicitudes" element={<RequestPage />} />
                <Route path="/info/*" element={<UserPage />} />
                {/* Solo empleados y empleadores pueden ver solicitudes */}
                
              </Routes>
            </div>
          </BrowserRouter>
        </ContributionProvider>
      </ContractProvider>
    </AuthProvider>
  );
}

export default App;
