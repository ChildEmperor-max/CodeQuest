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

import { executeJavaCode, fetchNpcQuestDialog } from "../../db/HandleTable";
import ButtonText from "./ButtonText";
import PanelButton from "./PanelButton";
import ManageQuest from "../../db/ManageQuest";
import { disableKeyListeners, enableKeyListeners } from "../../lib/KeyControls";
import Popup from "../Popups/Popup";
import ActiveQuestsModal from "./ActiveQuestsModal";

const CodeEditor = ({ quest_data, onClose }) => {
  const [editorValue, setEditorValue] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [darkMode, setDarkMode] = useState(false);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [activeQuests, setActiveQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDescription, setPopupDescription] = useState(null);
  const [popupPositiveStyle, setPopupPositiveStyle] = useState(true);

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
          if (quest_data.id === 3) {
            console.log("chosen username: ", response.output);
          }

          if (
            playerAnswer.toLowerCase().includes(correctAnswer.toLowerCase())
          ) {
            manageQuest.updateQuestStatus(
              quest_data.id,
              manageQuest.status.completed
            );
            fetchActiveQuests();
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
      <div className="alby-interface">
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

                <ButtonText
                  onClick={viewSelectedQuestModal}
                  title="Selected quest"
                  icon={faQuestionCircle}
                  buttonText="Quest"
                />

                {quest_data ? <span>{selectedQuest}</span> : ""}
              </div>
              <div>
                <ButtonText
                  onClick={() => {
                    quest_data && submitPlayerAnswer(quest_data.quest_answer);
                  }}
                  disabled={loading || !quest_data}
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
