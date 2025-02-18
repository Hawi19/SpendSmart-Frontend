import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../api/server";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import styles from "./Income.module.css"; // Import your CSS module
import BackButton from "../component/BackButton";

const Income = () => {
  const [totalIncome, setTotalIncome] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const incomeValue = Number(totalIncome);

    if (isNaN(incomeValue) || incomeValue < 0) {
      toast.error("Please enter a valid income amount."); // Show error toast
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrl}/api/user/income`,
        { totalIncome: incomeValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.totalIncome !== undefined) {
        console.log("Updated Income:", response.data.totalIncome);
        localStorage.setItem("totalIncome", response.data.totalIncome);
      }

      toast.success("Income updated successfully!"); // Show success toast
      setTotalIncome("");

      // Delay navigation to allow the success toast to display
      setTimeout(() => {
        navigate("/home"); // Navigate back to home
      }, 2000); // Wait for 2 seconds before navigating
    } catch (error) {
      console.error(
        "Error updating income:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Error updating income. Please try again." // Show error toast
      );
    }
  };

  return (
    <>
      <BackButton className={styles.backButton} />
      <div className={styles.container}>
        <h2>Update Income</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="number"
            value={totalIncome}
            onChange={(e) => setTotalIncome(e.target.value)}
            placeholder="Enter your total income"
            required
            min="0"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Update Income
          </button>
        </form>
        <ToastContainer /> {/* Make sure ToastContainer is outside the form */}
      </div>
    </>
  );
};

export default Income;
