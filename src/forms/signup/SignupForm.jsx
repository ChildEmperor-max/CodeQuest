import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignupForm.css";
import {
  fetchQuestTable,
  insertCharacterByPlayerId,
  insertPlayerQuestProgress,
} from "../../db/HandleTable";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
  });
  const [error, setError] = useState("");

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
      const response = await axios.post(
        "http://localhost:8000/api/users/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.id);
      if (response.status === 201) {
        console.log("Signup successful:", response.data);
        insertCharacterByPlayerId(response.data.id)
          .then((result) => {
            console.log(result);
            navigate("/login");
            fetchQuestTable()
              .then((quests) => {
                quests.find((quest) => {
                  insertPlayerQuestProgress(
                    response.data.id,
                    quest.quest_id,
                    "inactive"
                  );
                });
              })
              .catch((err) => {
                console.log("Quest fetch error. ", err);
              });
          })
          .catch((err) => {
            setError("Signup failed");
            console.log("Character creation error. ", err);
          });
      } else {
        setError("Signup failed");
        console.log("Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occured while signing up");
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
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
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Gender</label>
          <div>
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              required
            />
            <label htmlFor="male">Male</label>
          </div>
          <div>
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              required
            />
            <label htmlFor="female">Female</label>
          </div>
        </div>
        {error && <div className="error">{error}</div>}{" "}
        <div className="form-group">
          <button type="submit">Signup</button>
          <Link to="/login">
            <p>Already have an account?</p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
