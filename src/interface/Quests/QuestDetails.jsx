import React, { useState, useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import QuestSideButton from "./QuestSideButton";

const QuestDetails = ({ quest, isEditorOpen, onStart, onAbandon, onClose }) => {
  return (
    <div className={`quest-details ${isEditorOpen ? "on-editor" : ""} `}>
      <div className="quest-details-header">
        <CloseButtonModal onClose={onClose} />
      </div>
      <div className="quest-details-content">
        <p className="quest-details-title">{quest.quest_title}</p>
        <p>{quest.quest_description}</p>
        <p>{quest.npc_name}</p>
      </div>
      <div className="quest-details-buttons">
        <QuestSideButton
          quest={quest}
          onStart={onStart}
          onAbandon={onAbandon}
        />
      </div>
    </div>
  );
};

export default QuestDetails;
