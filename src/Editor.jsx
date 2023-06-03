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

  const handleToggleVisibility = () => {
    setEditorVisible((prevVisible) => !prevVisible);
    console.log(editorVisible);
  };

  return (
    <div>
      {visible && (
        <button onClick={handleToggleVisibility}>
          {editorVisible ? "Close" : "Open"}
        </button>
      )}
      {visible || editorVisible ? (
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

export default function toggleEditor() {
  visible = !visible;
  root.render(<Editor onChange={handleEditorChange} visible={visible} />);
}
