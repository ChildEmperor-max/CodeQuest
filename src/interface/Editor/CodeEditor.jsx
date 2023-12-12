import React, { useEffect, useState } from "react";
import {
  faPlay,
  faPlus,
  faMinus,
  faMoon,
  faSun,
  faTimes,
  faCheck,
  faTasks,
  faQuestionCircle,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";
import ace from "ace-builds";

import {
  executeJavaCode,
  fetchCharacterById,
  fetchPlayerQuests,
  fetchNpcByQuestId,
  fetchNpcQuestDialog,
  updateCharacterNameById,
} from "../../db/HandleTable";
import ButtonText from "./ButtonText";
import PanelButton from "./PanelButton";
import ManageQuest from "../../db/ManageQuest";
import { disableKeyListeners, enableKeyListeners } from "../../lib/KeyControls";
import Popup from "../Popups/Popup";
import ActiveQuestsModal from "./ActiveQuestsModal";
import PseudoCode from "./PseudoCode";
import Hint from "./Hint";
import Countdown from "./Countdown";
import { usePlayerContext } from "../../components/PlayerContext";
import AlertModal from "../../components/AlertModal";
import { useWorldContext } from "../../components/WorldContext";
import { getNpcs } from "../../npc/NPCGetterSetter";

const CodeEditor = ({ npcInstances, quest_data, onClose }) => {
  const { playerId, characterData, updateCharacterData, setCharacterData } =
    usePlayerContext();
  const { npcs } = useWorldContext();
  const [npcArray, setNpcArray] = useState([]);

  const [editorValue, setEditorValue] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [darkMode, setDarkMode] = useState(true);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [activeQuests, setActiveQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDescription, setPopupDescription] = useState(null);
  const [popupPositiveStyle, setPopupPositiveStyle] = useState(true);

  const [showPseudoCode, setShowPseudoCode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintCountdown, setHintCountdown] = useState(10);
  const [showHintCountdown, setShowHintCountdown] = useState(false);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [useItemAlert, setUseItemAlert] = useState(null);
  const [isWarningAlert, setIsWarningAlert] = useState(null);
  const [updatedUsername, setUpdatedUsername] = useState("");

  const manageQuest = new ManageQuest();

  const handleEditorChange = (newValue) => {
    setEditorValue(newValue);
  };

  const handlePopupContent = (header, message, description, positive) => {
    setPopupHeader(header);
    setPopupMessage(message);
    setPopupDescription(description);
    setPopupPositiveStyle(positive);
    setShowPopup(true);
  };

  useEffect(() => {
    setNpcArray(getNpcs());
    ace.config.set("basePath", "/node_modules/ace-builds/src");
    if (quest_data) {
      setEditorValue(quest_data.code_template);
    } else {
      setEditorValue(`public class script {
    public static void main(String args[]) {
        
    }
}`);
    }
    disableKeyListeners();
  }, []);

  let editorTheme = darkMode ? "twilight" : "github";

  const executeJavaCodeAndHandleOutput = () => {
    setLoading(true);
    setEditorValue(editorValue);
    return executeJavaCode({
      code: editorValue,
      quest: quest_data ? quest_data.quest_title : null,
      scriptName: quest_data ? quest_data.script_name : "script",
    })
      .then((response) => {
        if (response.error) {
          setOutput(response.error);
        } else {
          setOutput(response.output);
        }
        return response;
      })
      .catch((error) => {
        setOutput("Error executing Java code: " + error.message);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const executeCode = () => {
    executeJavaCodeAndHandleOutput();
  };

  const submitPlayerAnswer = (quest_answer) => {
    executeJavaCodeAndHandleOutput()
      .then((response) => {
        if (!response.error) {
          // const variableNames = editorValue.match(/\b\w+\b\s*(?==)/g);
          // if (variableNames) {
          //   variableNames.forEach((variableName) => {
          //     console.log(variableName.trim());
          //   });
          // }
          let playerAnswer = editorValue.replace(/\b\w+\b\s*(?==)/g, "");
          let correctAnswer = quest_answer.replace(/\b\w+\b\s*(?==)/g, "");
          if (quest_data.quest_id === 3) {
            console.log("chosen username: ", response.output);
            if (response.output.length < 4) {
              setOutput(
                `${response.output} \nUsername must be at least 4 characters long.`
              );
              console.log("Username must be at least 4 characters long.");
            } else {
              const regex = /^[a-zA-Z0-9]+$/;
              if (!regex.test(response.output)) {
                setOutput(
                  `${response.output} \nUsername cannot contain special characters.`
                );
                console.log("Username cannot contain special characters.");
              } else {
                setUpdatedUsername(response.output);
                setAlertMessage(
                  `Are sure about your username? ${response.output}`
                );
                setShowAlertModal(true);
              }
            }
            return;
          }

          if (
            playerAnswer
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(correctAnswer.toLowerCase().replace(/\s+/g, ""))
          ) {
            manageQuest.toCompleteQuest(quest_data.quest_id);
            fetchActiveQuests();
            handlePopupContent(
              "Quest Progressed",
              quest_data.quest_title,
              quest_data.quest_description,
              true
            );
            updateNpcQuestStatus("toComplete");
          } else {
            console.log("WRONG! ");
            handlePopupContent(
              "Wrong answer",
              quest_data.quest_title,
              "You can try again, don't worry!",
              false
            );
          }
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => prevSize - 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchActiveQuests = async () => {
    try {
      const activeQuests = await fetchPlayerQuests(playerId);
      const filteredQuests = activeQuests.filter(
        (element) => element.quest_status === "active"
      );
      setActiveQuests(filteredQuests);
    } catch (error) {
      console.error("[ERROR]:", error);
    }
  };

  useEffect(() => {
    fetchActiveQuests();
  }, []);

  //   let startedQuest = questTitle ? true : false;

  const viewSelectedQuestModal = () => {
    setIsQuestModalOpen(true);
    // if (startedQuest) {
    //   setModalTitle(questTitle + " - " + questFrom);
    //   setModalDescription(questDescription);
    //   setQuestSelected(true);
    // } else {
    //   setQuestSelected(false);
    //   setModalTitle("Quests");
    //   setModalDescription(questDescription);
    // }
  };

  const handleConfirmUsername = () => {
    updateCharacterNameById(playerId, updatedUsername)
      .then(() => {
        manageQuest.toCompleteQuest(quest_data.quest_id);
        console.log(updatedUsername);
        fetchActiveQuests();
        handlePopupContent(
          "Quest Progressed",
          quest_data.quest_title,
          "Talk to Alby to complete the quest",
          true
        );
        setOutput(`${updatedUsername} \nUsername has been set!`);
        updateCharacterData(playerId);
        setShowAlertModal(false);
        updateNpcQuestStatus("toComplete");
      })
      .catch((err) => {
        console.log("Update username error: ", err);
        setOutput(
          `${updatedUsername} \nAn error occured while trying to set the username.`
        );
        setShowAlertModal(false);
      });
  };
  const updateNpcQuestStatus = (questStatus) => {
    fetchNpcByQuestId(quest_data.quest_id, playerId)
      .then((result) => {
        const npc = npcArray.filter((item) => {
          return item.npcName === result[0].npc_name;
        });
        npc[0].currentQuestStatus.stats = "toComplete";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const confirmUseItem = (item) => {
    console.log(characterData.inventory);
    switch (item) {
      case characterData.inventory && characterData.inventory[1].itemName:
        setShowHint(true);
        setIsWarningAlert({ message: `${item} is now used` });
        // setCharacterData({
        //   ...characterData,
        //   inventory: {
        //     ...characterData.inventory,
        //     [1]: {
        //       ...characterData.inventory[1],
        //       itemCount: (characterData.inventory[1]?.itemCount || 0) - 1,
        //     },
        //   },
        // });

        break;
      case characterData.inventory && characterData.inventory[3].itemName:
        setShowPseudoCode(true);
        setIsWarningAlert({ message: `${item} is now used` });
        break;
      default:
        setIsWarningAlert({ message: ` You don't have the item '${item}'` });
        break;
    }
    setUseItemAlert(null);
  };

  return (
    <>
      {showAlertModal && (
        <AlertModal
          message={alertMessage}
          onConfirm={handleConfirmUsername}
          onCancel={() => setShowAlertModal(false)}
        />
      )}
      {useItemAlert && (
        <AlertModal
          message={useItemAlert.message}
          onConfirm={() => confirmUseItem(useItemAlert.item)}
          onCancel={() => setUseItemAlert(null)}
        />
      )}
      {isWarningAlert && (
        <AlertModal
          message={isWarningAlert.message}
          onOk={() => setIsWarningAlert(null)}
        />
      )}
      {showPopup && (
        <Popup
          header={popupHeader}
          message={popupMessage}
          description={popupDescription}
          onClose={() => setShowPopup(false)}
          positiveStyle={popupPositiveStyle}
        />
      )}
      <div className="alby-interface alby-editor">
        {showPseudoCode && (
          <PseudoCode
            code={quest_data.pseudo_code}
            onClose={() => setShowPseudoCode(false)}
          />
        )}
        {showHint && (
          <Hint
            hint={quest_data.hint}
            onClose={() => {
              setShowHint(false);
              setShowHintCountdown(true);
            }}
          />
        )}

        {isQuestModalOpen ? (
          <ActiveQuestsModal
            active_quests={activeQuests}
            quest_data={quest_data}
            onClose={() => setIsQuestModalOpen(false)}
          />
        ) : null}
        <p id="code-editor-label">Alby CodeEditor</p>
        <div id="ace-editor-panel">
          <>
            <div id="editor-panel-buttons">
              <div>
                <ButtonText
                  onClick={executeCode}
                  disabled={loading}
                  title="Run script"
                  icon={faPlay}
                  buttonText="Run"
                />
                <div className="button-text-container">
                  <div className="grouped-buttons">
                    <PanelButton
                      onClick={increaseFontSize}
                      title="Increase font size"
                      icon={faPlus}
                    />
                    <PanelButton
                      onClick={decreaseFontSize}
                      title="Decrease font size"
                      icon={faMinus}
                    />
                  </div>
                  <span className="button-text">Font size</span>
                </div>

                <ButtonText
                  onClick={toggleDarkMode}
                  disabled={loading}
                  title="Toggle Dark mode"
                  icon={darkMode ? faMoon : faSun}
                  buttonText={darkMode ? "Dark" : "Light"}
                />

                {quest_data ? (
                  <ButtonText
                    onClick={viewSelectedQuestModal}
                    title="Selected quest"
                    icon={faTasks}
                    buttonText="Quest"
                  />
                ) : null}

                {quest_data ? <span>{selectedQuest}</span> : ""}
              </div>
              <div>
                {showHintCountdown ? (
                  <Countdown
                    initialTime={hintCountdown}
                    onCountdownEnd={() => setShowHintCountdown(false)}
                  />
                ) : quest_data && quest_data.hint ? (
                  <ButtonText
                    onClick={() => {
                      setUseItemAlert({
                        message: "Are you sure you want to use 'Hints'?",
                        item: "Hints",
                      });
                    }}
                    disabled={quest_data && quest_data.hint ? false : true}
                    title="View hint"
                    icon={faQuestionCircle}
                    buttonText="Hint"
                  />
                ) : null}

                {quest_data && quest_data.pseudo_code ? (
                  <ButtonText
                    onClick={() => {
                      setUseItemAlert({
                        message: "Are you sure you want to use 'Pseudo Code'?",
                        item: "Pseudo Code",
                      });
                    }}
                    disabled={
                      quest_data && quest_data.pseudo_code ? false : true
                    }
                    title="Pseudo Code"
                    icon={faCode}
                    buttonText="Pseudo Code"
                  />
                ) : null}
              </div>
              <div>
                {quest_data ? (
                  <ButtonText
                    onClick={() => {
                      quest_data && submitPlayerAnswer(quest_data.quest_answer);
                    }}
                    disabled={loading || !quest_data}
                    title="Submit answer"
                    icon={faCheck}
                    buttonText="Submit"
                  />
                ) : null}
                <ButtonText
                  onClick={() => {
                    onClose();
                    setSelectedQuest(null);
                    enableKeyListeners();
                  }}
                  title="Close"
                  icon={faTimes}
                  buttonText="Close"
                />
              </div>
            </div>
            <AceEditor
              id="editor"
              mode="java"
              theme={editorTheme}
              onChange={handleEditorChange}
              fontSize={fontSize}
              name="ace-editor"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
              }}
              value={editorValue}
              style={{ width: `100%`, height: `100%` }}
            />
            <div className="java-output-message">
              Output:
              <br />
              {loading ? "Executing..." : output}
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
