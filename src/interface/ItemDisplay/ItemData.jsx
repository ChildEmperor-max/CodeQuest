import React, { useEffect } from "react";

const ItemData = ({ item, onClose }) => {
  useEffect(() => {
    console.log("Viewing Item: ", item);
  }, []);

  return (
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
          <button>Use</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ItemData;
