import React, { useEffect, useState } from "react";
import QuestChoicesModal from "../../components/QuestChoicesModal";
import usePlayerQuests from "../../hooks/player/usePlayerQuests";
import CodeCipherScroll from "./Items/CodeCipherScroll";
import SystemAlert from "../../components/SystemAlert";

const ItemData = ({ item, onClose }) => {
  const [showQuestChoices, setShowQuestChoices] = useState(false);
  const [isAlert, setIsAlert] = useState(null);
  const {
    activeQuestsData,
    loading: isActiveQuestsLoading,
    error: isActiveQuestsError,
  } = usePlayerQuests();
  const [selectedQuestHint, setSelectedQuestHint] = useState(null);
  const closeChoicesModal = () => {
    setShowQuestChoices(false);
  };

  useEffect(() => {
    console.log("Viewing Item: ", item);
  }, []);

  const handleSelectedQuestHint = (quest) => {
    if (!quest.hint) {
      setIsAlert("No hint is available for this quest");
    } else {
      closeChoicesModal();
      setSelectedQuestHint(quest);
      setIsAlert("Code Cipher Scroll used");
    }
  };

  return (
    <>
      {isAlert && (
        <SystemAlert message={isAlert} onClose={() => setIsAlert(null)} />
      )}
      {selectedQuestHint && (
        <CodeCipherScroll
          quest={selectedQuestHint}
          onClose={() => setSelectedQuestHint(null)}
        />
      )}
      {showQuestChoices && (
        <QuestChoicesModal
          message="Choose a quest to view its hint:"
          quests={activeQuestsData}
          onConfirm={handleSelectedQuestHint}
          onCancel={closeChoicesModal}
        />
      )}
      <div className="item-data-display">
        <div className="item-data-container">
          {item ? (
            <>
              <img src={item.item_iconPath} />
              <p id="item-name">{item.item_name}</p>
              <p id="item-description">{item.item_description}</p>
              <p>You have: {item.item_count} pieces</p>
            </>
          ) : (
            <p>An error occured</p>
          )}
          <div>
            <button onClick={() => setShowQuestChoices(true)}>Use</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemData;
