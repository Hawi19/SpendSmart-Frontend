import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { apiUrl } from "../api/server";
import styles from "./Login.module.css";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.warning("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/user/login`, {
        username,
        password,
      });

      console.log("Login Response:", response); // Log the response

      const { token, username: responseUsername } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", responseUsername);

      toast.success("Login successful!");
      setUsername("");
      setPassword("");

      setTimeout(() => {
        navigate("/home", { state: { username: responseUsername } });
      }, 2000); // Delay navigation
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login Failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles.container} d-flex align-items-center justify-content-center min-vh-100`}
    >
      <div
        className={`${styles.card} shadow p-4`}
        style={{ width: "400px", borderRadius: "10px" }}
      >
        <h1 className={`${styles.title} text-center mb-4`}>Spend Smart</h1>
        <h3 className="text-center mb-4">Log in</h3>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="password">Password</label>
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
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="#ffffff" /> : "Login"}
          </button>
        </div>

        <div className="text-center mt-3">
          <p>
            Already have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p>
            <Link to="/reset-password">Forgot Password?</Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
