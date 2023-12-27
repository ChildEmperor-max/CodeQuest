import "./Shop.css";
import DoubleXP from "../../assets/items/double-xp.png";
import ScrollHint from "../../assets/items/scroll.png";
import PseudoCode from "../../assets/items/pseudo-code.png";
import React, { useState, useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import AlertModal from "../../components/AlertModal";
import { usePlayerContext } from "../../components/PlayerContext";
import usePlayerCharacter from "../../hooks/player/usePlayerCharacter";
import { OPERATION, updateGold } from "../../lib/ItemsManager";
import { updateCharacterInventory } from "../../db/HandleTable";
import ShopItem from "./ShopItem";
import ItemBoughtPopup from "./ItemBoughtPopup";

const Shop = ({ onClose }) => {
  const { setCharacterData } = usePlayerContext();
  const { characterData, loading, error } = usePlayerCharacter();
  const [itemToBuy, setItemToBuy] = useState(null);
  const [buyError, setBuyError] = useState(null);
  const [currentGold, setCurrentGold] = useState("-");
  const [itemBought, setItemBought] = useState(null);

  useEffect(() => {
    if (!loading && !error) {
      setCurrentGold(characterData[0].gold);
    }
  }, [loading]);

  const handleBuyItem = (
    itemName,
    itemPrice,
    itemId,
    itemImage,
    itemDescription
  ) => {
    setItemToBuy({
      itemName: itemName,
      itemPrice: itemPrice,
      itemId: itemId,
      itemImage: itemImage,
      itemDescription: itemDescription,
    });
  };

  const confirmBuyItem = (item) => {
    console.log(item);
    try {
      const itemPrice = parseInt(item.itemPrice);
      if (currentGold >= itemPrice) {
        setCurrentGold((prev) => prev - itemPrice);
        updateCharacterInventory(characterData[0].player_id, item.itemId, 1)
          .then(() => {
            setItemBought(item);
            setCharacterData((prevData) => {
              const newInventoryItem = {
                itemId: item.itemId,
                itemName: item.itemName,
                itemPrice: itemPrice,
                itemCount:
                  (prevData.inventory[item.itemId]?.itemCount || 0) + 1,
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
          })
          .catch((error) => {
            console.log("Shop.jsx: ", error);
          });

        setItemToBuy(null);
        updateGold(itemPrice, OPERATION.MINUS);
      } else {
        setItemToBuy(null);
        setBuyError({ message: "Not enough gold" });
      }
    } catch (err) {
      console.log("Error buying the item: ", err);
      setItemToBuy(null);
      setBuyError({ message: "Sorry, something wen't wrong" });
    }
  };

  return (
    <>
      {itemBought ? (
        <ItemBoughtPopup
          item={itemBought}
          onClose={() => setItemBought(null)}
        />
      ) : null}
      <div className="shop-main-container">
        {buyError ? (
          <AlertModal
            message={buyError.message}
            onOk={() => setBuyError(null)}
          />
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
          <ShopItem
            handleBuyItem={handleBuyItem}
            itemImage={ScrollHint}
            itemName="Hints"
            itemDescription="Gives a hint on how to complete a quest"
            itemPrice="2"
            itemId={1}
          />
          <ShopItem
            handleBuyItem={handleBuyItem}
            itemImage={DoubleXP}
            itemName="Double xp"
            itemDescription="Doubles your xp gain"
            itemPrice="2"
            itemId={2}
          />
          <ShopItem
            handleBuyItem={handleBuyItem}
            itemImage={PseudoCode}
            itemName="Pseudo Code"
            itemDescription="Provides a pseudo code for a quest"
            itemPrice="2"
            itemId={3}
          />
        </div>
      </div>
    </>
  );
};

export default Shop;
