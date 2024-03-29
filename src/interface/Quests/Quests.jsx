import React, { useState, useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import ManageQuest from "../../db/ManageQuest";
import AlertModal from "../../components/AlertModal";
import CodeEditor from "../Editor/CodeEditor";
import QuestDetails from "./QuestDetails";
import QuestSideButton from "./QuestSideButton";
import usePlayerQuests from "../../hooks/player/usePlayerQuests";

const Quests = ({ onClose }) => {
  const manageQuest = new ManageQuest();
  const { questsData, unlockedQuestsData, loading, error } = usePlayerQuests();
  const playerId = localStorage.getItem("playerId");
  const [abandonQuestAlert, setAbandonQuestAlert] = useState(false);
  const [currentQuestId, setCurrentQuestId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const [questDetails, setQuestDetails] = useState(null);

  const handleEditorOpen = () => {
    setIsEditorOpen(!isEditorOpen);
  };

  const handleQuestAbandon = () => {
    manageQuest.abandonQuest(currentQuestId);
    setAbandonQuestAlert(false);
    onClose();
  };

  const handleAbandonQuestAlert = (quest_id, quest_title) => {
    setAbandonQuestAlert(true);
    setAlertMessage(
      `Are you sure you want to abandon the quest: ${quest_title} ?`
    );
    setCurrentQuestId(quest_id);
  };

  const handleStartQuest = (quest) => {
    setSelectedQuest(quest);
    setIsEditorOpen(true);
  };

  return (
    <>
      {abandonQuestAlert && (
        <AlertModal
          message={alertMessage}
          onConfirm={handleQuestAbandon}
          onCancel={() => {
            setAbandonQuestAlert(false);
            setCurrentQuestId(null);
          }}
        />
      )}
      <div className="quest-container">
        {isEditorOpen && (
          <CodeEditor quest_data={selectedQuest} onClose={handleEditorOpen} />
        )}
        <div className="quest-box">
          <div className="top-quest-bar">
            <CloseButtonModal onClose={onClose} />
          </div>
          <div id="StoryQuest">
            <h3>Story Quest</h3>
            <ul id="StoryQuestList">
              {questsData.map((quest, index) =>
                quest.quest_type === "story" &&
                quest.quest_status !== "completed" &&
                quest.quest_status !== "locked" ? (
                  <li key={index} onClick={() => setQuestDetails(quest)}>
                    {quest.quest_title}{" "}
                    <div className="quest-side-button-container">
                      <QuestSideButton
                        quest={quest}
                        onStart={() => handleStartQuest(quest)}
                        onAbandon={() =>
                          handleAbandonQuestAlert(
                            quest.quest_id,
                            quest.quest_title
                          )
                        }
                      />
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          </div>
          <div id="SideQuests">
            <h3>Side Quests</h3>
            <ul id="Available">
              {questsData.map((quest, index) =>
                quest.quest_type === "side" &&
                quest.quest_status !== "completed" &&
                quest.quest_status !== "locked" ? (
                  <li key={index} onClick={() => setQuestDetails(quest)}>
                    {quest.quest_title}{" "}
                    <div className="quest-side-button-container">
                      <QuestSideButton
                        quest={quest}
                        onStart={() => handleStartQuest(quest)}
                        onAbandon={() =>
                          handleAbandonQuestAlert(
                            quest.quest_id,
                            quest.quest_title
                          )
                        }
                      />
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
        {questDetails && (
          <QuestDetails
            quest={questDetails}
            isEditorOpen={isEditorOpen}
            onStart={() => handleStartQuest(questDetails)}
            onAbandon={() =>
              handleAbandonQuestAlert(questDetails.id, questDetails.quest_title)
            }
            onClose={() => setQuestDetails(null)}
          />
        )}
      </div>
    </>
  );
};

export default Quests;
