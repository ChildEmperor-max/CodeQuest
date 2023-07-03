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
import { fetchAchievements } from "./db/HandleTable";
import AchievementBadge from "./components/AchievementBadge";

const CharacterProfile = ({ onClose }) => {
  const [completedQuestCount, setCompletedQuestCount] = useState(0);
  const [currentTab, setCurrentTab] = useState(1);
  const [userName, setUserName] = useState("Lorem Ipsum");
  const [currentBio, setCurrentBio] = useState(
    "Lorem ipsum dolor sit amet consectetu, adipisicing elit."
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [completedAchievementsData, setCompletedAchievementsData] = useState(
    []
  );
  const [displayedAchievements, setDisplayedAchievements] = useState([]);
  const [isHovered, setIsHovered] = useState("");

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

  useEffect(() => {
    viewCompletedAchievements()
      .then((data) => {
        setCompletedAchievementsData(data);
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.date_achieved);
          const dateB = new Date(b.date_achieved);
          return dateB - dateA;
        });
        const latestData = sortedData.slice(0, 3); // Get the first three data entries
        setDisplayedAchievements(latestData);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, []);

  const viewCompletedAchievements = async () => {
    try {
      var data = [];
      const achievementsData = await fetchAchievements();
      achievementsData.forEach((element) => {
        if (element.status.trim() === "unlocked") {
          data.push(element);
        }
      });
      return data;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

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
              <div
                id="avatar-container"
                onMouseEnter={() => setIsHovered("avatar-hover")}
                onMouseLeave={() => setIsHovered("")}
              >
                <img
                  src="/src/assets/icons/default-avatar.png"
                  id="avatar"
                  alt="Avatar"
                />
                {isHovered === "avatar-hover" && (
                  <EditProfileButton onClickEvent={editAvatar} />
                )}
              </div>
              <div className="text-container">
                <div
                  className="character-username-container"
                  onMouseEnter={() => setIsHovered("username-hover")}
                  onMouseLeave={() => setIsHovered("")}
                >
                  <div id="character-username">
                    {isHovered === "username-hover" && (
                      <EditProfileButton onClickEvent={editUsername} />
                    )}
                    <h3>{userName}</h3>
                    {/* <RandomTextAnimation text={userName} elementType="h3" /> */}
                  </div>
                </div>
                <div className="content-header-container">
                  <div
                    className="content-header"
                    onMouseEnter={() => setIsHovered("bio-hover")}
                    onMouseLeave={() => setIsHovered("")}
                  >
                    Bio
                    {isHovered === "bio-hover" && (
                      <EditProfileButton onClickEvent={editBio} />
                    )}
                  </div>
                </div>
                {isEditingBio ? (
                  <textarea defaultValue={currentBio} className="bio-content" />
                ) : (
                  <div className="bio-content">
                    {/* <RandomTextAnimation text={currentBio} elementType="p" /> */}
                    <p>{currentBio}</p>
                  </div>
                )}
                <div className="profile-info-container">
                  <div>
                    <span>Level: </span>
                    {/* <RandomTextAnimation text="1" elementType="span" /> */}
                    <span>1</span>
                  </div>
                  <div>
                    <span>Rank: </span>
                    {/* <RandomTextAnimation text="unranked" elementType="span" /> */}
                    <span>unranked</span>
                  </div>
                  <div>
                    <span>Exp: </span>
                    {/* <RandomTextAnimation text="0/20" elementType="span" /> */}
                    <span>0/20</span>
                  </div>
                </div>
                <div className="profile-displayed-achievements">
                  {displayedAchievements.map((achievement, index) => (
                    <div
                      className="profile-displayed-badge"
                      key={achievement.id}
                    >
                      <AchievementBadge
                        name={achievement.name}
                        description={achievement.description}
                        status={achievement.status}
                        date_achieved={
                          achievement.date_achieved
                            ? new Date(
                                achievement.date_achieved
                              ).toLocaleDateString("en-US")
                            : null
                        }
                        index={index}
                        large={false}
                        flipOnHover={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          {currentTab === 2 ? (
            <div id="achievements-tab">
              <div className="text-container">
                <div className="content-header">
                  <FontAwesomeIcon icon={faTrophy} color="gold" />
                  Achievements <span>({completedAchievementsData.length})</span>
                </div>
                <div className="profile-achievements">
                  {completedAchievementsData.map((achievement, index) => (
                    <div
                      className="profile-displayed-badge"
                      key={achievement.id}
                    >
                      <AchievementBadge
                        name={achievement.name}
                        description={achievement.description}
                        status={achievement.status}
                        date_achieved={
                          achievement.date_achieved
                            ? new Date(
                                achievement.date_achieved
                              ).toLocaleDateString("en-US")
                            : null
                        }
                        index={index}
                        large={false}
                        flipOnHover={false}
                      />
                    </div>
                  ))}
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
