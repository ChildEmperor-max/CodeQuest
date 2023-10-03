import React, { useEffect, useState } from "react";
import CharacterProfile from "./CharacterProfile/CharacterProfile";
import Settings from "./settings/Settings";
import Achievements from "./Achievements/Achievements";
import Leaderboard from "./Leaderboard/Leaderboard";
import Quests from "./Quests/Quests";
import ControlsHelper from "./Help/ControlsHelper";
import DialogBox from "./DialogBox/DialogBox";
import CodeEditor from "./Editor/CodeEditor";
import Popup from "./Popups/Popup";
import keys from "../lib/KeyControls";
import QuestHint from "./Quests/QuestHint";
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
import QuestDetails from "./Quests/QuestDetails";

export default function InterfaceHandler({
  settings: {
    antialias: { antialiasValue, setAntialiasValue },
    shadowMap: { shadowMapValue, setShadowMapValue },
  },
  playerInstance,
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
    questhint: "questhint",
    editor: "editor",
  };
  const [currentOpenedInterface, setCurrentOpenedInterface] = useState(
    interfaces.none
  );
  const [openQuestDetails, setOpenQuestDetails] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const [isPlayerRunning, setIsPlayerRunning] = useState(false);
  const [isPlayerNearNpc, setIsPlayerNearNpc] = useState(false);

  const [isPlayerInteractingNpc, setIsPlayerInteractingNpc] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDescription, setPopupDescription] = useState(null);

  const [currentEditorQuest, setCurrentEditorQuest] = useState(null);
  const [isQuestHint, setIsQuestHint] = useState(null);
  const [nextHint, setNextHint] = useState(null);

  const toggleInterface = async (interfaceName) => {
    if (currentOpenedInterface === interfaceName) {
      setShowButtons(true);
      setCurrentOpenedInterface(interfaces.none); // Close the current interface
    } else {
      setCurrentOpenedInterface(interfaceName); // Open the selected interface
      setShowButtons(false);
    }
  };

  useEffect(() => {
    const handlePlayerNearNpc = (event) => {
      setIsPlayerNearNpc(event.detail);
    };
    document.addEventListener("playerNearNpc", handlePlayerNearNpc);

    return () => {
      document.removeEventListener("playerNearNpc", handlePlayerNearNpc);
    };
  }, [isPlayerNearNpc]);

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

  const handleQuestHint = (quest_hint) => {
    if (quest_hint) {
      setIsQuestHint(quest_hint);
    } else {
      setNextHint(null);
      setIsQuestHint(null);
    }
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
      {openQuestDetails && (
        <QuestDetails
          quest={currentEditorQuest}
          isEditorOpen={true}
          onClose={() => setOpenQuestDetails(false)}
        />
      )}
      {isPlayerInteractingNpc !== null ? (
        <DialogBox
          npc={isPlayerInteractingNpc}
          onClose={() => closeDialogBox()}
          playerInstance={playerInstance}
          cameraInstance={cameraInstance}
          cameraControllerInstance={cameraControllerInstance}
          onPopupContent={(header, title, description) => {
            handlePopupContent(header, title, description);
          }}
          onOpenEditor={(quest) => {
            setCurrentEditorQuest(quest);
            if (currentOpenedInterface !== interfaces.editor) {
              setCurrentOpenedInterface(interfaces.editor);
              setOpenQuestDetails(true);
            }
          }}
          onOpenQuestHint={(quest_hint) => {
            handleQuestHint(quest_hint);
          }}
          onHighlightQuestHint={(line) => {
            setNextHint(line);
          }}
          onSetInteractingNpc={(npc) => setIsPlayerInteractingNpc(npc)}
        />
      ) : null}
      {isQuestHint ? (
        <QuestHint
          questHintId={isQuestHint}
          nextHint={nextHint}
          onClose={() => setIsQuestHint(null)}
        />
      ) : null}
      {currentOpenedInterface === interfaces.quests && (
        <Quests onClose={() => toggleInterface(interfaces.quests)} />
      )}
      {currentOpenedInterface === interfaces.editor && (
        <CodeEditor
          quest_data={currentEditorQuest}
          onClose={() => {
            toggleInterface(interfaces.editor);
            setOpenQuestDetails(false);
            setCurrentEditorQuest(null);
          }}
        />
      )}
      {currentOpenedInterface === interfaces.profile && (
        <CharacterProfile onClose={() => toggleInterface(interfaces.profile)} />
      )}
      {currentOpenedInterface === interfaces.achievements ? (
        <Achievements
          onClose={() => toggleInterface(interfaces.achievements)}
        />
      ) : null}
      {currentOpenedInterface === interfaces.settings && (
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
      )}
      {currentOpenedInterface === interfaces.leaderboard && (
        <Leaderboard onClose={() => toggleInterface(interfaces.leaderboard)} />
      )}
      {currentOpenedInterface === interfaces.helper && (
        <ControlsHelper onClose={() => toggleInterface(interfaces.helper)} />
      )}

      <div>
        {showButtons && (
          <div className="ui-container" id="interface-container">
            <div className="right-container">
              <InterfaceButton
                name="Quests"
                icon={faTasks}
                id="quest-button"
                onClickEvent={() => toggleInterface(interfaces.quests)}
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
            <div className="player-actions-container">
              {isPlayerNearNpc && (
                <div className="interact-action-container">
                  <div className="interact-button">E</div>
                  <span>Interact</span>
                </div>
              )}
              <div
                className={`sprint-image-container ${
                  isPlayerRunning ? "sprint-triggered" : "sprint-enabled"
                }`}
                id="sprint-icon"
              >
                <a>
                  <img
                    src="src/assets/icons/circle-running-icon-no-bg.svg"
                    alt="Sprint"
                    className="svg"
                  />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
