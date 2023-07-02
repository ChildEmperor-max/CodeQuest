import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faUser,
  faTasks,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchCompletedQuests,
  fetchCompletedQuestCount,
} from "./db/HandleTable";
import CloseButtonModal from "./components/CloseButtonModal";

const CharacterProfile = ({ onClose }) => {
  const [completedQuestCount, setCompletedQuestCount] = useState(0);
  const [currentTab, setCurrentTab] = useState(1);
  const [userName, setUserName] = useState("Lorem Ipsum");
  const [currentBio, setCurrentBio] = useState(
    "Lorem ipsum dolor sit amet consectetu, adipisicing elit."
  );
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    // var characters = " abcdefghijklmnopqrstuvwxyz";
    // var nums = "0123456789";
    // var str = "hello world12";
    // var delay = 500;

    // for (var i = 0; i < str.length; i++) {
    //   for (var j = 0; j < characters.length; j++) {
    //     if (str.charAt(i) === characters.charAt(j)) {
    //       setTimeout(
    //         function (char) {
    //           console.log(char);
    //         },
    //         i * delay,
    //         str.charAt(i)
    //       );
    //       break;
    //     }
    //   }

    //   for (var k = 0; k < nums.length; k++) {
    //     if (str.charAt(i) === nums.charAt(k)) {
    //       setTimeout(
    //         function (char) {
    //           console.log(char);
    //         },
    //         i * delay,
    //         str.charAt(i)
    //       );
    //       break;
    //     }
    //   }
    // }

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
    const revealDelay = 1600;

    useEffect(() => {
      const interval = setInterval(
        generateRandomText,
        Math.floor(Math.random() * (400 - 100 + 1)) + 100
      ); // Adjust the interval duration as needed
      return () => clearInterval(interval);
    }, []);

    const generateRandomText = () => {
      const characters = "01";
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

    const Element = elementType;
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

  const editBio = () => {
    setIsEditingBio(true);
    console.log("editing bio");
  };

  const editAvatar = () => {
    console.log("editing avatar");
  };

  const editUsername = () => {
    console.log("editing username");
  };

  const EditProfileButton = ({ onClickEvent = null }) => {
    return (
      <button
        className="profile-edit-button"
        title="Edit"
        onClick={onClickEvent}
      >
        <FontAwesomeIcon icon={faPen} size="xs" />
      </button>
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
        <CloseButtonModal onClose={onClose} />
        <div className="right-side-text-container">
          {currentTab === 1 ? (
            <div id="profile-tab">
              <div id="avatar-container">
                <img
                  src="/src/assets/icons/default-avatar.png"
                  id="avatar"
                  alt="Avatar"
                />
                <EditProfileButton onClickEvent={editAvatar} />
              </div>
              <div className="text-container">
                <div className="character-username-container">
                  <div id="character-username">
                    <EditProfileButton onClickEvent={editUsername} />
                    <RandomTextAnimation text={userName} elementType="h3" />
                  </div>
                </div>
                <div className="content-header-container">
                  <div className="content-header">
                    Bio
                    <EditProfileButton onClickEvent={editBio} />
                  </div>
                </div>
                {isEditingBio ? (
                  <textarea defaultValue={currentBio} className="bio-content" />
                ) : (
                  <div className="bio-content">
                    <RandomTextAnimation text={currentBio} elementType="p" />
                  </div>
                )}
                <div className="profile-info-container">
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
