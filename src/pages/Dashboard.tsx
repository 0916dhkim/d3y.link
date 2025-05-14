import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { checkSession, logout, refreshSession } from "../api/auth";
import { fetchLinks } from "../api/links";
import LinkList from "../components/LinkList";
import CreateLinkModal from "../components/CreateLinkModal";
import styles from "./Dashboard.module.css";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const Dashboard: React.FC = () => {
    const [links, setLinks] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [sessionCreated, setSessionCreated] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkSession()
            .then((res) => {
                const createdTime = new Date(res.createdAt).getTime();
                setSessionCreated(createdTime);
                loadLinks();
            })
            .catch(() => navigate("/"));
    }, [navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (sessionCreated) calculateRemaining(sessionCreated);
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionCreated]);

    const calculateRemaining = (createdTime: number) => {
        const expireTime = createdTime + SESSION_DURATION_MS;
        const now = new Date().getTime();
        const diff = Math.max(0, expireTime - now);
        setRemainingTime(diff);
    };

    const handleRefresh = async () => {
        try {
            const res = await refreshSession();
            const createdTime = new Date(res.createdAt).getTime();
            setSessionCreated(createdTime);
        } catch {
            navigate("/");
        }
    };

    const formatTime = (ms: number) => {
        const sec = Math.floor(ms / 1000);
        const days = Math.floor(sec / 86400);
        const hours = Math.floor((sec % 86400) / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const seconds = sec % 60;

        const parts = [];
        if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
        parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

        return `Auto logout in ${parts.join(" ")}`;
    };

    const loadLinks = async () => {
        const data = await fetchLinks();
        setLinks(data);
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h1 className={styles.logo}>
                    D3Y.Link
                    <br />
                    Dashboard
                </h1>

                <div className={styles.sessionBox}>
                    <p className={styles.timer}>{formatTime(remainingTime)}</p>
                    <button onClick={handleRefresh} className={styles.refresh}>
                        Refresh
                    </button>
                </div>

                <div className={styles.footer}>
                    <button onClick={handleLogout} className={styles.logout}>
                        Logout
                    </button>
                </div>
            </aside>
            <main className={styles.main}>
                <div className={styles.topBar}>
                    <button className={styles.primaryButton} onClick={() => setShowCreate(true)}>
                        Create
                    </button>
                </div>
                {showCreate && (
                    <CreateLinkModal
                        onCreate={() => loadLinks()}
                        onClose={() => setShowCreate(false)}
                    />
                )}
                <LinkList links={links} onUpdate={loadLinks} />
            </main>
        </div>
    );
};

export default Dashboard;
