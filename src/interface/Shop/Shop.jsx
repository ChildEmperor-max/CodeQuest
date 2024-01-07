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
import useItems from "../../hooks/items/useItems";

const Shop = ({ onClose }) => {
  const {
    itemsData,
    loading: loadingItemsData,
    error: errorItemsData,
  } = useItems();
  const { setCharacterData } = usePlayerContext();
  const {
    characterData,
    loading: loadingCharacterData,
    error: errorCharacterData,
  } = usePlayerCharacter();
  const [itemToBuy, setItemToBuy] = useState(null);
  const [buyError, setBuyError] = useState(null);
  const [currentGold, setCurrentGold] = useState("-");
  const [itemBought, setItemBought] = useState(null);

  useEffect(() => {
    if (!loadingCharacterData && !errorCharacterData) {
      setCurrentGold(characterData[0].gold);
    }
    if (!loadingItemsData && !errorItemsData) {
      console.log(itemsData);
    }
  }, [
    loadingCharacterData,
    errorCharacterData,
    loadingItemsData,
    errorItemsData,
  ]);

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
      <div className="shop-main-container">
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
          {itemsData.map((item, index) => (
            <div key={item.item_id}>
              <ShopItem
                handleBuyItem={handleBuyItem}
                itemImage={item.item_iconPath}
                itemName={item.item_name}
                itemDescription={item.item_description}
                itemPrice={item.item_price}
                itemId={item.item_id}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Shop;
