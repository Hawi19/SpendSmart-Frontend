import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { apiUrl } from "../api/server";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSignUp = () => {
  console.log("Sign Up button clicked");

  if (!username.trim() || !email.trim() || !password.trim()) {
    toast.warning("Please fill in all fields.");
    return;
  }

  setLoading(true);

  axios
    .post(`${apiUrl}/api/user/signup`, { username, email, password })
    .then((response) => {
      console.log("Response from API:", response);
      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Sign Up successful! Please check your email to verify your account."
        );
        setTimeout(() => {
          navigate("/");
        }, 2000); 
      } else {
        toast.error("Unexpected response. Please try again.");
      }
    })
    .catch((error) => {
      console.log("Sign Up Error:", error);
      console.log("Error Response:", error.response);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    })
    .finally(() => {
      setLoading(false);
    });
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
              required
            />
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
              required
            />
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
              required
            />
          </div>
          <div className="text-center mt-4">
            <button
              className={`btn btn-primary ${styles.btn}`}
              onClick={handleSignUp}
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
