import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faSpinner,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CloseButtonModal from "../../components/CloseButtonModal";

const EditUsernameModal = ({ currentUsername, setUserName, closeModal }) => {
  const [usernameInputValue, setUsernameInputValue] = useState(currentUsername);
  const [savedNewUsername, setSavedNewUsername] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (savedNewUsername) {
      console.log("Username saved:", usernameInputValue);
      setLoading(false);
      //   setTimeout(() => {
      //     closeModal();
      //   }, 3000);
    }
  }, [savedNewUsername]);

  const handleInputChange = (event) => {
    setUsernameInputValue(event.target.value);
    setSavedNewUsername(false);
  };

  const handleSaveUsername = () => {
    setLoading(true); // Start loading
    setUserName(usernameInputValue);
    setSavedNewUsername(true);
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
