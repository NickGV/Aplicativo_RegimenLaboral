import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import CalculationsPage from "./pages/CalculationsPage/CalculationsPage.jsx";
import { ContractsPage } from "./pages/ContractsPage/ContractsPage";
import { ReportsPage } from "./pages/ReportsPage/ReportsPage";
import { NavBar } from "./components/NavBar/NavBar";
import { Dashboard } from "./pages/DashBoard/DashBoard";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthProvider";
import { ContractProvider } from "./context/ContractProvider";
import { ContributionProvider } from "./context/ContributionProvider";
import Register from "./components/Register";
import Contracts from "./components/Contracts";

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
              </Routes>
            </div>
          </BrowserRouter>
          <Register />
          <Contracts />
        </ContributionProvider>
      </ContractProvider>
    </AuthProvider>
  );
}

export default App;
