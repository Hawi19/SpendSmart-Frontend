import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import styles from "./BackButton.module.css"; // Ensure this path is correct

const BackButton = ({ destination = "/home" }) => {
  return (
    <div className={styles.backButtonContainer}>
      <Link to={destination} className={styles.backButton}>
        <GoArrowLeft />
       
      </Link>
    </div>
  );
};

export default BackButton;
