import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../api/server";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.trim().length < 5) {
      newErrors.username = "Username must be at least 5 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.trim().length < 5) {
      newErrors.password = "Password must be at least 5 characters.";
    }

    return newErrors;
  };

  const handleSignUp = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/user/signup`, {
        username,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Sign Up successful! Please check your emailto verify your account.."
        );
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Unexpected response. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${styles.container} d-flex align-items-center justify-content-center min-vh-100`}
      >
        <div className={`${styles.card} shadow p-4`}>
          <h1 className={`${styles.title} text-center mb-4`}>Spend Smart</h1>
          <h3 className="text-center mb-4">Sign Up</h3>

          <div className={`${styles.formGroup}`}>
            <label htmlFor="username" className="mx-3">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
            {errors.username && (
              <div className="text-danger mt-1">{errors.username}</div>
            )}
          </div>

          <div className={`${styles.formGroup} mt-3`}>
            <label htmlFor="email" className="mx-3">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
            {errors.email && (
              <div className="text-danger mt-1">{errors.email}</div>
            )}
          </div>

          <div className={`${styles.formGroup} mt-3`}>
            <label htmlFor="password" className="mx-3">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
            {errors.password && (
              <div className="text-danger mt-1">{errors.password}</div>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              className={`btn btn-primary ${styles.btn}`}
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? <BeatLoader size={10} color="#ffffff" /> : "Sign Up"}
            </button>
          </div>

          <div className="text-center mt-3">
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
