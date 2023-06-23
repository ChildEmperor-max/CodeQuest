import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
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

import { executeJavaCode } from "./db/HandleTable";
import { enableKeyListeners, disableKeyListeners } from "./lib/KeyControls";

const handleEditorChange = (newValue) => {
  editorValue = newValue;
};

const handleOutput = (res) => {
  output = res;
};

function Editor({ onChange, visible, onOutput }) {
  useEffect(() => {
    ace.config.set("basePath", "/node_modules/ace-builds/src");
  }, []);

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [fontSize, setFontSize] = useState(14);
  const [darkMode, setDarkMode] = useState(false);
  const [editorWidth, setEditorWidth] = useState("600px");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  let editorTheme = darkMode ? "twilight" : "github";

  const executeCode = () => {
    setLoading(true);
    executeJavaCode({ code: editorValue, quest: questTitle })
      .then((response) => {
        if (response.error) {
          setOutput(response.error);
        } else {
          setOutput(response.output);
        }
      })
      .catch((error) => {
        setOutput("Error executing Java code: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitPlayerAnswer = () => {
    console.log("submit quest answer: ", editorValue, "\n", "output: ", output, "quest: ", questTitle);
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

  const viewSelectedQuestModal = () => {
    setIsModalOpen(true);
    setModalTitle(questTitle);
    // setModalDescription(description);
  }

  const closeSelectedQuestModal = () => {
    setIsModalOpen(false);
  };

  const ButtonText = ({
    onClick,
    disabled = false,
    title,
    icon,
    buttonText,
  }) => {
    return (
      <div className="button-text-container">
        <button
          className="panel-buttons"
          onClick={onClick}
          disabled={disabled}
          title={title}
        >
          <FontAwesomeIcon icon={icon} />
        </button>
        <span className="button-text">{buttonText}</span>
      </div>
    );
  };

  return (
    <div id="ace-editor-panel">
      {visible ? (
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
                  <button
                    className="panel-buttons"
                    onClick={increaseFontSize}
                    title="Increase font size"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button
                    className="panel-buttons"
                    onClick={decreaseFontSize}
                    title="Decrease font size"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
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
                icon={faTasks}
                buttonText={questTitle}
              />
            </div>
            <div>
              <ButtonText
                onClick={submitPlayerAnswer}
                disabled={loading}
                title="Submit answer"
                icon={faCheck}
                buttonText="Submit"
              />
              <ButtonText
                onClick={() => toggleEditor({quest_title:null})}
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
            onChange={onChange}
            fontSize={fontSize}
            name="ace-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
            }}
            style={{ width: editorWidth }}
          />
          <div className="java-output-message">
            Output:
            <br />
            {loading ? "Executing..." : output}
          </div>
        </>
      ) : null}
    </div>
  );
}

let visible = false;
let editorValue = "";
let questTitle = null;
let output = "output here"; // Initialize with empty string

const root = ReactDOM.createRoot(document.getElementById("editor"));
root.render(
  <Editor
    onChange={handleEditorChange}
    visible={visible}
    onOutput={handleOutput}
  />
);

export default function toggleEditor({quest_title = null, setVisible = true}) {
  if (quest_title) {
    questTitle = quest_title;
  }
  visible = !visible;
  if (!setVisible) {
    visible = false;
  }
  if (visible) {
    disableKeyListeners();
  } else {
    enableKeyListeners();
  }
  editorValue = "";
  root.render(
    <Editor
      onChange={handleEditorChange}
      visible={visible}
      onOutput={handleOutput()}
    />
  );
}

// function submitQuest() {
//   executeJavaCode({ code: editorValue, quest: questTitle })
//     .then((response) => {
//       if (response.error) {
//         handleOutput(response.error);
//         root.render(
//           <Editor
//             onChange={handleEditorChange}
//             visible={visible}
//             onOutput={response.error}
//           />
//         );
//         output = response.error;
//       } else {
//         handleOutput(response.output);
//         root.render(
//           <Editor
//             onChange={handleEditorChange}
//             visible={visible}
//             onOutput={response.output}
//           />
//         );
//         output = response.output;
//       }
//     })
//     .catch((error) => {
//       setError = "Error executing Java code: " + error.message;
//     });
// }
