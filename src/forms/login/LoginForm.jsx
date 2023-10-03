import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";
import { usePlayerContext } from "../../components/PlayerContext";
import { fetchPlayerByEmail } from "../../db/HandleTable";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = usePlayerContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jsonData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
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
          });
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">email</label>
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
        <div className="form-group">
          <button type="submit">Login</button>
          <Link to="/signup">
            <button>Signup</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
