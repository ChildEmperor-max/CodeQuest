import React from "react";

const ShopItem = ({
  handleBuyItem,
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
      <button
        onClick={() =>
          handleBuyItem(itemName, itemPrice, itemId, itemImage, itemDescription)
        }
      >
        Buy
      </button>
    </div>
  );
};

export default ShopItem;
