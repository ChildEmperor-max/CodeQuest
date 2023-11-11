import React, { useEffect, useState } from "react";
import CharacterProfile from "./CharacterProfile/CharacterProfile";
import Settings from "./Settings/Settings";
import Achievements from "./Achievements/Achievements";
import Leaderboard from "./Leaderboard/Leaderboard";
import Quests from "./Quests/Quests";
import ControlsHelper from "./Help/ControlsHelper";
import DialogBox from "./DialogBox/DialogBox";
import CodeEditor from "./Editor/CodeEditor";
import Popup from "./Popups/Popup";
import keys from "../lib/KeyControls";
import QuestHint from "./Quests/QuestHint";
import ManageQuest from "../db/ManageQuest";
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
import { disableKeyListeners, enableKeyListeners } from "../lib/KeyControls";
import { fetchCharacterById } from "../db/HandleTable";
import { useNavigate } from "react-router-dom";
import { receiveXp } from "../lib/XpManager";
import { useQuestsData } from "../components/QuestContext";

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
    questhint: "questhint",
    editor: "editor",
  };
  const navigate = useNavigate();
  const { availableQuests, updateAvailableQuests } = useQuestsData();
  const manageQuest = new ManageQuest();
  const [characterData, setCharacterData] = useState(null);
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

  const [currentXpBar, setCurrentXpBar] = useState(0);
  const [showMiniQuestDisplay, setShowMiniQuestDisplay] = useState(true);

  useEffect(() => {
    displayUsername();
    viewQuests()
      .then((data) => {
        updateAvailableQuests(data);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, [availableQuests, updateAvailableQuests]);

  const viewQuests = async () => {
    try {
      const quests = await manageQuest.getPlayerQuests();
      return quests;
    } catch (error) {
      console.error("InterfaceHandler.jsx error viewing the quests: ", error);
      throw error;
    }
  };

  const displayUsername = () => {
    const playerId = JSON.parse(localStorage.getItem("playerId"));
    if (!playerId) {
      navigate("/login");
    }
    fetchCharacter();
  };

  const fetchCharacter = () => {
    const playerId = JSON.parse(localStorage.getItem("playerId"));
    fetchCharacterById(playerId)
      .then((result) => {
        setCurrentXpBar((result[0].xp.current_xp / result[0].xp.max_xp) * 200);
        setCharacterData(result[0]);
      })
      .catch((err) => {
        console.log("[FETCH CHARACTER ERROR]", err);
      });
  };

  const toggleInterface = async (interfaceName) => {
    if (currentOpenedInterface === interfaceName) {
      setCurrentOpenedInterface(interfaces.none);
      setShowButtons(true);
      // enableKeyListeners();

      // viewQuests()
      //   .then((data) => {
      //     updateAvailableQuests(data);
      //   })
      //   .catch((error) => {
      //     console.error("[ERROR]:", error);
      //   });
    } else {
      setCurrentOpenedInterface(interfaceName);
      setShowButtons(false);
      // disableKeyListeners();
    }
    displayUsername();
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
      if (event.code === "Escape") {
        toggleInterface(currentOpenedInterface);
      }
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
          setCurrentXpBar={setCurrentXpBar}
          fetchCharacter={fetchCharacter}
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
          npcInstances={npcInstances}
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

      <div className="ui-container" id="interface-container">
        {showButtons && (
          <>
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
              {/* <InterfaceButton
                name="Profile"
                icon={faUser}
                id="profile-button"
                onClickEvent={() => toggleInterface(interfaces.profile)}
                shortcutKey="P"
              /> */}
              {characterData && (
                <div className="left-ui-container">
                  <div className="horizontal-container">
                    <div onClick={() => toggleInterface(interfaces.profile)}>
                      <img
                        src="/src/assets/icons/default-avatar.png"
                        id="avatar-display"
                        alt="Avatar"
                      />
                    </div>
                    <div className="profile-display-container">
                      <p>{characterData.character_name}</p>
                      <p>Level: {characterData.level}</p>
                      <span>XP:</span>
                      <div className="xp-bar-background">
                        <div
                          className="xp-bar"
                          style={{
                            width: `${currentXpBar}px`,
                          }}
                        ></div>
                        <p>
                          {characterData.xp.current_xp}/
                          {characterData.xp.max_xp}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="quest-display-container">
                    <h4
                      onClick={() => setShowMiniQuestDisplay((prev) => !prev)}
                    >
                      Quests
                      <span>{showMiniQuestDisplay ? "-" : "+"}</span>
                    </h4>
                    {showMiniQuestDisplay
                      ? availableQuests.map((quest, index) => (
                          <div className="quest-display-content" key={index}>
                            <p
                              className="quest-display-title"
                              onClick={() => toggleInterface(interfaces.quests)}
                            >
                              {quest.quest_title}
                            </p>
                            <p className="quest-display-action">
                              {quest.quest_status === "active"
                                ? "Start"
                                : "Navigate"}
                            </p>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              )}
              {/* <InterfaceButton
                name="Help"
                icon={faQuestionCircle}
                id="help-button"
                onClickEvent={() => toggleInterface(interfaces.helper)}
                shortcutKey="H"
              /> */}
            </div>
            {isPlayerNearNpc && (
              <div className="interact-action-container">
                <div className="interact-button">E</div>
                <span>Interact</span>
              </div>
            )}
            <div className="player-actions-container">
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
          </>
        )}
      </div>
    </>
  );
}
