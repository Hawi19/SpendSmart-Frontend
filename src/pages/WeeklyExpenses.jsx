import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../api/server.js";
import ExpenseCalendar from "./ExpenseCalendar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./WeeklyExpenses.module.css";
import BackButton from "../component/BackButton.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const WeeklyExpenses = () => {
  const [selectedWeek, setSelectedWeek] = useState({
    startOfWeek: new Date(),
    endOfWeek: new Date(),
  });
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWeeklyExpenses = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`${apiUrl}/api/expense`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data.expenses); // Debug log

        const filteredExpenses = response.data.expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          expenseDate.setHours(0, 0, 0, 0); // Normalize to midnight

          const start = new Date(selectedWeek.startOfWeek);
          start.setHours(0, 0, 0, 0); // Normalize to midnight

          const end = new Date(selectedWeek.endOfWeek);
          end.setHours(23, 59, 59, 999); // Normalize to end of day

          return expenseDate >= start && expenseDate <= end;
        });

        setWeeklyExpenses(filteredExpenses);
      } catch (error) {
        console.error("Error fetching weekly expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyExpenses();
  }, [selectedWeek, token]);

  const totalExpenses = weeklyExpenses
    .reduce((acc, expense) => acc + expense.amount, 0)
    .toFixed(2);

  return (
    <>
      <Navbar />
      <BackButton className={styles.backButton} />
      <div className={`container mt-4 ${styles.container}`}>
        <h1 className={`text-center mb-4 ${styles.title}`}>Weekly Expenses</h1>
        <ExpenseCalendar onDateSelect={setSelectedWeek} />
        {loading ? (
          <p className="text-center">Loading expenses...</p>
        ) : (
          <>
            <h4 className="text-center">Total Expenses: ${totalExpenses}</h4>
            <div className="row mt-4">
              {weeklyExpenses.length > 0 ? (
                weeklyExpenses.map((expense) => (
                  <div className="col-md-4 mb-4" key={expense._id}>
                    <div className={`card ${styles.card}`}>
                      <div className="card-body">
                        <h5 className={`card-title ${styles.cardTitle}`}>
                          {expense.category}
                        </h5>
                        <p className="card-text">
                          <strong>Amount:</strong> {expense.amount.toFixed(2)}
                          <br />
                          <strong>Date:</strong>{" "}
                          {new Date(expense.date).toLocaleDateString("en-US")}
                          <br />
                          <strong>Description:</strong> {expense.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">
                  No expenses recorded for this week.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default WeeklyExpenses;
