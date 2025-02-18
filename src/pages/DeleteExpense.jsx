import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../api/server";
import { toast, ToastContainer } from "react-toastify"; // Ensure toast is imported
import BackButton from "../component/BackButton";
import styles from "./DeleteExpense.module.css";

const DeleteExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteExpense = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(`${apiUrl}/api/expense/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete Response:", response); // Log the response
      toast.success("Expense deleted successfully"); // Show success message
      setTimeout(() => {
        navigate("/home");
      }, 2000); // Delay navigation for 2 seconds
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error occurred while deleting the expense. Try again."); // Show error message
    }
  };

  return (
    <>
      <BackButton className={styles.backButton} />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Delete Expense</h1>
        <div className="border border-danger rounded p-5 text-center">
          <h5 className="mb-4">
            Are you sure you want to delete this expense?
          </h5>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary mx-2"
              onClick={handleDeleteExpense}
            >
              Yes, Delete it
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
