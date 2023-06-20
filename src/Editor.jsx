import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import ace from "ace-builds";

import { executeJavaCode } from "./db/HandleTable";

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

  const executeCode = () => {
    setLoading(true);
    executeJavaCode({ code: editorValue, quest: questTitle })
      .then((response) => {
        if (response.error) {
          setOutput(response.error);
        } else {
          setOutput(response.output);
          console.log(response.output);
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
    console.log("submit quest answer: ", editorValue, "\n", "output: ", output);
  };

  const closePanelButton = (
    <button onClick={() => toggleEditor(null)} disabled={loading}>
      Close
    </button>
  );

  const runButton = (
    <button onClick={executeCode} disabled={loading}>
      {loading ? "Executing..." : "Run"}
    </button>
  );

  const submitAnswerButton = (
    <button onClick={submitPlayerAnswer} disabled={loading}>
      Submit
    </button>
  );

  return (
    <div id="ace-editor-panel">
      {visible ? (
        <>
          <div id="editor-panel-buttons">
            {runButton}
            {submitAnswerButton}
            {closePanelButton}
          </div>
          <AceEditor
            id="editor"
            mode="java"
            theme="github"
            onChange={onChange}
            name="ace-editor"
            editorProps={{ $blockScrolling: true }}
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

export default function toggleEditor(quest_title, setVisible = true) {
  questTitle = quest_title;
  visible = !visible;
  if (!setVisible) {
    visible = false;
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
