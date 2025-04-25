import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkSession } from "../api/auth";

interface Props {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        checkSession()
            .then(() => setAuthorized(true))
            .catch(() => setAuthorized(false))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    return authorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
