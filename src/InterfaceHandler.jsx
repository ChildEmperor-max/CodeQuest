import React, { useEffect, useState } from "react";
import CharacterProfile from "./CharacterProfile";
import toggleEditor from "./Editor";
import QuestManager from "./lib/QuestManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faChartBar,
  faCog,
  faUser,
  faMedal,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const questManager = new QuestManager();

export default function InterfaceHandler() {
  const [isCharacterProfileOpen, setCharacterProfileOpen] = useState(false);
  const [isLeaderboardOpen, setleaderboardOpen] = useState(false);
  const [isAchievementsOpen, setAchievementsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const toggleCharacterProfile = () => {
    setCharacterProfileOpen(!isCharacterProfileOpen);
  };

  const toggleLeaderboard = () => {
    setleaderboardOpen(!isLeaderboardOpen);
    console.log("Leaderboard");
  };

  const toggleAchievements = () => {
    setAchievementsOpen(!isAchievementsOpen);
    console.log("Achievements");
  };

  const toggleSettings = () => {
    setSettingsOpen(!isSettingsOpen);
    console.log("Settings");
  };

  const InterfaceButton = ({ name, icon, id, onclickEvent = null }) => {
    return (
      <button id={id} className="icon-button" onClick={onclickEvent}>
        <FontAwesomeIcon icon={icon} size="2xl" />
        <p className="button-text">{name}</p>
      </button>
    );
  };

  return (
    <>
      {isCharacterProfileOpen ? (
        <CharacterProfile onClose={toggleCharacterProfile} />
      ) : null}
      <div className="ui-container" id="interface-container">
        <div className="right-container">
          <InterfaceButton
            name="Quests"
            icon={faTasks}
            id="quest-button"
            onclickEvent={questManager.toggleQuestBox}
          />
          <InterfaceButton
            name="Editor"
            icon={faEdit}
            id="toggle-editor-button"
            onclickEvent={toggleEditor}
          />
          <InterfaceButton
            name="Leaderboard"
            icon={faMedal}
            id="leaderboard-button"
            onclickEvent={toggleLeaderboard}
          />
          <InterfaceButton
            name="Achievements"
            icon={faChartBar}
            id="achivements-button"
            onclickEvent={toggleAchievements}
          />
          <InterfaceButton
            name="Settings"
            icon={faCog}
            id="settings-button"
            onclickEvent={toggleSettings}
          />
        </div>
        <div className="left-container">
          <InterfaceButton
            name="Profile"
            icon={faUser}
            id="profile-button"
            onclickEvent={toggleCharacterProfile}
          />
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
      </div>
      <div id="popupContainer">
        <div id="popupContent">
          <p id="popup-text-header">New Quest Accepted</p>
          <p id="quest-item">{/* Accepted quest title here */}</p>
          <button id="closeButton">Okay</button>
        </div>
      </div>
    </>
  );
}
