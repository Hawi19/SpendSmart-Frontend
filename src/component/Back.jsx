import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import styles from "./Back.module.css"; // Ensure this path is correct

const Back = () => {
  const navigate = useNavigate();

  const handleBackToHome = (event) => {
    event.preventDefault();
    navigate("/home"); // Navigate to the home page
  };

  return (
    <div className={styles.backButtonContainer}>
      <a href="#" onClick={handleBackToHome} className={styles.backButton}>
        <GoArrowLeft /> {/* Icon for the back button */}
  
      </a>
    </div>
  );
};

export default Back;
