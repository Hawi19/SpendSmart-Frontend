import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { apiUrl } from "../api/server.js";
import styles from "./Home.module.css"; 

const Home = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchIncome = async () => {
    try {
      const incomeResponse = await axios.get(`${apiUrl}/api/user/income`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return incomeResponse.data.totalIncome || 0;
    } catch (error) {
      console.error("Error fetching income:", error);
      enqueueSnackbar("Error fetching income data.", { variant: "error" });
      return 0;
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/expense`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.expenses)) {
        return response.data.totalExpenses || 0;
      } else {
        console.error("Unexpected response format:", response.data);
        enqueueSnackbar("Unexpected response format for expenses.", {
          variant: "error",
        });
        return 0;
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      enqueueSnackbar("Error fetching expenses data.", { variant: "error" });
      return 0;
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/expense`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.expenses)) {
        const sortedExpenses = response.data.expenses.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        return sortedExpenses.slice(0, 3); 
      } else {
        console.error("Unexpected response format:", response.data);
        enqueueSnackbar("Unexpected response format for expenses.", {
          variant: "error",
        });
        return [];
      }
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      enqueueSnackbar("Error fetching recent transactions.", {
        variant: "error",
      });
      return [];
    }
  };

  const fetchFinancialData = async () => {
    const incomeValue = await fetchIncome();
    const expensesValue = await fetchExpenses();
    const transactionsValue = await fetchRecentTransactions();

    setTotalIncome(incomeValue);
    setTotalExpenses(expensesValue);
    setNetIncome(incomeValue - expensesValue);
    setRecentTransactions(transactionsValue);
  };

  useEffect(() => {
    fetchFinancialData();
  }, [enqueueSnackbar, token]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  return (
    <div className={styles.homeContainer}>
      <nav className={styles.navbar}>
        <span className={styles.navTitle}>Spend Smart</span>
        <div className={styles.hamburger} onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </div>
        <div
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}
        >
          <span
            onClick={() => navigate("/weekly-expenses")}
            className={styles.navLink}
          >
            Weekly Report
          </span>
          <button
            className={styles.navButton}
            onClick={() => navigate("/logout")}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className={styles.welcomeMessage}>
        <h1>Welcome, {localStorage.getItem("username") || "User"}!</h1>
      </div>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h2>Total Income</h2>
          <p className={styles.amount}>{totalIncome.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h2>Total Expenses</h2>
          <p className={styles.amount}>{totalExpenses.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h2>Net Income</h2>
          <p className={styles.amount}>{netIncome.toFixed(2)}</p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.btn} btn btn-primary mx-2`}
          onClick={() => navigate("/income")}
        >
          Add Income
        </button>
        <button
          className={`${styles.btn} btn btn-primary mx-2`}
          onClick={() => navigate("/add-expense")}
        >
          Add Expense
        </button>
      </div>

      {/* Recent Transactions Table */}
      <div className={styles.transactionsContainer}>
        <h3>Recent Transactions</h3>
        <table className={styles.transactionsTable}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.category || "N/A"}</td>
                  <td>{transaction.amount.toFixed(2)}</td>
                  <td>
                    {new Date(transaction.date).toLocaleDateString("en-US")}
                  </td>
                  <td>{transaction.description || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No recent transactions available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
