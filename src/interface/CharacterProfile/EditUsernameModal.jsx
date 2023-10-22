import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faSpinner,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CloseButtonModal from "../../components/CloseButtonModal";
import { updateCharacterNameById } from "../../db/HandleTable";

const EditUsernameModal = ({ currentUsername, setUserName, closeModal }) => {
  const [usernameInputValue, setUsernameInputValue] = useState(currentUsername);
  const [savedNewUsername, setSavedNewUsername] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const handleInputChange = (event) => {
    setUsernameInputValue(event.target.value);
    setSavedNewUsername(false);
  };

  const handleSaveUsername = () => {
    setLoading(true);
    const playerId = JSON.parse(localStorage.getItem("playerId"));
    if (usernameInputValue.length < 4) {
      setUsernameError("Username must be at least 4 characters long.");
      setLoading(false);
    } else {
      const regex = /^[a-zA-Z0-9]+$/;
      if (!regex.test(usernameInputValue)) {
        setUsernameError("Username cannot contain special characters.");
        setLoading(false);
      } else {
        updateCharacterNameById(playerId, usernameInputValue)
          .then(() => {
            setUserName(usernameInputValue);
            setSavedNewUsername(true);
            setLoading(false);
            setUsernameError("");
          })
          .catch((err) => {
            console.log("[SAVE USERNAME ERROR]", err);
            setLoading(false);
          });
      }
    }
  };

  return (
    <div className="edit-profile-modal-container">
      <div className="edit-profile-modal-header">
        <CloseButtonModal onClose={closeModal} />
        <h3>Edit Username</h3>
      </div>
      <div className="edit-profile-modal-content">
        {savedNewUsername ? (
          <span>
            Successfully saved username: {usernameInputValue}
            <FontAwesomeIcon icon={faCheck} />
          </span>
        ) : (
          <input
            type="text"
            value={usernameInputValue}
            onChange={handleInputChange}
          />
        )}
        <p>{usernameError}</p>
      </div>
      <div className="edit-profile-modal-button-container">
        {savedNewUsername ? (
          <button onClick={closeModal}>Okay</button>
        ) : (
          <button onClick={handleSaveUsername} disabled={isLoading}>
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default EditUsernameModal;
