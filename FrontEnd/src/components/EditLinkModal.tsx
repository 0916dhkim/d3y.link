import React, { useState } from "react";
import { updateLink } from "../api/links";
import styles from "./Modal.module.css";

const LINKEDIN_LINK_LENGTH_THRESHOLD = 26;

interface Props {
    link: { slug: string; url: string };
    onClose: () => void;
    onSave: () => void;
}

const EditLinkModal: React.FC<Props> = ({ link, onClose, onSave }) => {
    const [newSlug, setNewSlug] = useState(link.slug);
    const [url, setUrl] = useState(link.url);
    const [error, setError] = useState("");
    const linkPrefix = new URL(window.origin).host + '/';
    const linkLength = (linkPrefix + newSlug).length;
    const linkedinReady = linkLength <= LINKEDIN_LINK_LENGTH_THRESHOLD;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateLink(link.slug, url, newSlug);
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update link");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>
                    Edit Link: <code>{link.slug}</code>
                </h3>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                      {linkPrefix}
                      <input
                          type="text"
                          value={newSlug}
                          onChange={(e) => setNewSlug(e.target.value)}
                          placeholder="Slug"
                          required
                      />
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Target URL"
                        required
                    />
                    <div className={styles.infoGroup}>
                        <p><span>{linkedinReady ? "✅" : "❌"}</span> LinkedIn</p>
                        <p>{linkLength} characters</p>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.primary}>
                            Save
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

export default EditLinkModal;
