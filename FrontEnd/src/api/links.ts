import axios from "axios";

const API_LINK_URL = process.env.API_LINK_URL || "http://localhost:8000/api/links";

export const fetchLinks = async () => {
    try {
        const response = await axios.get(API_LINK_URL);
        console.log("fetchLinks:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching links:", error);
        return [];
    }
};

export const createLink = async (slug: string, url: string) => {
    try {
        const response = await axios.post(API_LINK_URL, { slug, url }, { withCredentials: true });
        console.log("createLink:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating link:", error);
        throw error;
    }
};

export const updateLink = async (slug: string, url: string, newSlug: string) => {
    try {
        const response = await axios.put(
            `${API_LINK_URL}/${slug}`,
            { url, slug: newSlug },
            { withCredentials: true }
        );
        console.log("updateLink:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating link:", error);
        throw error;
    }
};

export const deleteLink = async (slug: string) => {
    try {
        const response = await axios.delete(`${API_LINK_URL}/${slug}`, {
            withCredentials: true,
        });
        console.log("deleteLink:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting link:", error);
        throw error;
    }
};

export const gotoLink = (slug: string) => {
    window.location.href = `${API_LINK_URL}/${slug}`;
};
