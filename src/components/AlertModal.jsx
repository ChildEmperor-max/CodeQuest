import React from "react";

const AlertModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="alert-modal-container">
      <div className="alert-modal-message">{message}</div>
      <div className="alert-modal-buttons">
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default AlertModal;
