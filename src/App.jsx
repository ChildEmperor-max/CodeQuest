import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./forms/login/LoginForm";
import SignupForm from "./forms/signup/SignupForm";
import LandingPage from "./forms/index/LandingPage";
import Game from "./Game";
import { PlayerProvider } from "./components/PlayerContext";
import { WorldProvider } from "./components/WorldContext";

function App() {
  return (
    <>
      <WorldProvider>
        <PlayerProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </PlayerProvider>
      </WorldProvider>
    </>
  );
}

export default App;
