import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function QuestModal({ questTitle, questDescription }) {
  return (
    <div className="quest-modal-container">
      <div className="quest-modal-content-container">
        <button onClick={closeSelectedQuestModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="quest-modal-header">
          <p>{questTitle}</p>
        </div>
        <div className="quest-modal-content">
          <p>{questDescription}</p>
        </div>
      </div>
    </div>
  );
}
