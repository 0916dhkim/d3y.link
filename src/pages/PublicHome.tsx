import React from "react";
import LinkList from "../components/PublicLinkList";
import styles from "./PublicHome.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>D3Y.Link</h1>
      <LinkList />
    </div>
  );
};

export default Home;
