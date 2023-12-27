import React from "react";
import usePopupWithTimeout from "../../hooks/usePopupWithTimeout";

const ItemBoughtPopup = ({ item, onClose }) => {
  const { isOpen, handleClose } = usePopupWithTimeout(onClose);

  return (
    <div className={`item-bought-popup-container ${isOpen ? "open" : "close"}`}>
      <div className="center-content">
        <h3>Successfully bought:</h3>
        <div className="image-container">
          <img src={item.itemImage} alt="ItemImage" />
        </div>
        <h4>{item.itemName}</h4>
        <p>{item.itemDescription}</p>
        <button onClick={handleClose}>Okay</button>
      </div>
    </div>
  );
};

export default ItemBoughtPopup;
