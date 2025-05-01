import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../api/server";
import { toast, ToastContainer } from "react-toastify"; // Ensure toast is imported
import { BeatLoader } from "react-spinners"; // Import BeatLoader
import BackButton from "../component/BackButton";
import styles from "./DeleteExpense.module.css";
import Navbar from "./Navbar";

const DeleteExpense = () => {
  const [loading, setLoading] = useState(false); // Loading state for deletion
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedIds = state?.selectedIds || []; // Get selected IDs from state

  const handleDeleteExpenses = async () => {
    const token = localStorage.getItem("token");
    setLoading(true); // Start loading

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${apiUrl}/api/expense/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      toast.success("Expenses deleted successfully"); // Show success message
      setTimeout(() => {
        navigate("/home");
      }, 2000); // Delay navigation for 2 seconds
    } catch (error) {
      console.error("Error deleting expenses:", error);
      toast.error("Error occurred while deleting the expenses. Try again."); // Show error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Navbar />
      <BackButton className={styles.backButton} />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Delete Expenses</h1>
        <div className="border border-danger rounded p-5 text-center">
          <h5 className="mb-4">
            Are you sure you want to delete these expenses?
          </h5>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary mx-2"
              onClick={handleDeleteExpenses}
              disabled={loading} // Disable button while loading
            >
              {loading ? <BeatLoader size={10} color="#ffffff" /> : "Yes"}
            </button>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => navigate("/home")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Ensure ToastContainer is included */}
    </>
  );
};

export default DeleteExpense;
