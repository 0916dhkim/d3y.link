import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkSession, logout } from "../api/auth";
import { fetchLinks } from "../api/links";
import LinkList from "../components/LinkList";
import CreateLinkForm from "../components/CreateLinkForm";

const Dashboard: React.FC = () => {
    const [links, setLinks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        checkSession()
            .then(() => loadLinks())
            .catch(() => navigate("/"));
    }, []);

    const loadLinks = async () => {
        const data = await fetchLinks();
        setLinks(data);
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            <CreateLinkForm onCreate={loadLinks} />
            <LinkList links={links} onUpdate={loadLinks} />
        </div>
    );
};

export default Dashboard;
