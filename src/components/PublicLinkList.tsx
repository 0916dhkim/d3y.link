import React, { useEffect, useState } from "react";
import { fetchLinks, gotoLink } from "../api/links";
import styles from "./PublicLinkList.module.css";

interface Link {
  slug: string;
  url: string;
  create_date: string;
}

const LinkList: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const loadLinks = async () => {
      const data = await fetchLinks();
      setLinks(data);
    };
    loadLinks();
  }, []);

  return (
    <table className={styles.table}>
      <thead className={styles.headerRow}>
        <tr>
          <th className={styles.header}>Slug</th>
          <th className={styles.header}>URL</th>
          <th className={styles.header}>Created</th>
          <th className={styles.header}></th>
        </tr>
      </thead>
      <tbody>
        {links.map((link) => (
          <tr key={link.slug} className={styles.row}>
            <td className={`${styles.cell} ${styles.slug}`}>{link.slug}</td>
            <td className={`${styles.cell} ${styles.url}`}>{link.url}</td>
            <td className={styles.cell}>
              {new Date(link.create_date).toLocaleDateString()}
            </td>
            <td className={styles.cell}>
              <button
                className={styles.button}
                onClick={() => gotoLink(link.slug)}
              >
                Go
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LinkList;
