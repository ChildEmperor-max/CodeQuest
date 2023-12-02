import "./Shop.css";
import DoubleXP from "../../assets/items/double-xp.png";
import ScrollHint from "../../assets/items/scroll.png";
import PseudoCode from "../../assets/items/pseudo-code.png";
import React, { useState, useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import AlertModal from "../../components/AlertModal";
import { usePlayerContext } from "../../components/PlayerContext";

const Shop = ({ onClose }) => {
  const { playerId, characterData, setCharacterData } = usePlayerContext();
  const [itemToBuy, setItemToBuy] = useState(null);
  const [buyError, setBuyError] = useState(null);
  const [currentGold, setCurrentGold] = useState(10);

  const handleBuyItem = (itemName, itemPrice, itemId) => {
    setItemToBuy({ itemName: itemName, itemPrice: itemPrice, itemId: itemId });
  };

  const confirmBuyItem = (item) => {
    if (currentGold >= item.itemPrice) {
      setCurrentGold((prev) => prev - item.itemPrice);
      setCharacterData((prevData) => {
        console.log(prevData);
        const newInventoryItem = {
          itemId: item.itemId,
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          itemCount: (prevData.inventory[item.itemId]?.itemCount || 0) + 1,
        };

        return {
          ...prevData,
          inventory: {
            ...prevData.inventory,
            [item.itemId]: {
              ...prevData.inventory?.[item.itemId],
              ...newInventoryItem,
            },
          },
        };
      });

      setItemToBuy(null);
      console.log(characterData.inventory);
    } else {
      setItemToBuy(null);
      setBuyError({ message: "Not enough gold" });
    }
  };

  const Items = ({
    itemImage,
    itemName,
    itemDescription,
    itemPrice,
    itemId,
  }) => {
    return (
      <div className="item-list">
        <img src={itemImage} />
        <p>{itemName}</p>
        {/* <p>{itemDescription}</p> */}
        <span className="gold-container">
          <span className="gold-icon"></span>
          {itemPrice}
        </span>
        <button onClick={() => handleBuyItem(itemName, itemPrice, itemId)}>
          Buy
        </button>
      </div>
    );
  };

  return (
    <div className="shop-main-container">
      {buyError ? (
        <AlertModal message={buyError.message} onOk={() => setBuyError(null)} />
      ) : null}
      {itemToBuy ? (
        <AlertModal
          message={`Buy ${itemToBuy.itemName} for ${itemToBuy.itemPrice} gold?`}
          onConfirm={() => confirmBuyItem(itemToBuy)}
          onCancel={() => setItemToBuy(null)}
        />
      ) : null}
      <CloseButtonModal onClose={onClose} />
      <div className="shop-header-container">
        <span className="gold-container">
          Gold: <span className="gold-icon"></span>
          {currentGold}
        </span>
        <div className="shop-header">
          <span className="shop-name">Shop</span>
        </div>
      </div>
      <div className="shop-content">
        <Items
          itemImage={ScrollHint}
          itemName="Hints"
          itemDescription="Gives a hint on how to complete a quest"
          itemPrice="2"
          itemId={1}
        />
        <Items
          itemImage={DoubleXP}
          itemName="Double xp"
          itemDescription="Doubles your xp gain"
          itemPrice="2"
          itemId={2}
        />
        <Items
          itemImage={PseudoCode}
          itemName="Pseudo Code"
          itemDescription="Provides a pseudo code for a quest"
          itemPrice="2"
          itemId={3}
        />
      </div>
    </div>
  );
};

export default Shop;
