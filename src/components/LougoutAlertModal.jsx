import React from "react";

const LogoutAlertModal = ({ setIsLogout }) => {
  return (
    <div className="alert-modal-main-container">
      <div className="alert-modal-container">
        <div className="alert-modal-message">
          Are you sure you want to logout?
        </div>
        <div className="alert-modal-buttons">
          <a href="/login">
            <button>Yes</button>
          </a>
          <button onClick={() => setIsLogout(false)}>No</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutAlertModal;
