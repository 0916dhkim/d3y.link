import React, { useState } from "react";
import { updateLink } from "../api/links";

interface Props {
    link: { slug: string; url: string };
    onClose: () => void;
    onSave: () => void;
}

const EditLinkModal: React.FC<Props> = ({ link, onClose, onSave }) => {
    const [url, setUrl] = useState(link.url);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateLink(link.slug, url);
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update link");
        }
    };

    return (
        <div className="modal">
            <h3>Edit Link: {link.slug}</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditLinkModal;
