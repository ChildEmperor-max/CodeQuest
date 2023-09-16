import React, { useEffect, useState } from "react";
import CharacterProfile from "./CharacterProfile/CharacterProfile";
import Settings from "./settings/Settings";
import Achievements from "./Achievements/Achievements";
import Leaderboard from "./Leaderboard/Leaderboard";
import Quests from "./Quests/Quests";
import ControlsHelper from "./Help/ControlsHelper";
import DialogBox from "./DialogBox/DialogBox";
import CodeEditor from "./Editor/CodeEditor";
import QuestManager from "../lib/QuestManager";
import Popup from "./Popups/Popup";
import keys, {
  enableKeyListeners,
  disableKeyListeners,
} from "../lib/KeyControls";
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

export default function InterfaceHandler({
  settings: {
    antialias: { antialiasValue, setAntialiasValue },
    shadowMap: { shadowMapValue, setShadowMapValue },
  },
  playerInstance,
  npcInstances,
  cameraInstance,
  cameraControllerInstance,
}) {
  const interfaces = {
    none: "none",
    quests: "quests",
    profile: "profile",
    leaderboard: "leaderboard",
    achievements: "achievements",
    settings: "settings",
    helper: "helper",
    codedemo: "codedemo",
    editor: "editor",
  };
  const [currentOpenedInterface, setCurrentOpenedInterface] = useState(
    interfaces.none
  );

  const [isPlayerRunning, setIsPlayerRunning] = useState(false);

  const [isPlayerInteractingNpc, setIsPlayerInteractingNpc] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDescription, setPopupDescription] = useState(null);

  const [currentEditorQuest, setCurrentEditorQuest] = useState(null);

  const toggleInterface = (interfaceName) => {
    if (currentOpenedInterface === interfaceName) {
      setCurrentOpenedInterface(interfaces.none); // Close the current interface
    } else {
      setCurrentOpenedInterface(interfaceName); // Open the selected interface
    }
  };

  const closeDialogBox = () => {
    setIsPlayerInteractingNpc(null);
    cameraControllerInstance.currentTarget = playerInstance;
  };

  const InterfaceButton = ({
    name,
    icon,
    id,
    onClickEvent = null,
    shortcutKey = null,
  }) => {
    return (
      <button id={id} className="icon-button" onClick={onClickEvent}>
        <FontAwesomeIcon icon={icon} size="2xl" />
        <p className="button-text">{name}</p>
        {shortcutKey ? (
          <span className="shortcut-letter">{shortcutKey}</span>
        ) : null}
      </button>
    );
  };

  const AlbyInterface = () => {
    return (
      <div className="alby-interface centered">
        <div className="alby-interface-content">
          <div className="code-snippet">
            <code>
              <div className="code-snippet">
                <div className="line">{`public class script {`}</div>
                <div className="line highlight">{`  public static void main(String args[]) {`}</div>
                <div className="line">{`    System.out.println("Hello World!");`}</div>
                <div className="line">{`  }`}</div>
                <div className="line">{`}`}</div>
              </div>
            </code>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleRunningChange = (event) => {
      setIsPlayerRunning(event.detail);
    };

    document.addEventListener(
      "playerInstanceRunningChanged",
      handleRunningChange
    );

    return () => {
      document.removeEventListener(
        "playerInstanceRunningChanged",
        handleRunningChange
      );
    };
  }, [isPlayerRunning]);

  useEffect(() => {
    const handlePlayerNpcInteraction = (event) => {
      setIsPlayerInteractingNpc(event.detail);
    };
    document.addEventListener("playerInteractNpc", handlePlayerNpcInteraction);

    return () => {
      document.removeEventListener(
        "playerInteractNpc",
        handlePlayerNpcInteraction
      );
    };
  }, [isPlayerInteractingNpc]);

  useEffect(() => {
    const handleKeyToggle = (event) => {
      if (event.code === "KeyP" && keys.p.pressed) {
        toggleInterface(interfaces.profile);
      }
      if (event.code === "KeyH" && keys.h.pressed) {
        toggleInterface(interfaces.helper);
      }
      if (event.code === "KeyQ" && keys.q.pressed) {
        toggleInterface(interfaces.quests);
      }
    };

    window.addEventListener("keydown", handleKeyToggle);

    return () => {
      window.removeEventListener("keydown", handleKeyToggle);
    };
  }, [currentOpenedInterface]);

  const handlePopupContent = (header, message, description) => {
    setPopupHeader(header);
    setPopupMessage(message);
    setPopupDescription(description);
    setShowPopup(true);
  };

  return (
    <>
      {showPopup && (
        <Popup
          header={popupHeader}
          message={popupMessage}
          description={popupDescription}
          onClose={() => setShowPopup(false)}
        />
      )}
      {isPlayerInteractingNpc !== null ? (
        <DialogBox
          npc={isPlayerInteractingNpc}
          onClose={() => closeDialogBox()}
          playerInstance={playerInstance}
          npcInstances={npcInstances}
          cameraInstance={cameraInstance}
          cameraControllerInstance={cameraControllerInstance}
          onQuestStarted={(title, description) => {
            handlePopupContent("Quest started", title, description);
          }}
          onOpenEditor={(quest) => {
            setCurrentEditorQuest(quest);
            setCurrentOpenedInterface(interfaces.editor);
          }}
        />
      ) : null}
      {/* {currentOpenedInterface === interfaces.codedemo ? <AlbyInterface /> : null} */}
      {/* <AlbyInterface /> */}
      {currentOpenedInterface === interfaces.quests ? (
        <Quests onClose={() => toggleInterface(interfaces.quests)} />
      ) : null}
      {currentOpenedInterface === interfaces.editor && (
        <CodeEditor
          quest_data={currentEditorQuest}
          onClose={() => toggleInterface(interfaces.editor)}
        />
      )}
      {currentOpenedInterface === interfaces.profile ? (
        <CharacterProfile onClose={() => toggleInterface(interfaces.profile)} />
      ) : null}
      {currentOpenedInterface === interfaces.achievements ? (
        <Achievements
          onClose={() => toggleInterface(interfaces.achievements)}
        />
      ) : null}
      {currentOpenedInterface === interfaces.settings ? (
        <Settings
          onClose={() => toggleInterface(interfaces.settings)}
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
      {currentOpenedInterface === interfaces.leaderboard ? (
        <Leaderboard onClose={() => toggleInterface(interfaces.leaderboard)} />
      ) : null}
      {currentOpenedInterface === interfaces.helper ? (
        <ControlsHelper onClose={() => toggleInterface(interfaces.helper)} />
      ) : null}

      <div className="ui-container" id="interface-container">
        <div className="right-container">
          <InterfaceButton
            name="Quests"
            icon={faTasks}
            id="quest-button"
            onClickEvent={() => toggleInterface(interfaces.quests)}
            // onClickEvent={questManager.toggleQuestBox}
            shortcutKey="Q"
          />
          <InterfaceButton
            name="Editor"
            icon={faEdit}
            id="toggle-editor-button"
            onClickEvent={() => toggleInterface(interfaces.editor)}
          />
          <InterfaceButton
            name="Leaderboard"
            icon={faMedal}
            id="leaderboard-button"
            onClickEvent={() => toggleInterface(interfaces.leaderboard)}
          />
          <InterfaceButton
            name="Achievements"
            icon={faTrophy}
            id="achivements-button"
            onClickEvent={() => toggleInterface(interfaces.achievements)}
          />
          <InterfaceButton
            name="Settings"
            icon={faCog}
            id="settings-button"
            onClickEvent={() => toggleInterface(interfaces.settings)}
          />
        </div>
        <div className="left-container">
          <InterfaceButton
            name="Profile"
            icon={faUser}
            id="profile-button"
            onClickEvent={() => toggleInterface(interfaces.profile)}
            shortcutKey="P"
          />
          <InterfaceButton
            name="Help"
            icon={faQuestionCircle}
            id="help-button"
            onClickEvent={() => toggleInterface(interfaces.helper)}
            shortcutKey="H"
          />
        </div>
        <a>
          <div
            className={`sprint-image-container ${
              isPlayerRunning ? "sprint-triggered" : "sprint-enabled"
            }`}
            id="sprint-icon"
          >
            <img
              src="src/assets/icons/circle-running-icon-no-bg.svg"
              alt="Sprint"
              className="svg"
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
