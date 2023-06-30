import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faTrophy,
  faUser,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchCompletedQuests,
  fetchCompletedQuestCount,
} from "./db/HandleTable";

const CharacterProfile = ({ onClose }) => {
  const [completedQuestCount, setCompletedQuestCount] = useState(0);
  const [currentTab, setCurrentTab] = useState(1);

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

  const viewProfileTab = () => {
    setCurrentTab(1);
  };

  const viewAchievementsTab = () => {
    setCurrentTab(2);
  };

  const viewCompletedQuestsTab = () => {
    setCurrentTab(3);
  };

  const RandomTextAnimation = ({ text, elementType = "span" }) => {
    const [randomText, setRandomText] = useState("");
    const [showRealText, setShowRealText] = useState(false);
    const revealDelay = 600;

    useEffect(() => {
      const interval = setInterval(generateRandomText, 80); // Adjust the interval duration as needed
      return () => clearInterval(interval);
    }, []);

    const generateRandomText = () => {
      const characters = "abcdefghijklmnopqrstuvwxyz0123456789 ";
      let randomText = "";
      for (let i = 0; i < text.length; i++) {
        const randomChar =
          characters[Math.floor(Math.random() * characters.length)];
        randomText += randomChar;
      }
      setRandomText(randomText);
    };

    useEffect(() => {
      const revealTimeout = setTimeout(() => {
        setShowRealText(true);
      }, revealDelay);

      return () => clearTimeout(revealTimeout);
    }, [revealDelay]);

    useEffect(() => {
      if (showRealText) {
        setRandomText(text);
      }
    }, [showRealText, text]);

    const Element = elementType; // Dynamically assign the element type

    return (
      <>
        {showRealText ? (
          <Element dangerouslySetInnerHTML={{ __html: text }} />
        ) : (
          <Element
            className={showRealText ? "" : "glitch"}
            style={{ visibility: randomText ? "visible" : "hidden" }}
          >
            {randomText}
          </Element>
        )}
      </>
    );
  };

  const SideNavButton = ({ name, icon, onClickEvent = null }) => {
    return (
      <button onClick={onClickEvent} className="side-nav-buttons">
        <FontAwesomeIcon icon={icon} className="side-icon" />
        <p>{name}</p>
      </button>
    );
  };

  return (
    <div className="character-profile-container">
      <div className="left-side">
        <SideNavButton
          name="Profile"
          icon={faUser}
          onClickEvent={viewProfileTab}
        />
        <SideNavButton
          name="Achievements"
          icon={faTrophy}
          onClickEvent={viewAchievementsTab}
        />
        <SideNavButton
          name="Completed Quests"
          icon={faTasks}
          onClickEvent={viewCompletedQuestsTab}
        />
      </div>
      <div className="right-side">
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
        <div className="right-side-text-container">
          {currentTab === 1 ? (
            <div id="profile-tab">
              <img
                src="/src/assets/icons/default-avatar.png"
                id="avatar"
                alt="Avatar"
              />
              <div className="text-container">
                <div id="character-username">
                  <RandomTextAnimation text="Lorem Ipsum" elementType="h3" />
                </div>
                <div className="content-header">Bio</div>
                <div id="bio-content">
                  <RandomTextAnimation
                    text="Lorem ipsum dolor sit amet consectetu, adipisicing elit."
                    elementType="p"
                  />
                </div>
                <div>
                  <span>Level: </span>
                  <RandomTextAnimation text="1" elementType="span" />
                </div>
                <div>
                  <span>Rank: </span>
                  <RandomTextAnimation text="unranked" elementType="span" />
                </div>
                <div>
                  <span>Exp: </span>
                  <RandomTextAnimation text="0/20" elementType="span" />
                </div>
              </div>
            </div>
          ) : null}
          {currentTab === 2 ? (
            <div id="achievements-tab">
              <div className="text-container">
                <div className="content-header">
                  <FontAwesomeIcon icon={faTrophy} color="gold" />
                  Achivements
                </div>
              </div>
            </div>
          ) : null}

          {currentTab === 3 ? (
            <div id="completed-quests-tab">
              <div className="text-container">
                <div className="content-header">
                  Completed quests: {completedQuestCount}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
