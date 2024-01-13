import React, { useState } from "react";

const QuestChoicesModal = ({ message, quests, onConfirm, onCancel }) => {
  const [selectedQuest, setSelectedQuest] = useState(null);

  const handleQuestSelected = (quest) => {
    onConfirm(quest);
  };
  return (
    <>
      <div className="system-alert-container">
        <div className="choices-modal-container center-position">
          <div>{message}</div>
          <div className="inner-box">
            {quests.map((quest, index) => (
              <p onClick={() => setSelectedQuest(quest)} key={index}>
                {quest.quest_title}
              </p>
            ))}
          </div>
          <div className="alert-modal-buttons">
            {selectedQuest && (
              <button onClick={() => handleQuestSelected(selectedQuest)}>
                Select
              </button>
            )}
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestChoicesModal;
