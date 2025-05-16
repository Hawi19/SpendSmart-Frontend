import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../api/server";
import { toast, ToastContainer } from "react-toastify";
import { BeatLoader } from "react-spinners";
import styles from "./Income.module.css";
import BackButton from "../component/BackButton";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Income = () => {
  const [incomeToAdd, setIncomeToAdd] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
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

  const handleUpdateIncome = async (e) => {
    e.preventDefault();
    const incomeValue = Number(incomeToAdd);

    if (isNaN(incomeValue) || incomeValue < 0) {
      toast.error("Please enter a valid income amount.");
      return;
    }

    setLoadingUpdate(true);

    try {
      const currentIncome = await fetchCurrentIncome();
      const newTotalIncome = currentIncome + incomeValue;

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
        localStorage.setItem("totalIncome", response.data.totalIncome);
      }

      toast.success("Income updated successfully!");
      setIncomeToAdd("");

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error updating income:", error.response || error);
      toast.error(
        error.response?.data?.message ||
          "Error updating income. Please try again."
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleRemoveIncome = async () => {
    setLoadingRemove(true);
    try {
      const response = await axios.put(
        `${apiUrl}/api/user/income`,
        { totalIncome: 0 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.totalIncome !== undefined) {
        localStorage.setItem("totalIncome", 0);
        toast.success("Income removed successfully!");
        setIncomeToAdd("");
      }
    } catch (error) {
      console.error("Error removing income:", error.response || error);
      toast.error(
        error.response?.data?.message ||
          "Error removing income. Please try again."
      );
    } finally {
      setLoadingRemove(false);
    }
  };

  return (
    <>
      <Navbar />
      <BackButton className={styles.backButton} />
      <div className={styles.container}>
        <h2>Update Income</h2>
        <form onSubmit={handleUpdateIncome} className={styles.form}>
          <input
            type="number"
            value={incomeToAdd}
            onChange={(e) => setIncomeToAdd(e.target.value)}
            placeholder="Enter your income"
            required
            min="0"
            className={styles.input}
          />
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.button}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? (
                <BeatLoader size={10} color="#ffffff" />
              ) : (
                "Update Income"
              )}
            </button>
            <button
              type="button" // Prevent form submission
              onClick={handleRemoveIncome}
              className={styles.button}
              disabled={loadingRemove}
            >
              {loadingRemove ? (
                <BeatLoader size={10} color="#ffffff" />
              ) : (
                "Set Income to Zero"
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default Income;
