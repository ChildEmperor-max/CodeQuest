import "./ItemDisplay.css";
import React, { useEffect } from "react";
import usePlayerInventory from "../../hooks/player/usePlayerInventory";
import usePlayerCharacter from "../../hooks/player/usePlayerCharacter";
import InventoryItem from "./InventoryItem";

const ItemDisplay = ({ setShowItemData }) => {
  const {
    inventoryData,
    loading: isLoadingInventory,
    error: isInventoryError,
  } = usePlayerInventory();
  const {
    characterData,
    loading: isLoadingCharacter,
    error: isCharacterError,
  } = usePlayerCharacter();

  useEffect(() => {
    console.log(inventoryData);
  }, [inventoryData]);

  return (
    <>
      {isLoadingInventory ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="right-horizontal-container">
            <div className="gold-display-container">
              Gold: <span className="gold-icon"></span>
              {!isLoadingCharacter ? characterData[0].gold : null}
            </div>
            <div className="item-container-header">Consumables</div>
            <div className="items-container">
              {inventoryData.length > 0 ? (
                <>
                  {inventoryData.map((item, index) => (
                    <div
                      className="items"
                      key={index}
                      onClick={() => setShowItemData(item)}
                    >
                      <InventoryItem item={item} index={index} />
                    </div>
                  ))}
                </>
              ) : (
                <p>no items</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ItemDisplay;
