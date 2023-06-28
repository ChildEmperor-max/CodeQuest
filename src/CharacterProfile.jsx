import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CharacterProfile = ({ onClose }) => {
  return (
    <div className="character-profile-container">
      <div className="left-side">
        <img
          src="/src/assets/icons/default-avatar.png"
          id="avatar"
          alt="Avatar"
        />
        <div className="left-side-text-container">
          <p id="character-username">Lorem ipsum</p>
          <p>Level: 1</p>
        </div>
      </div>
      <div className="right-side">
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
        <div className="right-side-text-container">
          <div className="text-container">
            <div className="content-header">Bio</div>
            <div id="bio-content">
              <p>Lorem ipsum dolor sit amet consectetu, adipisicing elit.</p>
            </div>
          </div>
          <div className="text-container">
            <div className="content-header">Achivements</div>
            <p>lorem</p>
          </div>
          <div className="text-container">
            <div className="content-header">Completed quests</div>
            <p>lorem</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
