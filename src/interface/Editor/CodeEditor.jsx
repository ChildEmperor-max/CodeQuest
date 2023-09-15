import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPlus,
  faMinus,
  faMoon,
  faSun,
  faTimes,
  faCheck,
  faTasks,
  faRefresh,
  faArrowRight,
  faArrowLeft,
  faQuestionCircle,
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
  fetchNpcQuestDialog,
  fetchNpcQuestDialogById,
} from "../../db/HandleTable";
import ButtonText from "./ButtonText";
import PanelButton from "./PanelButton";
import ManageQuest from "../../db/ManageQuest";
import QuestManager from "../../lib/QuestManager";
import { disableKeyListeners, enableKeyListeners } from "../../lib/KeyControls";
import Popup from "../Popups/Popup";

const CodeEditor = ({ quest_data, onClose }) => {
  const [editorValue, setEditorValue] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [darkMode, setDarkMode] = useState(false);
  const [editorWidth, setEditorWidth] = useState("600px");
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Accepted quests");
  const [modalDescription, setModalDescription] = useState("");
  const [editorVal, setEditorVal] = useState("");
  const [activeQuests, setActiveQuests] = useState([]);
  const [selectedQuestAnswer, setSelectedQuestAnswer] = useState("");
  const [selectedQuest, setSelectedQuest] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDescription, setPopupDescription] = useState(null);
  const [popupPositiveStyle, setPopupPositiveStyle] = useState(true);

  const manageQuest = new ManageQuest();
  const questManager = new QuestManager();

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
    ace.config.set("basePath", "/node_modules/ace-builds/src");
    if (quest_data) {
      setEditorValue(quest_data.code_template);
    }
    disableKeyListeners();
  }, []);

  let editorTheme = darkMode ? "twilight" : "github";

  const executeJavaCodeAndHandleOutput = () => {
    setLoading(true);
    setEditorValue(editorValue);
    return executeJavaCode({ code: editorValue, quest: quest_data.quest_title })
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

  const submitPlayerAnswer = (ans) => {
    executeJavaCodeAndHandleOutput()
      .then((response) => {
        if (!response.error) {
          // const variableNames = editorValue.match(/\b\w+\b\s*(?==)/g);
          // if (variableNames) {
          //   variableNames.forEach((variableName) => {
          //     console.log(variableName.trim());
          //   });
          // }
          console.log(ans);
          let playerAnswer = editorValue.replace(/\b\w+\b\s*(?==)/g, "");
          let correctAnswer = ans.replace(/\b\w+\b\s*(?==)/g, "");
          if (
            playerAnswer.toLowerCase().includes(correctAnswer.toLowerCase())
          ) {
            console.log("CORRECT!");
            console.log(quest_data.id);
            // updateQuestDataStatus(questId, "completed");
            // questManager.moveQuestToCompleted(questTitle);
            manageQuest.updateQuestStatus(
              quest_data.id,
              manageQuest.status.completed
            );
            fetchActiveQuests();
            // questTitle = null;
            handlePopupContent(
              "Quest Completed",
              quest_data.quest_title,
              quest_data.quest_description,
              true
            );
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
      const npcData = await fetchNpcQuestDialog();
      const filteredQuests = npcData.filter(
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

  const closeSelectedQuestModal = () => {
    setIsQuestModalOpen(false);
  };

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

  const [questSelected, setQuestSelected] = useState(false);
  const [questStarted, setQuestStarted] = useState(false);
  const QuestModal = () => {
    const handleQuestClick = async (quest_id) => {
      let questData = await fetchNpcQuestDialogById(quest_id);
      //   questTitle = questData[0].quest_title;
      //   questFrom = questData[0].npc_name;
      //   questDescription = questData[0].quest_description;
      //   quest_answer = questData[0].quest_answer;

      //   setEditorVal(questData[0].code_template);
      //   setModalTitle(questTitle + " - " + questFrom);
      //   setModalDescription(questDescription);
      //   setQuestSelected(true);
      //   setQuestStarted(false);
    };

    const ViewActiveQuests = () => {
      return (
        <>
          {activeQuests.length > 0 ? (
            activeQuests.map((element) => (
              <p
                className="active-quest-list"
                key={element.id}
                onClick={() => handleQuestClick(element.id)}
              >
                {element.quest_title}
              </p>
            ))
          ) : (
            <>
              <p>No active quests found.</p>
              <button
                onClick={() => {
                  questManager.toggleQuestBox();
                  closeSelectedQuestModal();
                }}
              >
                View Quests
              </button>
            </>
          )}
        </>
      );
    };

    return (
      <div className="quest-modal-container">
        <div className="quest-modal-content-container">
          <button onClick={closeSelectedQuestModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {!questSelected ? (
            <>
              <button
                onClick={() => {
                  fetchActiveQuests();
                }}
                title="refresh"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </button>
              <div className="quest-modal-header">
                <span>{modalTitle}</span>
              </div>
              <div className="quest-modal-content">
                <ViewActiveQuests />
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setQuestSelected(false);
                  setModalTitle("Accepted quests");
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>

              <div className="quest-modal-header">
                <span>{modalTitle}</span>
              </div>
              <div className="quest-modal-content">
                <li>{modalDescription}</li>
                <button
                  onClick={() => {
                    closeSelectedQuestModal();
                    // setSelectedQuest(questTitle);
                    // setSelectedQuestAnswer(quest_answer);
                    setQuestStarted(true);
                  }}
                >
                  {questStarted ? (
                    <span>Ok</span>
                  ) : (
                    <>
                      <span>Start</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {showPopup && (
        <Popup
          header={popupHeader}
          message={popupMessage}
          description={popupDescription}
          onClose={() => setShowPopup(false)}
          positiveStyle={popupPositiveStyle}
        />
      )}
      {isQuestModalOpen ? <QuestModal /> : null}
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

              <ButtonText
                onClick={viewSelectedQuestModal}
                title="Selected quest"
                icon={faQuestionCircle}
                buttonText="Quest"
              />

              {questStarted ? <span>{selectedQuest}</span> : ""}
            </div>
            <div>
              <ButtonText
                onClick={() => {
                  quest_data && submitPlayerAnswer(quest_data.quest_answer);
                }}
                disabled={loading}
                title="Submit answer"
                icon={faCheck}
                buttonText="Submit"
              />
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
            style={{ width: editorWidth }}
          />
          <div className="java-output-message">
            Output:
            <br />
            {loading ? "Executing..." : output}
          </div>
        </>
      </div>
    </>
  );
};

export default CodeEditor;
