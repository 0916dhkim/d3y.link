import React, { useState } from "react";
import { deleteLink, gotoLink } from "../api/links";
import EditLinkModal from "./EditLinkModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import styles from "./LinkList.module.css";

interface Link {
  slug: string;
  url: string;
  createDate: string;
  updateDate: string;
  clicks: number;
  lastClick: string | null;
}

interface Props {
  links: Link[];
  onUpdate: () => void;
}

const LinkList: React.FC<Props> = ({ links, onUpdate }) => {
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleCopy = (fullUrl: string) => {
    navigator.clipboard.writeText(fullUrl);
    alert("Shortened URL is copied to clipboard!");
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Slug</th>
            <th>Original URL</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Clicks</th>
            <th>Last Click</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => {
            const fullShortUrl = `${window.location.origin}/${link.slug}`;
            return (
              <tr key={link.slug}>
                <td>
                  <strong>{link.slug}</strong>
                </td>
                <td className={styles.url}>{link.url}</td>
                <td>{new Date(link.createDate).toLocaleDateString()}</td>
                <td>{new Date(link.updateDate).toLocaleDateString()}</td>
                <td>{link.clicks}</td>
                <td>
                  {link.lastClick
                    ? new Date(link.lastClick).toLocaleString()
                    : "—"}
                </td>
                <td className={styles.actions}>
                  <button
                    onClick={() => handleCopy(fullShortUrl)}
                    className={styles.copy}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => gotoLink(link.slug)}
                    className={styles.go}
                  >
                    Go
                  </button>
                  <button
                    onClick={() => setEditingLink(link)}
                    className={styles.edit}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingSlug(link.slug)}
                    className={styles.delete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
    </div>
  );
};

export default LinkList;
