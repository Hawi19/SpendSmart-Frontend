import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © 2025 Spend Smart. All rights reserved.
        </p>
        <div className={styles.links}>
          <a href="/privacy" className={styles.link}>
            Privacy Policy
          </a>
          <a href="/terms" className={styles.link}>
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
