import React from "react";

const QuestSideButton = ({ questData, onStart, onAbandon }) => {
  return (
    <>
      {questData.quest_status === "active" ? (
        <>
          {questData.quest_type !== "story" ? (
            <button className="quest-side-button" onClick={onAbandon}>
              Abandon
            </button>
          ) : null}
          <button className="quest-side-button" onClick={onStart}>
            Start
          </button>
        </>
      ) : (
        <button className="quest-side-button">Navigate</button>
      )}
    </>
  );
};

export default QuestSideButton;
