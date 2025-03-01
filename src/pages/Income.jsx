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

  const fetchCurrentIncome = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/income`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.totalIncome || 0;
    } catch (error) {
      console.error("Error fetching income:", error);
      toast.error("Error fetching income data.");
      return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const incomeValue = Number(totalIncome);

    if (isNaN(incomeValue) || incomeValue < 0) {
      toast.error("Please enter a valid income amount.");
      return;
    }

    try {
      const currentIncome = await fetchCurrentIncome();
      const newTotalIncome = currentIncome + incomeValue; // Add new income to existing income

      const response = await axios.put(
        `${apiUrl}/api/user/income`,
        { totalIncome: newTotalIncome },
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

      toast.success("Income updated successfully!");
      setTotalIncome("");

      // Delay navigation to allow the success toast to display
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error updating income:", error.response || error);
      toast.error(
        error.response?.data?.message ||
          "Error updating income. Please try again."
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
            placeholder="Enter your income"
            required
            min="0"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Update Income
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default Income;