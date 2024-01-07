import React, { useState } from "react";

const ChoicesModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="system-alert-container">
      <div className="center-position">
        <div>{message}</div>
        <div className="inner-box">
          <p>test</p>
          <p>test</p>
          <p>test</p>
        </div>
        <div className="alert-modal-buttons">
          <button onClick={onConfirm}>Select</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChoicesModal;
