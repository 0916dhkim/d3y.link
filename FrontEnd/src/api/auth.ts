import axios from "axios";

const API_AUTH_URL = process.env.API_AUTH_URL || "http://localhost:8000/api/auth";

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            `${API_AUTH_URL}/login`,
            { email, password },
            { withCredentials: true }
        );
        console.log("login:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${API_AUTH_URL}/logout`, {}, { withCredentials: true });
        console.log("logout:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

export const checkSession = async () => {
    try {
        const response = await axios.get(`${API_AUTH_URL}/session`, {
            withCredentials: true,
        });
        console.log("checkSession:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error checking session:", error);
        throw error;
    }
};
