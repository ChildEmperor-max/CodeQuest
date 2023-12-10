import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";
import { usePlayerContext } from "../../components/PlayerContext";
import { fetchPlayerByEmail } from "../../db/HandleTable";

const LoginForm = ({ darkMode }) => {
  const navigate = useNavigate();
  const { login } = usePlayerContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loginLabel, setLoginLabel] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setError("");
    setLoginLabel("Logging in...");
    e.preventDefault();

    let HEADERS = {
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin",
      "Content-Type": "application/json", //optional
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      // "Access-Control-Max-Age": "86400", // Adjust the value as needed
      // Vary: "Origin", // Add the Vary header
    };
    HEADERS["Access-Control-Allow-Origin"] = "*";
    // HEADERS["Vary"] = "Origin";

    try {
      const jsonData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        // "http://localhost:8000/api/users/login",
        "https://playcodequest.netlify.app/.netlify/functions/login",
        jsonData,
        {
          headers: HEADERS,
        }
      );

      if (response.status === 201) {
        fetchPlayerByEmail(jsonData.email)
          .then((playerData) => {
            console.log("Login successful: ", playerData);
            navigate("/game");

            localStorage.setItem("playerId", playerData[0].id);

            login(playerData[0].id);
          })
          .catch((err) => {
            console.log("Login failed: ", err);
            setError("An error occurred while logging in");
          });
      } else {
        console.log("Login failed");
        setError("An error occurred while logging in");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className={`login-container ${darkMode ? "dark" : "light"}`}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error ? (
          <div className="error">{error}</div>
        ) : loginLabel ? (
          <div>
            <p>{loginLabel}</p>
          </div>
        ) : null}
        <div className="form-group">
          <button type="submit">Login</button>
          <Link to="/signup">
            <p>Don't have an account?</p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
