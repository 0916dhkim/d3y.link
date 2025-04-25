import React, { useState } from "react";
import { createLink } from "../api/links";

interface Props {
    onCreate: () => void;
}

const CreateLinkForm: React.FC<Props> = ({ onCreate }) => {
    const [slug, setSlug] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createLink(slug, url);
            setSlug("");
            setUrl("");
            onCreate();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create link");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create New Link</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Slug"
                required
            />
            <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Target URL"
                required
            />
            <button type="submit">Create</button>
        </form>
    );
};

export default CreateLinkForm;
