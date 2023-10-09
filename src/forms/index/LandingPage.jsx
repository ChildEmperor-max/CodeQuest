import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import Main from "./components/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";

const LandingPage = () => {
  document.body.classList.add("overflow-auto");
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
    // <div className="landing-page-container">
    //   <p>Welcome to CodeQuest!</p>
    //   <div className="buttons-container">
    //     <Link to="/login">
    //       <button>Login</button>
    //     </Link>
    //     <Link to="/signup">
    //       <button>Signup</button>
    //     </Link>
    //   </div>
    // </div>
  );
};

export default LandingPage;
