import React from "react";

const QuestSideButton = ({ quest, onStart, onAbandon }) => {
  return (
    <>
      {quest.quest_status === "active" ? (
        <>
          {quest.quest_type !== "story" ? (
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
