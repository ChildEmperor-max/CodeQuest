import React, { useState, useEffect } from "react";
import { fetchCharacterById } from "../../db/HandleTable";
import DefaultAvatarImage from "src/assets/icons/default-avatar.png";

const ProfileDisplay = ({
  onToggle,
  currentAvatar,
  currentXpBar,
  characterData,
}) => {
  return (
    <div className="horizontal-container">
      <div onClick={onToggle}>
        <img
          src={currentAvatar}
          id="avatar-display"
          alt="Avatar"
          onError={(e) => {
            e.target.src = DefaultAvatarImage;
          }}
        />
      </div>
      <div className="profile-display-container">
        <p className="profile-name">{characterData.character_name}</p>
        <p>Level: {characterData.level}</p>
        <span>XP:</span>
        <div className="xp-bar-background">
          <div
            className="xp-bar"
            style={{
              width: `${currentXpBar}px`,
            }}
          ></div>
          <p>
            {characterData.xp.current_xp}/{characterData.xp.max_xp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
