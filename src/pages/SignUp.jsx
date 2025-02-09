import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; 
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
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.warning("Please fill in all fields."); 
      return;
    }

    setLoading(true); 

    axios
      .post(`${apiUrl}/api/user/signup`, { username, email, password })
      .then(() => {
        toast.success(
          "Sign Up successful! Please check your email to verify your account."
        ); 
        navigate("/");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Sign Up Failed. Please try again.";
        toast.error(errorMessage); 
        console.log(
          "Error during sign up:",
          error.response ? error.response.data : error.message
        );
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  return (
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
            {loading ? (
              <BeatLoader size={10} color="#ffffff" /> // Use BeatLoader
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
        <div className="text-center mt-3">
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
