import React, { useEffect } from "react";
import "./CodeCipherScroll.css";

const CodeCipherScroll = ({ quest, onClose }) => {
  useEffect(() => {
    console.log("Quest Hint for: ", quest);
  }, []);

  return (
    <>
      <div className="quest-hint-container">
        <button onClick={onClose}>Close</button>
        <p className="quest-hint-title">{quest.quest_title}</p>
        <p>{quest.hint}</p>
        <p>
          Note: Remember this hint because you won't be able to see this hint
          again once you close it unless you have another item.
        </p>
      </div>
    </>
  );
};

export default CodeCipherScroll;
