import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faRefresh,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { fetchNpcQuestDialogById } from "../../db/HandleTable";

const ActiveQuestsModal = ({ quest_data, active_quests, onClose }) => {
  const [currentQuest, setCurrentQuest] = useState(
    quest_data ? quest_data : null
  );
  const [modalTitle, setModalTitle] = useState(quest_data.quest_title);
  const [modalDescription, setModalDescription] = useState(
    quest_data.quest_description
  );
  const [questSelected, setQuestSelected] = useState(false);
  const [showQuestList, setShowQuestList] = useState(false);

  const handleQuestClick = async (quest_id) => {
    let questData = await fetchNpcQuestDialogById(quest_id);
    //   questTitle = questData[0].quest_title;
    //   questFrom = questData[0].npc_name;
    //   questDescription = questData[0].quest_description;
    //   quest_answer = questData[0].quest_answer;
    setCurrentQuest(questData);
    setQuestSelected(true);
    setShowQuestList(false);
    // setEditorValue(questData[0].code_template);
    setModalTitle(questData[0].quest_title);
    setModalDescription(questData[0].quest_description);
  };

  const ViewActiveQuests = () => {
    return (
      <>
        {active_quests.length > 0 ? (
          active_quests.map((element) => (
            <p
              className="active-quest-list"
              key={element.id}
              onClick={() => handleQuestClick(element.id)}
            >
              {element.quest_title}
            </p>
          ))
        ) : (
          <>
            <p>No active quests found.</p>
            <button
              onClick={() => {
                onClose();
              }}
            >
              View Quests
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="quest-modal-container">
      <div className="quest-modal-content-container">
        <button onClick={() => onClose()}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {showQuestList ? (
          <>
            <button
              onClick={() => {
                fetchActiveQuests();
              }}
              title="refresh"
            >
              <FontAwesomeIcon icon={faRefresh} />
            </button>
            <div className="quest-modal-header">
              <span>{modalTitle}</span>
            </div>
            <div className="quest-modal-content">
              <ViewActiveQuests />
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setQuestSelected(false);
                setShowQuestList(true);
                setModalTitle("Accepted quests");
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <div className="quest-modal-header">
              <span>{modalTitle}</span>
            </div>
            <div className="quest-modal-content">
              <li>{modalDescription}</li>
              <button
                onClick={() => {
                  onClose();
                }}
              >
                {currentQuest ? (
                  <span>Ok</span>
                ) : (
                  <>
                    <span>Start</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActiveQuestsModal;
