import "./ItemDisplay.css";
import React, { useEffect, useState } from "react";
import usePlayerInventory from "../../hooks/player/usePlayerInventory";
import InventoryItem from "./InventoryItem";

const ItemDisplay = ({ showItemData, setShowItemData }) => {
  const { inventoryData, loading, error } = usePlayerInventory();
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="item-main-container">
          <div className="item-container-header">Consumables</div>
          {inventoryData.length > 0 && (
            <>
              {inventoryData.map((item, index) => (
                <div className="items-container" key={item.item_id}>
                  <div
                    className="items"
                    index={index}
                    onClick={() => setShowItemData(item)}
                  >
                    <InventoryItem item={item} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ItemDisplay;
