import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { apiUrl } from "../api/server";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ResetPassword.module.css";
import BackButton from "../component/BackButton";
import { BeatLoader } from "react-spinners";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/user/forgot-password`, {
        email,
      });
      toast.success(response.data.message);
      setCodeSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Error sending reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      toast.error("Reset code and new password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/user/reset-password`, {
        email,
        resetCode,
        newPassword,
      });
      console.log("Reset Password Response:", response);
      toast.success("Password reset successfully.");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton className={styles.backButton} />
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Reset Password</h2>

          {!codeSent ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div>
                <button
                  className={`btn btn-primary ${styles.btn}`}
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <BeatLoader size={10} color="#ffffff" />
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Reset Code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                className={`btn btn-success ${styles.btn}`}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <BeatLoader size={10} color="#ffffff" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </>
          )}

          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
