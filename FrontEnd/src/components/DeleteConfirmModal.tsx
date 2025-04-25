import React from "react";

interface Props {
    slug: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({ slug, onClose, onConfirm }) => {
    return (
        <div className="modal">
            <p>Are you sure you want to delete the link "{slug}"?</p>
            <button onClick={onConfirm}>Yes, Delete</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default DeleteConfirmModal;
