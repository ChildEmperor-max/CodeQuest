import React, { useEffect, useState } from "react";
import SprintImageNoBG from "src/assets/icons/circle-running-icon-no-bg.svg";
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
import Shop from "./Shop/Shop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faCog,
  faUser,
  faMedal,
  faEdit,
  faTrophy,
  faQuestionCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import QuestDetails from "./Quests/QuestDetails";
import { disableKeyListeners, enableKeyListeners } from "../lib/KeyControls";
import { fetchCharacterById, fetchQuestTable } from "../db/HandleTable";
import { useNavigate } from "react-router-dom";
import { useQuestsData } from "../components/QuestContext";
import { useWorldContext } from "../components/WorldContext";
import AvatarImage from "src/assets/icons/default-avatar.png";

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
    shop: "shop",
  };
  // const playerId = JSON.parse(localStorage.getItem("playerId"));
  const playerId = localStorage.getItem("playerId");
  const navigate = useNavigate();
  const manageQuest = new ManageQuest();
  const { npcs } = useWorldContext();
  const { availableQuests, updateAvailableQuests } = useQuestsData();

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
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    fetchQuestTable()
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    displayUsername();
    viewQuests()
      .then((data) => {
        updateAvailableQuests(data);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, [updateAvailableQuests]);

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
    // if (!playerId) {
    //   navigate("/login");
    // }
    fetchCharacter();
  };

  const fetchCharacter = async () => {
    const [data, error] = await fetchCharacterById(playerId);
    if (data) {
      setCurrentXpBar((data[0].xp.current_xp / data[0].xp.max_xp) * 200);
      setCharacterData(data[0]);
    }
    if (error) {
      console.log("ERROR FETCHING CHARACTER IN INTERFACE: ", error);
    }
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
      // if (event.code === "KeyH" && keys.h.pressed) {
      //   toggleInterface(interfaces.helper);
      // }
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

  const startQuestAction = (quest) => {
    if (quest.quest_status === "active") {
      toggleInterface(interfaces.quests);
      setOpenQuestDetails(true);
    } else {
      const questNpc = npcs.filter((item) => {
        let npc;
        if (item.npcData[0]) {
          npc = item.npcData[0].npc_id === quest.npc_id;
        }
        return npc;
      });
      if (isNavigating) {
        setIsNavigating(false);
        questNpc[0].hideDistanceToPlayer();
      } else {
        setIsNavigating(true);
        questNpc[0].showDistanceToPlayer();
      }
    }
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
      {currentOpenedInterface === interfaces.shop && (
        <Shop onClose={() => toggleInterface(interfaces.shop)} />
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
                // shortcutKey="Q"
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
                name="Shop"
                icon={faShoppingCart}
                id="shop-button"
                onClickEvent={() => toggleInterface(interfaces.shop)}
              />
              {/* <InterfaceButton
                name="Settings"
                icon={faCog}
                id="settings-button"
                onClickEvent={() => toggleInterface(interfaces.settings)}
              /> */}
              <InterfaceButton
                name="Help"
                icon={faQuestionCircle}
                id="help-button"
                onClickEvent={() => toggleInterface(interfaces.helper)}
              />
            </div>
            <div className="left-container">
              {characterData && (
                <div className="left-ui-container">
                  <div className="horizontal-container">
                    <div onClick={() => toggleInterface(interfaces.profile)}>
                      <img src={AvatarImage} id="avatar-display" alt="Avatar" />
                    </div>
                    <div className="profile-display-container">
                      <p className="profile-name">
                        {characterData.character_name}
                      </p>
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
                            <p
                              className="quest-display-action"
                              onClick={() => startQuestAction(quest)}
                            >
                              {quest.quest_status === "active"
                                ? "Start"
                                : isNavigating
                                ? "Cancel"
                                : "Navigate"}
                            </p>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              )}
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
                  <img src={SprintImageNoBG} alt="Sprint" className="svg" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
