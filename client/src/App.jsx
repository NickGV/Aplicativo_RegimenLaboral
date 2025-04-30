import { AuthPage } from "./pages/AuthPage/AuthPage";
import { CalculationsPage } from "./pages/CalculationsPage/CalculationsPage";
import { ContractsPage } from "./pages/ContractsPage/ContractsPage";
import { DashBoard } from "./pages/DashBoard/DashBoard";
import { ReportsPage } from "./pages/ReportsPage/ReportsPage";

function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <AuthPage />
      <DashBoard />
      <ContractsPage />
      <CalculationsPage />
      <ReportsPage />
    </div>
  );
}

export default App;
