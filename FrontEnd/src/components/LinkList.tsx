import React, { useState } from "react";
import { deleteLink, updateLink, gotoLink } from "../api/links";
import EditLinkModal from "./EditLinkModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface Link {
    slug: string;
    url: string;
    create_date: string;
}

interface Props {
    links: Link[];
    onUpdate: () => void;
}

const API_LINK_URL = process.env.API_LINK_URL || "http://localhost:8000/api/links";

const LinkList: React.FC<Props> = ({ links, onUpdate }) => {
    const [editingLink, setEditingLink] = useState<Link | null>(null);
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

    return (
        <ul>
            {links.map((link) => (
                <li key={link.slug}>
                    <p>
                        <strong>Short:</strong> {API_LINK_URL}/{link.slug}
                    </p>
                    <p>
                        <strong>Original:</strong> {link.url}
                    </p>
                    <button onClick={() => gotoLink(link.slug)}>Go</button>
                    <button onClick={() => setEditingLink(link)}>Edit</button>
                    <button onClick={() => setDeletingSlug(link.slug)}>Delete</button>
                </li>
            ))}
            {editingLink && (
                <EditLinkModal
                    link={editingLink}
                    onClose={() => setEditingLink(null)}
                    onSave={onUpdate}
                />
            )}
            {deletingSlug && (
                <DeleteConfirmModal
                    slug={deletingSlug}
                    onClose={() => setDeletingSlug(null)}
                    onConfirm={async () => {
                        await deleteLink(deletingSlug);
                        setDeletingSlug(null);
                        onUpdate();
                    }}
                />
            )}
        </ul>
    );
};

export default LinkList;
