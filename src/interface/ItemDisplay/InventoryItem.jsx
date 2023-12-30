import React from "react";

const InventoryItem = ({ item }) => (
  <>
    <span className="tooltip">
      <span className="tooltiptext">{item.item_name}</span>
    </span>
    <span>{item.item_count} </span>
    <img src={item.item_iconPath} alt={item.item_name} />
  </>
);

export default InventoryItem;
