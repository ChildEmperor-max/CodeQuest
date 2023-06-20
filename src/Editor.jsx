import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import ace from "ace-builds";

import Quests from "./db/quests";

const handleEditorChange = (newValue) => {
  console.log("Editor change:", newValue);
  editorValue = newValue;
};

function Editor({ onChange, visible }) {
  useEffect(() => {
    ace.config.set("basePath", "/node_modules/ace-builds/src");
  }, []);

  return (
    <div id="ace-editor-panel">
      {visible ? (
        <AceEditor
          id="editor"
          mode="java"
          theme="github"
          onChange={onChange}
          name="ace-editor"
          editorProps={{ $blockScrolling: true }}
        />
      ) : null}
    </div>
  );
}
let visible = false;
let editorValue = "";
let questTitle = null;
const root = ReactDOM.createRoot(document.getElementById("editor"));
root.render(<Editor onChange={handleEditorChange} visible={visible} />);

var cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel";
cancelButton.addEventListener("click", () => {
  toggleEditor(null);
});

var submitButton = document.createElement("button");
submitButton.textContent = "Submit";
submitButton.addEventListener("click", submitQuest);

var quests = new Quests();

export default function toggleEditor(quest_title, setVisible = true) {
  questTitle = quest_title;
  visible = !visible;
  if (!setVisible) {
    visible = false;
  }
  editorValue = "";
  var editorContainer = document.getElementById("editor");
  root.render(<Editor onChange={handleEditorChange} visible={visible} />);
  if (visible) {
    editorContainer.appendChild(submitButton);
    editorContainer.appendChild(cancelButton);
  } else {
    try {
      editorContainer.removeChild(cancelButton);
      editorContainer.removeChild(submitButton);
    } catch (Exception) {
      console.log("wew");
    }
  }
}

function submitQuest() {
  quests.submitPlayerAnswer(questTitle, editorValue);
}
