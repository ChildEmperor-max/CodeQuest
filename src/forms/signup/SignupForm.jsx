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
      const response = await axios.post(
        "http://localhost:8000/api/users/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        insertCharacterByPlayerId(response.data.id)
          .then((result) => {
            console.log(result);
            fetchQuestTable()
              .then((quests) => {
                quests.find((quest) => {
                  console.log("QUEST ADDED: ", quest);
                  insertPlayerQuestProgress(
                    response.data.id,
                    quest.quest_id,
                    quest.quest_id === 3 ? "inactive" : "locked"
                  );
                });
                console.log("Signup successful:", response.data);
                navigate("/login");
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
      console.error("Error signing up:", error.response.statusText);
      setError("An error occured while signing up");
      if (error.response.statusText === "Conflict") {
        setError("Email already exists");
      }
    }
  };

  return (
    <div className="signup-form-container">
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
