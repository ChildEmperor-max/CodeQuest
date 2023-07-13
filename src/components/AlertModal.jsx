import React, { useState } from "react";

const AlertModal = ({
  message,
  onConfirm = null,
  onCancel = null,
  onOk = null,
}) => {
  return (
    <div className="alert-modal-container">
      <div className="alert-modal-message">{message}</div>
      <div className="alert-modal-buttons">
        {!onOk ? (
          <>
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>No</button>
          </>
        ) : (
          <button onClick={onOk}>Ok</button>
        )}
      </div>
    </div>
  );
};

export default AlertModal;
