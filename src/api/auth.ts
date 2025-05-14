import axios from "axios";

const getBaseUrl = () => new URL('/api/auth', window.origin).toString();

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            `${getBaseUrl()}/login`,
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
        const response = await axios.post(`${getBaseUrl()}/logout`, {}, { withCredentials: true });
        console.log("logout:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

export const checkSession = async () => {
    try {
        const response = await axios.get(`${getBaseUrl()}/session`, {
            withCredentials: true,
        });
        console.log("checkSession:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error checking session:", error);
        throw error;
    }
};

export const refreshSession = async () => {
    try {
        const response = await axios.post(`${getBaseUrl()}/refresh`, {}, { withCredentials: true });
        console.log("refreshSession:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error refreshing session:", error);
        throw error;
    }
};
