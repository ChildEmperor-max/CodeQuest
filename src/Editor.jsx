import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { hydrateRoot } from "react-dom/client";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import ace from "ace-builds";

const handleEditorChange = (newValue) => {
  console.log("Editor change:", newValue);
};

function Editor({ onChange, visible }) {
  const [editorVisible, setEditorVisible] = useState(false);
  useEffect(() => {
    ace.config.set("basePath", "/node_modules/ace-builds/src");
  }, []);

  // const handleToggleVisibility = () => {
  //   setEditorVisible((prevVisible) => !prevVisible);
  // };

  return (
    <div id="ace-editor-panel">
      {/* {visible && (
        <button onClick={handleToggleVisibility}>
          {editorVisible ? "Close" : "Open"}
        </button>
      )} */}
      {visible ? (
        <AceEditor
          id="editor"
          mode="java"
          theme="github"
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      ) : null}
    </div>
  );
}
let visible = false;
const root = ReactDOM.createRoot(document.getElementById("editor"));
root.render(<Editor onChange={handleEditorChange} visible={visible} />);
var closeButton = document.createElement("button");
closeButton.textContent = "Close";
closeButton.addEventListener("click", toggleEditor);

export default function toggleEditor() {
  visible = !visible;
  var editorContainer = document.getElementById("ace-editor-panel");
  root.render(<Editor onChange={handleEditorChange} visible={visible} />);
  if (visible) {
    editorContainer.appendChild(closeButton);
  } else {
    editorContainer.removeChild(closeButton);
  }
}
