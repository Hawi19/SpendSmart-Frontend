import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../api/server.js";
import { useSnackbar } from "notistack";
import ExpenseCalendar from "./ExpenseCalendar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./WeeklyExpenses.module.css";
import BackButton from "../component/BackButton.jsx";

const WeeklyExpenses = () => {
  const [selectedWeek, setSelectedWeek] = useState({
    startOfWeek: new Date(),
    endOfWeek: new Date(),
  });
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWeeklyExpenses = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`${apiUrl}/api/expense`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredExpenses = response.data.expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate >= selectedWeek.startOfWeek &&
            expenseDate <= selectedWeek.endOfWeek
          );
        });

        setWeeklyExpenses(filteredExpenses);
      } catch (error) {
        console.error("Error fetching weekly expenses:", error);
        enqueueSnackbar("Error fetching weekly expenses. Try again.", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyExpenses();
  }, [selectedWeek, token, enqueueSnackbar]);

  const totalExpenses = weeklyExpenses
    .reduce((acc, expense) => acc + expense.amount, 0)
    .toFixed(2);

  return (
    <>
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
    </>
  );
};

export default WeeklyExpenses;
