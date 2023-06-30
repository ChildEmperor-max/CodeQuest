import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrophy, faUser, faTasks } from "@fortawesome/free-solid-svg-icons";
import {
  fetchCompletedQuests,
  fetchCompletedQuestCount,
} from "./db/HandleTable";

const CharacterProfile = ({ onClose }) => {
  const [completedQuestCount, setCompletedQuestCount] = useState(0);

  useEffect(() => {
    viewCompletedQuests()
      .then((questData) => {
        setCompletedQuestCount(questData[0].count);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, []);

  const viewCompletedQuests = async () => {
    try {
      const questData = await fetchCompletedQuestCount();
      return questData;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error; // Re-throw the error to be caught in the outer catch block if necessary
    }
  };

  const viewProfile = () => {
    console.log("profile");
  }

  const viewCharAchievement = () => {
    console.log("profile achievement");
  }

  const SideNavButton = ({name, icon, onClickEvent = null}) => {
    return (
      <button onClick={onClickEvent} className="side-nav-buttons">
        <div>
          <FontAwesomeIcon icon={icon} />
        </div>
        <span>{name}</span>
      </button>
    )
  }

  return (
    <div className="character-profile-container">
      <div className="left-side">
        <SideNavButton name="Profile" icon={faUser} onClickEvent={viewProfile} />
        <SideNavButton name="Achievements" icon={faTrophy} onClickEvent={viewCharAchievement} />
        <SideNavButton name="Completed Quests" icon={faTasks} onClickEvent={viewProfile} />
      </div>
      <div className="right-side">
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
        <div className="right-side-text-container">
        <img
          src="/src/assets/icons/default-avatar.png"
          id="avatar"
          alt="Avatar"
        />
        <div className="left-side-text-container">
          <p id="character-username">Lorem ipsum</p>
          <p>Level: 1</p>
          <p>Rank: unranked</p>
          <p>Exp: 0/20</p>
        </div>
          <div className="text-container">
            <div className="content-header">Bio</div>
            <div id="bio-content">
              <p>Lorem ipsum dolor sit amet consectetu, adipisicing elit.</p>
            </div>
          </div>
          <div className="text-container">
            <div className="content-header">
              <FontAwesomeIcon icon={faTrophy} color="gold" />
              Achivements
            </div>
          </div>
          <div className="text-container">
            <div className="content-header">
              Completed quests: {completedQuestCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
