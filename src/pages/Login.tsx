import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { login, checkSession, register, hasUsers } from "../api/auth";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession()
      .then(() => navigate("/dashboard"))
      .catch(() => {});

    hasUsers()
      .then((data) => setShowRegister(!data.hasUsers))
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      setError("");
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
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
        <h2 className={styles.title}>
          {isRegistering ? "Create Account" : "Hi, Danny!"}
        </h2>
        <p className={styles.subtitle}>
          {isRegistering
            ? "Set up your admin account."
            : "Please enter your details to login."}
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        {showRegister && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "No account yet? Register"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
