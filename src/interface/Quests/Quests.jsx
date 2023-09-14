import React, { useState, useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import { fetchQuestTable, fetchNpcQuestDialog } from "../../db/HandleTable";
import toggleEditor from "../../Editor";
import ManageQuest from "../../db/ManageQuest";
import AlertModal from "../../components/AlertModal";

const Quests = ({ onClose }) => {
  const manageQuest = new ManageQuest();
  const [questsData, setQuestsData] = useState([]);
  const [abandonQuestAlert, setAbandonQuestAlert] = useState(false);
  const [currentQuestId, setCurrentQuestId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

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

  const handleQuestAbandon = () => {
    toggleEditor({
      quest_id: null,
      quest_title: null,
      quest_description: null,
      quest_from: null,
      code_template: null,
      quest_answer: null,
      setVisible: false,
    });
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
              onClick={() =>
                toggleEditor({
                  quest_id: quest.id,
                  quest_title: quest.quest_title,
                  quest_description: quest.quest_description,
                  quest_from: quest.npc_name,
                  code_template: quest.code_template,
                  quest_answer: quest.quest_answer,
                })
              }
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
