import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <p>Landing Page</p>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/signup"><button>Signup</button></Link>
    </div>
  )
};

export default LandingPage;
