// Main.jsx
import React from "react";
import "boxicons";
import Home from "../pages/Home";
import About from "../pages/About";
import Features from "../pages/Features";
import Category from "../pages/Category";
import Faqs from "../pages/Faqs";
import Support from "../pages/Support";
// import { Link } from "react-router-dom";

function Main() {
  return (
    <div className="main-container">
      <main className="main">
        <Home />
        <Category />
        <About />
        <Faqs />
        <Features />
        <Support />
      </main>
    </div>
  );
}

export default Main;
