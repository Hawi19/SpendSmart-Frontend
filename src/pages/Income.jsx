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
      navigate("/home"); // Navigate back to home
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
      <div></div>
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
         <ToastContainer/>
        </form>
      </div>
    </>
  );
};

export default Income;
