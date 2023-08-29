import React, { useState, useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import { fetchQuestTable, fetchNpcQuestDialog } from "../../db/HandleTable";
import toggleEditor from "../../Editor";

const Quests = ({ onClose }) => {
  const [questsData, setQuestsData] = useState([]);

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
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  const test = () => {};

  const SideButton = ({ quest }) => {
    return (
      <>
        {quest.quest_status.trim() === "active" ? (
          <>
            <button
              className="quest-side-button"
              onClick={() =>
                toggleEditor({
                  quest_title: null,
                  quest_description: null,
                  quest_from: null,
                  code_template: null,
                  quest_answer: null,
                  setVisible: false,
                })
              }
            >
              Abandon
            </button>
            <button
              className="quest-side-button"
              onClick={() =>
                toggleEditor({
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
    <div id="questBox">
      <div className="top-quest-bar">
        <CloseButtonModal onClose={onClose} />
      </div>
      <div id="StoryQuest">
        <h3>Story Quest</h3>
        <ul id="StoryQuestList">
          {questsData.map((quest, index) =>
            quest.quest_type.trim() === "story" &&
            quest.quest_status.trim() === "active" ? (
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
            quest.quest_type.trim() === "side" ? (
              <li key={index}>
                {quest.quest_title} <SideButton quest={quest} />
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
};

export default Quests;
