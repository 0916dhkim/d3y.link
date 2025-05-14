import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { login, checkSession } from "../api/auth";
import styles from "./Login.module.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        checkSession()
            .then(() => navigate("/dashboard"))
            .catch(() => {});
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            setError("");
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Hi, Danny!</h2>
                <p className={styles.subtitle}>Please enter your details to login.</p>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
