import React, { useEffect, useState } from "react";
import ChoicesModal from "../../components/ChoicesModal";

const ItemData = ({ item, onClose }) => {
  const [showQuestChoices, setShowQuestChoices] = useState(false);
  const closeChoicesModal = () => {
    setShowQuestChoices(false);
  };
  useEffect(() => {
    console.log("Viewing Item: ", item);
  }, []);

  return (
    <>
      {showQuestChoices && (
        <ChoicesModal
          message="Choose a quest to view its hint:"
          onConfirm={closeChoicesModal}
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
            {/* <button onClick={() => setShowQuestChoices(true)}>Use</button> */}
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemData;
