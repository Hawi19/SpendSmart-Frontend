// src/component/Navbar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"; // Create a CSS module for styling

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <span className={styles.navTitle}>Spend Smart</span>
      <div className={styles.hamburger} onClick={toggleMenu}>
        &#9776; {/* Hamburger icon */}
      </div>
      <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}>
        <span
          onClick={() => navigate("/weekly-expenses")}
          className={styles.navLink}
        >
          Weekly Report
        </span>
        <button
          onClick={() => navigate("/logout")}
          className={styles.navButton}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
