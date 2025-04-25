import React from "react";
import styles from "./LinkBox.module.css";

interface LinkBoxProps {
    slug: string;
    url: string;
    create_date: string;
}

const LinkBox: React.FC<LinkBoxProps> = ({ slug, url, create_date }) => {
    return (
        <li className={styles.card}>
            <div className={styles.textContainer}>
                <span className={styles.slug}>{slug}</span>
                <span className={styles.originalURL}>{url}</span>
            </div>
            <a
                href={`http://localhost:8000/api/links/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.button}
            >
                Go
            </a>
        </li>
    );
};

export default LinkBox;
