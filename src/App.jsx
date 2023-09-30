import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./forms/login/LoginForm";
import SignupForm from "./forms/signup/SignupForm";
import Game from "./Game";
import LandingPage from "./forms/index/LandingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;
