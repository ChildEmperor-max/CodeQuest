import React, { useState, useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import { fetchNpcQuestDialog } from "../../db/HandleTable";
import ManageQuest from "../../db/ManageQuest";
import AlertModal from "../../components/AlertModal";
import CodeEditor from "../Editor/CodeEditor";

const Quests = ({ onClose }) => {
  const manageQuest = new ManageQuest();
  const [questsData, setQuestsData] = useState([]);
  const [abandonQuestAlert, setAbandonQuestAlert] = useState(false);
  const [currentQuestId, setCurrentQuestId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  useEffect(() => {
    viewQuests()
      .then((data) => {
        setQuestsData(data);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, []);

  const viewQuests = async () => {
    try {
      const quests = await fetchNpcQuestDialog();
      return quests;
    } catch (error) {
      console.error("Quests.jsx error viewing the quests: ", error);
      throw error;
    }
  };

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

  const SideButton = ({ quest }) => {
    return (
      <>
        {quest.quest_status === "active" ? (
          <>
            {quest.quest_type !== "story" ? (
              <button
                className="quest-side-button"
                onClick={() =>
                  handleAbandonQuestAlert(quest.id, quest.quest_title)
                }
              >
                Abandon
              </button>
            ) : null}
            <button
              className="quest-side-button"
              onClick={() => {
                setSelectedQuest(quest);
                setIsEditorOpen(true);
              }}
            >
              Start
            </button>
          </>
        ) : (
          <button className="quest-side-button">Navigate</button>
        )}
      </>
    );
  };

  return (
    <>
      {isEditorOpen && (
        <CodeEditor quest_data={selectedQuest} onClose={handleEditorOpen} />
      )}
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
      <div id="questBox">
        <div className="top-quest-bar">
          <CloseButtonModal onClose={onClose} />
        </div>
        <div id="StoryQuest">
          <h3>Story Quest</h3>
          <ul id="StoryQuestList">
            {questsData.map((quest, index) =>
              quest.quest_type === "story" ? (
                <li key={index}>
                  {quest.quest_title} <SideButton quest={quest} />
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
              quest.quest_status !== "completed" ? (
                <li key={index}>
                  {quest.quest_title} <SideButton quest={quest} />
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Quests;
