import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { CalculationsPage } from "./pages/CalculationsPage/CalculationsPage";
import { ContractsPage } from "./pages/ContractsPage/ContractsPage";
import { DashBoard } from "./pages/DashBoard/DashBoard";
import { ReportsPage } from "./pages/ReportsPage/ReportsPage";
import { NavBar } from "./components/NavBar/NavBar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/contratos/*" element={<ContractsPage />} />
          <Route path="/calculos/*" element={<CalculationsPage />} />
          <Route path="/reportes/*" element={<ReportsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
