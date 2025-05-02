import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../api/server";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { BeatLoader } from "react-spinners"; // Import BeatLoader
import styles from "./EditExpense.module.css";
import BackButton from "../component/BackButton";
import Navbar from "./Navbar";

const EditExpense = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for button loading
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExpense = async () => {
      if (!token) {
        toast.error("No token found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/expense/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAmount(response.data.amount);
        setCategory(response.data.category);
        setDate(response.data.date);
        setDescription(response.data.description || "");
      } catch (error) {
        if (error.response) {
          toast.error(
            `Error: ${error.response.status} - ${error.response.data.message}`
          );
        } else {
          toast.error("An error occurred. Please check the console.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, navigate, token]);

  const handleEditExpense = async () => {
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

    setIsSubmitting(true); // Start loading

    try {
      await axios.put(`${apiUrl}/api/expense/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Expense updated successfully");
      // Delay navigation to allow toast to be visible
      setTimeout(() => {
        navigate("/add-expense");
      }, 1000);
    } catch (error) {
      toast.error("Error occurred. Try again.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <BackButton className={styles.backButton} />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Edit Expense</h1>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.formControl}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.formControl}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value !== "Other") {
                  setOtherCategory("");
                }
              }}
              className={styles.formControl}
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
              <label className={styles.formLabel}>Specify Category</label>
              <input
                type="text"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                className={styles.formControl}
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.formControl}
            />
          </div>
          <button
            className={`btn btn-primary ${styles.btn} btn-lg mt-2`}
            onClick={handleEditExpense}
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? <BeatLoader size={10} color="#ffffff" /> : "Save"}
          </button>
        </div>
      </div>
      <ToastContainer /> {/* Ensure ToastContainer is included */}
    </>
  );
};

export default EditExpense;
