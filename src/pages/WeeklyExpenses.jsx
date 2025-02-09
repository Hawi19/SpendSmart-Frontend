import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../api/server.js";
import { useSnackbar } from "notistack";
import ExpenseCalendar from "./ExpenseCalendar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./WeeklyExpenses.module.css"; 
import BackButton from "../component/BackButton.jsx";

const WeeklyExpenses = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWeeklyExpenses = async () => {
      const startOfWeek = new Date(selectedDate);
      const endOfWeek = new Date(selectedDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

      try {
        const response = await axios.get(`${apiUrl}/api/expense`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredExpenses = response.data.expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
        });

        setWeeklyExpenses(filteredExpenses);
      } catch (error) {
        console.error("Error fetching weekly expenses:", error);
        enqueueSnackbar("Error fetching weekly expenses. Try again.", {
          variant: "error",
        });
      }
    };

    fetchWeeklyExpenses();
  }, [selectedDate, token, enqueueSnackbar]);

  return (
    <>
      <BackButton className={styles.backButton} />
      <div className={`container mt-4 ${styles.container}`}>
        <h1 className={`text-center mb-4 ${styles.title}`}>Weekly Expenses</h1>
        <ExpenseCalendar onDateSelect={setSelectedDate} />
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
            <p className="text-center">No expenses recorded for this week.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default WeeklyExpenses;
