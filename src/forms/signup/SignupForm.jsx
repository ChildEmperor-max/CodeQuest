import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignupForm.css";
import {
  fetchQuestTable,
  insertCharacterByPlayerId,
  insertAllPlayerQuest,
  insertPlayerQuestProgress,
} from "../../db/HandleTable";
import supabase from "../../config/supabaseConfig";

const SignupForm = ({ darkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [currentTab, setCurrentTab] = useState(1);

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
      // const user = await supabase.auth.signUp({
      //   email: formData.email,
      //   password: formData.password,
      // });

      // Extract user ID from the Netlify identity object
      // const userId = user.id;

      // const userDetails = {
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   gender: formData.gender,
      //   role: formData.role,
      //   // Add other details as needed
      // };

      const response = await axios.post(
        "http://localhost:8000/api/users/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // const response = await axios.post(
      //   // "http://localhost:8000/api/users/signup",
      //   "https://playcodequest.netlify.app/.netlify/functions/signup",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       user_id: userId,
      //       ...userDetails,
      //     }),
      //   }
      // );

      // if (response.ok) {
      //   console.log("User and details inserted successfully");
      //   // Redirect or perform other actions as needed
      // } else {
      //   console.error("Error inserting user details");
      // }

      if (response.status === 201) {
        const quests = await fetchQuestTable();

        insertAllPlayerQuest(response.data.id, quests).then((result) => {
          console.log("QUEST ADDED: ", result);
          insertCharacterByPlayerId(response.data.id).then((result) => {
            navigate("/login");
            console.log("Character inserted successfully: ", result);
          });
        });
        console.log("Signup successful:", response.data);
      } else {
        setError("Signup failed");
        console.log("Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occured while signing up");
      if (error.response.statusText === "Conflict") {
        setError("Email already exists");
      }
    }
  };

  return (
    <div className={`signup-form-container ${darkMode ? "dark" : "light"}`}>
      <div className="signup-sub-container">
        <h2>Signup as a:</h2>
        <form onSubmit={handleSubmit}>
          {currentTab === 1 && (
            <>
              <div className="form-group">
                <button
                  name="role"
                  onClick={() => {
                    setFormData({ ...formData, role: "Student" });
                    setCurrentTab(2);
                  }}
                >
                  Student
                </button>
                <button
                  name="role"
                  onClick={() => {
                    setFormData({ ...formData, role: "Self Learner" });
                    setCurrentTab(2);
                  }}
                >
                  Self Learner
                </button>
                <button
                  name="role"
                  onClick={() => {
                    setFormData({ ...formData, role: "Code Enthusiast" });
                    setCurrentTab(2);
                  }}
                >
                  Code Enthusiast
                </button>
              </div>
            </>
          )}
          {currentTab === 2 && (
            <>
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
                <button onClick={() => setCurrentTab(3)}>Next</button>
                <button onClick={() => setCurrentTab(1)}>Back</button>
              </div>
            </>
          )}
          {currentTab === 3 && (
            <>
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
                <button type="submit">Signup</button>
                <button onClick={() => setCurrentTab(2)}>Back</button>
              </div>
            </>
          )}
          {error && <div className="error">{error}</div>}
          <Link to="/login">
            <p>Already have an account?</p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
