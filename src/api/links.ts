import axios from "axios";

const getBaseUrl = () => new URL("/api/links", window.origin).toString();

export const fetchLinks = async () => {
  try {
    const response = await axios.get(getBaseUrl());
    return response.data;
  } catch (error) {
    console.error("Error fetching links:", error);
    return [];
  }
};

export const createLink = async (slug: string, url: string) => {
  try {
    const response = await axios.post(
      getBaseUrl(),
      { slug, url },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating link:", error);
    throw error;
  }
};

export const updateLink = async (
  slug: string,
  url: string,
  newSlug: string,
) => {
  try {
    const response = await axios.put(
      `${getBaseUrl()}/${slug}`,
      { url, slug: newSlug },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating link:", error);
    throw error;
  }
};

export const deleteLink = async (slug: string) => {
  try {
    const response = await axios.delete(`${getBaseUrl()}/${slug}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting link:", error);
    throw error;
  }
};

export const gotoLink = (slug: string) => {
  window.location.href = `${getBaseUrl()}/${slug}`;
};
