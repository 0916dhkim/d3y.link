import React, { useState } from "react";
import { createLink } from "../api/links";
import styles from "./Modal.module.css";

interface Props {
    onCreate: () => void;
    onClose: () => void;
}

const CreateLinkModal: React.FC<Props> = ({ onCreate, onClose }) => {
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
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create link");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Create New Link</h3>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
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
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.primary}>
                            Create
                        </button>
                        <button type="button" onClick={onClose} className={styles.cancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLinkModal;
