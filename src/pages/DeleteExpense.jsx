import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../api/server";
import { toast, ToastContainer } from "react-toastify";
import { BeatLoader } from "react-spinners";
import BackButton from "../component/BackButton";
import styles from "./DeleteExpense.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DeleteExpense = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedIds = state?.selectedIds || [];

  const handleDeleteExpenses = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

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

      toast.success("Expenses deleted successfully");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error deleting expenses:", error);
      toast.error("Error occurred while deleting the expenses. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <BackButton className={styles.backButton} />
      <div className={`${styles.container} container mt-5`}>
        <h1 className="text-center mb-4">Delete Expenses</h1>
        <div className="border border-danger rounded p-5 text-center">
          <h5 className="mb-4">
            Are you sure you want to delete these expenses?
          </h5>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary mx-2"
              onClick={handleDeleteExpenses}
              disabled={loading}
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
      <ToastContainer />
      <Footer />
    </>
  );
};

export default DeleteExpense;
