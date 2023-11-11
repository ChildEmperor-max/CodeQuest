import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./forms/login/LoginForm";
import SignupForm from "./forms/signup/SignupForm";
import LandingPage from "./forms/index/LandingPage";
import Game from "./Game";
import { PlayerProvider } from "./components/PlayerContext";
import { WorldProvider } from "./components/WorldContext";
import { QuestsDataProvider } from "./components/QuestContext";

function App() {
  return (
    <>
      <WorldProvider>
        <PlayerProvider>
          <QuestsDataProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/game" element={<Game />} />
            </Routes>
          </QuestsDataProvider>
        </PlayerProvider>
      </WorldProvider>
    </>
  );
}

export default App;
