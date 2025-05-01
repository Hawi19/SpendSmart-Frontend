import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../api/server.js";
import { AiOutlineEdit } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import { BeatLoader } from "react-spinners"; // Import BeatLoader
import styles from "./AddExpense.module.css"; // Import your CSS module
import BackButton from "../component/BackButton.jsx";
import Navbar from "./Navbar.jsx";

const AddExpense = ({ onExpenseAdded }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState(new Set());
  const [loading, setLoading] = useState(false); // Loading state for saving expense
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/expense`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && Array.isArray(response.data.expenses)) {
          setExpenses(sortExpensesByDate(response.data.expenses));
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [token]);

  const sortExpensesByDate = (expenses) => {
    return expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleSaveExpense = async () => {
    if (!amount || !date || (!category && !otherCategory)) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = {
      description,
      amount: parseFloat(amount),
      date,
      category: category === "Other" ? otherCategory : category,
    };

    setLoading(true); // Start loading

    try {
      const response = await axios.post(`${apiUrl}/api/expense`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Expense added successfully");
      setExpenses((prevExpenses) =>
        sortExpensesByDate([...prevExpenses, response.data.expense])
      );

      if (onExpenseAdded) {
        onExpenseAdded(); // Trigger refresh of financial data in Home component
      }

      // Reset form fields
      setDescription("");
      setAmount("");
      setDate("");
      setCategory("");
      setOtherCategory("");
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSelectExpense = (id) => {
    const updatedSelection = new Set(selectedExpenses);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedExpenses(updatedSelection);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = new Set(expenses.map((expense) => expense._id));
      setSelectedExpenses(allIds);
    } else {
      setSelectedExpenses(new Set());
    }
  };

  const handleDeleteSelectedExpenses = () => {
    if (selectedExpenses.size === 0) {
      toast.error("Please select at least one expense to delete.");
      return;
    }

    // Navigate to DeleteExpense component with selected IDs
    navigate("/api/expense/delete", {
      state: { selectedIds: Array.from(selectedExpenses) },
    });
  };

  return (
    <>
      <Navbar />
      <BackButton className={styles.backButton} />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Add Expense</h1>
          <div className={styles.formGroup}>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value !== "Other") {
                  setOtherCategory("");
                }
              }}
              className={styles.input}
              required
            >
              <option value="">Select a category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {category === "Other" && (
            <div className={styles.formGroup}>
              <label>Specify Category</label>
              <input
                type="text"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label>Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
            />
          </div>
          <button className={styles.button} onClick={handleSaveExpense} disabled={loading}>
            {loading ? <BeatLoader size={10} color="#ffffff" /> : "Save"}
          </button>
        </div>

        {/* Expense Table */}
        <div className={styles.tableContainer}>
          <h3 className={styles.subtitle}>Current Expenses</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedExpenses.size === expenses.length &&
                      expenses.length > 0
                    }
                  />
                </th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedExpenses.has(expense._id)}
                        onChange={() => handleSelectExpense(expense._id)}
                      />
                    </td>
                    <td>{expense.category}</td>
                    <td>
                      {expense.amount ? expense.amount.toFixed(2) : "0.00"}
                    </td>
                    <td>
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString("en-US")
                        : "N/A"}
                    </td>
                    <td>{expense.description || "N/A"}</td>
                    <td>
                      <AiOutlineEdit
                        className={styles.icon}
                        onClick={() =>
                          navigate(`/api/expense/edit/${expense._id}`)
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No expenses recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className={styles.button}
            onClick={handleDeleteSelectedExpenses}
          >
            Delete Selected
          </button>
        </div>
      </div>
      <ToastContainer /> {/* Ensure ToastContainer is included */}
    </>
  );
};

export default AddExpense;