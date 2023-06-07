import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import ace from "ace-builds";

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
const root = ReactDOM.createRoot(document.getElementById("editor"));
root.render(<Editor onChange={handleEditorChange} visible={visible} />);

var cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel";
cancelButton.addEventListener("click", toggleEditor);

var submitButton = document.createElement("button");
submitButton.textContent = "Submit";
submitButton.addEventListener("click", submitQuest);

export default function toggleEditor(setVisible = true) {
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
  console.log("submitted: ", editorValue);
}
