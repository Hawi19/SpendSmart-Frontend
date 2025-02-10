import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../service.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token) {
      toast.error(
        "Invalid token. Please check your email for the verification link."
      );
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.get(`api/user/verify?token=${token}`);
      toast.success("Email verified successfully. You can now log in.");
      navigate("/");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      {loading ? (
        <h2>Verifying your email...</h2>
      ) : (
        <button className="btn btn-success btn-lg" onClick={handleVerify}>
          Verify Email
        </button>
      )}
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
};

export default VerifyEmail;
