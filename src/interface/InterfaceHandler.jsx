import React, { useEffect, useState } from "react";
import CharacterProfile from "./CharacterProfile/CharacterProfile";
import Settings from "./settings/Settings";
import Achievements from "./Achievements/Achievements";
import Leaderboard from "./Leaderboard/Leaderboard";
import ControlsHelper from "./Help/ControlsHelper";
import toggleEditor from "../Editor";
import QuestManager from "../lib/QuestManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faCog,
  faUser,
  faMedal,
  faEdit,
  faTrophy,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const questManager = new QuestManager();

export default function InterfaceHandler({
  settings: {
    antialias: { antialiasValue, setAntialiasValue },
    shadowMap: { shadowMapValue, setShadowMapValue },
  },
}) {
  const [isCharacterProfileOpen, setCharacterProfileOpen] = useState(false);
  const [isLeaderboardOpen, setleaderboardOpen] = useState(false);
  const [isAchievementsOpen, setAchievementsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isControlsHelperOpen, setIsControlsHelperOpen] = useState(false);

  const toggleCharacterProfile = () => {
    setCharacterProfileOpen(!isCharacterProfileOpen);
  };

  const toggleLeaderboard = () => {
    setleaderboardOpen(!isLeaderboardOpen);
  };

  const toggleAchievements = () => {
    setAchievementsOpen(!isAchievementsOpen);
  };

  const toggleSettings = () => {
    setSettingsOpen(!isSettingsOpen);
  };

  const toggleControlsHelper = () => {
    setIsControlsHelperOpen(!isControlsHelperOpen);
  };

  const InterfaceButton = ({
    name,
    icon,
    id,
    onclickEvent = null,
    shortcutKey = null,
  }) => {
    return (
      <button id={id} className="icon-button" onClick={onclickEvent}>
        <FontAwesomeIcon icon={icon} size="2xl" />
        <p className="button-text">{name}</p>
        {shortcutKey ? (
          <span className="shortcut-letter">{shortcutKey}</span>
        ) : null}
      </button>
    );
  };

  return (
    <>
      {isCharacterProfileOpen ? (
        <CharacterProfile onClose={toggleCharacterProfile} />
      ) : null}
      {isAchievementsOpen ? (
        <Achievements onClose={toggleAchievements} />
      ) : null}
      {isSettingsOpen ? (
        <Settings
          onClose={toggleSettings}
          antialias={{
            antialiasValue: antialiasValue,
            setAntialiasValue: setAntialiasValue,
          }}
          shadowMap={{
            shadowMapValue: shadowMapValue,
            setShadowMapValue: setShadowMapValue,
          }}
        />
      ) : null}
      {isLeaderboardOpen ? <Leaderboard onClose={toggleLeaderboard} /> : null}
      {isControlsHelperOpen ? (
        <ControlsHelper onClose={toggleControlsHelper} />
      ) : null}
      <div className="ui-container" id="interface-container">
        <div className="right-container">
          <InterfaceButton
            name="Quests"
            icon={faTasks}
            id="quest-button"
            onclickEvent={questManager.toggleQuestBox}
            shortcutKey="Q"
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
            icon={faTrophy}
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
          <InterfaceButton
            name="Help"
            icon={faQuestionCircle}
            id="help-button"
            onclickEvent={toggleControlsHelper}
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
