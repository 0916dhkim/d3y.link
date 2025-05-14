import React, { useState } from "react";
import { createLink } from "../api/links";
import styles from "./Modal.module.css";

const LINKEDIN_LINK_LENGTH_THRESHOLD = 26;

interface Props {
  onCreate: () => void;
  onClose: () => void;
}

const CreateLinkModal: React.FC<Props> = ({ onCreate, onClose }) => {
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const linkPrefix = new URL(window.origin).host + "/";
  const linkLength = (linkPrefix + slug).length;
  const linkedinReady = linkLength <= LINKEDIN_LINK_LENGTH_THRESHOLD;

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
          <div className={styles.inputGroup}>
            {linkPrefix}
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
            <p>
              <span>{linkedinReady ? "✅" : "❌"}</span> LinkedIn
            </p>
            <p>{linkLength} characters</p>
          </div>
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
