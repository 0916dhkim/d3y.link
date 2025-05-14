import React from "react";
import styles from "./Modal.module.css";

interface Props {
  slug: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({ slug, onClose, onConfirm }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Delete Link</h3>
        <p>
          Are you sure you want to delete the link <code>{slug}</code>?
        </p>
        <div className={styles.buttonGroup}>
          <button onClick={onConfirm} className={styles.primary}>
            Yes, Delete
          </button>
          <button onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
