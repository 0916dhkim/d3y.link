import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export default function () {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
