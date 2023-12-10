import React, { useState, useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import QuestSideButton from "./QuestSideButton";

const QuestDetails = ({
  questData,
  questDetails,
  isEditorOpen,
  onStart = null,
  onAbandon = null,
  onClose,
}) => {
  const [playFlipAnimation, setPlayFlipAnimation] = useState(true);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      // Play initial animation
      setTimeout(() => {
        setIsFirstRender(false);
      }, 800);
    } else {
      // Play fade animation when the quest id changes
      setPlayFlipAnimation(true);
      setTimeout(() => {
        setPlayFlipAnimation(false);
      }, 500);
    }
  }, [questData.id]);

  return (
    <>
      {questData ? (
        <div
          className={`quest-details ${isEditorOpen ? "on-editor" : ""} ${
            isFirstRender && "play-initial-animation"
          }`}
        >
          <div className={`${playFlipAnimation ? "play-fade-animation" : ""}`}>
            <div className="quest-details-header">
              <CloseButtonModal onClose={onClose} />
            </div>
            <div className="quest-details-content">
              <p className="quest-details-title">{questDetails.quest_title}</p>
              <p>{questDetails.quest_description}</p>
              {/* <p>{quest.npc_name}</p> */}
              <div className="quest-reward-section">
                <p>Quest completion reward</p>
                {questDetails.reward.xp && <p>Xp: {questDetails.reward.xp}</p>}
                {questDetails.reward.gold && (
                  <p>Gold: {questDetails.reward.gold}</p>
                )}
              </div>
            </div>
            <div className="quest-details-buttons">
              {onStart && (
                <QuestSideButton
                  questData={questData}
                  questDetails={questDetails}
                  onStart={onStart}
                  onAbandon={onAbandon}
                />
              )}
            </div>
            {/* <div className="quest-details-header">
              <CloseButtonModal onClose={onClose} />
            </div>
            <div className="quest-details-content">
              <p className="quest-details-title">{quest.quest_title}</p>
              <p>{quest.quest_description}</p>
              <p>{quest.npc_name}</p>
              <div className="quest-reward-section">
                <p>Quest completion reward</p>
                {quest.reward.xp && <p>Xp: {quest.reward.xp}</p>}
                {quest.reward.gold && <p>Gold: {quest.reward.gold}</p>}
              </div>
            </div>
            <div className="quest-details-buttons">
              {onStart && (
                <QuestSideButton
                  quest={quest}
                  onStart={onStart}
                  onAbandon={onAbandon}
                />
              )}
            </div> */}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default QuestDetails;
