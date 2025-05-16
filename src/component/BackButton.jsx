import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import styles from "./BackButton.module.css"; // Ensure this path is correct

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = (event) => {
    event.preventDefault();
    navigate(-1);
  };
  return (
    <div className={styles.backButtonContainer}>
      <a href="#" onClick={handleBack} className={styles.backButton}>
        <GoArrowLeft />
      </a>
    </div>
  );
};

export default BackButton;
