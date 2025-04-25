import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PublicHome from "./pages/PublicHome";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
