import React, { useEffect, useState } from "react";

export default function InterfaceHandler() {
  return (
    <div className="ui-container" id="interface-container">
      <div className="right-container">
        <button id="quest-button">Quests</button>
        <button id="leaderboard-button">Leaderboard</button>
        <button id="achievement-button">Achievements</button>
        <button id="settings-button">Settings</button>
      </div>
      <div className="left-container">
        <button id="profile-button">Profile</button>
      </div>
      <a>
        <div
          className="sprint-image-container sprint-disabled"
          id="sprint-icon"
        >
          <img
            src="src/assets/icons/circle-running-icon-no-bg.png"
            alt="Sprint"
          />
        </div>
      </a>
      <div id="popupContainer">
        <div id="popupContent">
          <p>New Quest Accepted</p>
          <p id="quest-item">{/* Accepted quest title here */}</p>
          <button id="closeButton">Okay</button>
        </div>
      </div>
    </div>
  );
}
