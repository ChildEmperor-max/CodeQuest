import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faUser,
  faTasks,
  faPen,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchCompletedQuestCount,
  updateCharacterBio,
} from "../../db/HandleTable";
import CloseButtonModal from "../../components/CloseButtonModal";
import AlertModal from "../../components/AlertModal";
import { fetchAchievements, fetchCharacterById } from "../../db/HandleTable";
import AchievementBadge from "../../components/AchievementBadge";
import EditUsernameModal from "./EditUsernameModal";
import AchievementProfile from "./AchievementProfile";

const CharacterProfile = ({ onClose }) => {
  const [characterData, setCharacterData] = useState(undefined);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [userName, setUserName] = useState("");
  const [currentBio, setCurrentBio] = useState("");
  const [bioInputValue, setBioInputValue] = useState(currentBio);
  const [completedAchievementsData, setCompletedAchievementsData] = useState(
    []
  );
  const [displayedAchievements, setDisplayedAchievements] = useState([]);
  const [isHovered, setIsHovered] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState("");
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [bioLetterCount, setBioLetterCount] = useState(currentBio.length);
  const [maxBioLetterCount, setMaxBioLetterCount] = useState(60);

  useEffect(() => {
    viewCompletedQuests()
      .then((questData) => {
        setCompletedQuests(questData);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, []);

  useEffect(() => {
    const playerId = JSON.parse(localStorage.getItem("playerId"));
    fetchCharacterById(playerId)
      .then((result) => {
        setCharacterData(result[0]);
        setUserName(result[0].character_name);
        setCurrentBio(result[0].character_bio);
      })
      .catch((err) => {
        console.log("[FETCH CHARACTER ERROR]", err);
      });

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
      const playerId = JSON.parse(localStorage.getItem("playerId"));
      const questData = await fetchCompletedQuestCount(playerId);
      return questData;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
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

  const editProfile = ({ profile }) => {
    setIsEditing(true);
    setEditingProfile(profile);
  };

  const EditProfileButton = ({ onClickEvent = null }) => {
    return (
      <div className="profile-edit-button-container">
        {isEditing ? (
          <>
            <button
              className="profile-edit-button"
              title="Save"
              onClick={submitEditedProfile}
            >
              <FontAwesomeIcon icon={faCheck} size="xs" />
            </button>
          </>
        ) : (
          <button
            className="profile-edit-button"
            title="Edit"
            onClick={onClickEvent}
          >
            <FontAwesomeIcon icon={faPen} size="xs" />
          </button>
        )}
      </div>
    );
  };

  const submitEditedProfile = () => {
    setIsEditing(false);
    editingProfile === "bio" && setIsSavingBio(true);
  };

  const closeEditedProfileModal = () => {
    setIsEditing(false);
    setEditingProfile("");
  };

  const SideNavButton = ({ name, icon, onClickEvent = null }) => {
    return (
      <button onClick={onClickEvent} className="side-nav-buttons">
        <FontAwesomeIcon icon={icon} className="side-icon" />
        <p>{name}</p>
      </button>
    );
  };

  const handleBioInput = (event) => {
    setBioInputValue(event.target.value);
    setBioLetterCount(event.target.value.length);
  };

  const saveBioInput = () => {
    setCurrentBio(bioInputValue);
  };

  const [selectedBadge, setSelectedBadge] = useState(null);
  const updateDisplayedAchievement = (newBadge) => {
    displayedAchievements[selectedBadge] = newBadge;
    setEditingProfile("");
  };

  const selectThisBadge = (index) => {
    setEditingProfile("badge-display");
    setSelectedBadge(index);
  };

  return (
    <>
      {editingProfile === "badge-display" && (
        <div className="pick-badge-display-container">
          <div className="pick-badge-display-header">
            <CloseButtonModal
              onClose={() => {
                setEditingProfile("");
              }}
            />
            <h3>Choose an Achievement to display</h3>
          </div>
          <div className="pick-badge-display-content">
            {completedAchievementsData.map((achievement, index) => (
              <div className="profile-displayed-badge" key={achievement.id}>
                <AchievementBadge
                  name={achievement.name}
                  description={achievement.description}
                  status={achievement.status}
                  date_achieved={
                    achievement.date_achieved
                      ? new Date(achievement.date_achieved).toLocaleDateString(
                          "en-US"
                        )
                      : null
                  }
                  index={index}
                  large={false}
                  flipOnHover={false}
                  onClickEvent={() => {
                    updateDisplayedAchievement(achievement);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {isSavingBio ? (
        bioLetterCount <= maxBioLetterCount ? (
          <AlertModal
            message={`Are you sure about your new bio? ${bioInputValue}`}
            onConfirm={() => {
              const playerId = JSON.parse(localStorage.getItem("playerId"));
              updateCharacterBio(playerId, bioInputValue)
                .then(() => {
                  setEditingProfile("");
                  saveBioInput();
                  setIsSavingBio(false);
                })
                .catch((err) => {
                  console.log("[ERROR SAVING BIO]", err);
                });
            }}
            onCancel={() => {
              setEditingProfile("");
              setIsSavingBio(false);
              setBioInputValue(currentBio);
              setBioLetterCount(currentBio.length);
            }}
          />
        ) : (
          <AlertModal
            message="Please keep your bio letters not exceed the maximum limit."
            onOk={() => {
              setEditingProfile("");
              setIsSavingBio(false);
              setBioInputValue(currentBio);
              setBioLetterCount(currentBio.length);
            }}
          />
        )
      ) : null}

      {editingProfile === "username" ? (
        <EditUsernameModal
          currentUsername={userName}
          setUserName={setUserName}
          closeModal={closeEditedProfileModal}
        />
      ) : null}
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
          {currentTab === 1 ? (
            <>
              <div className="profile-header-container">
                <CloseButtonModal onClose={onClose} />
                <div className="profile-header">
                  <p>Profile</p>
                </div>
              </div>
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
                    <EditProfileButton
                      onClickEvent={() => editProfile({ profile: "avatar" })}
                    />
                  )}
                </div>
                <div className="text-container">
                  <div
                    className="character-username-container"
                    onMouseEnter={() => setIsHovered("username-hover")}
                    onMouseLeave={() => setIsHovered("")}
                  >
                    <div id="character-username">
                      <h3>
                        {userName}
                        {isHovered === "username-hover" && (
                          <EditProfileButton
                            onClickEvent={() =>
                              editProfile({ profile: "username" })
                            }
                          />
                        )}
                      </h3>
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
                      {isHovered === "bio-hover" || editingProfile === "bio" ? (
                        <EditProfileButton
                          onClickEvent={() => editProfile({ profile: "bio" })}
                        />
                      ) : null}
                    </div>
                  </div>
                  {editingProfile === "bio" ? (
                    <>
                      <span
                        className={`bio-input-count ${
                          bioLetterCount >= maxBioLetterCount ? "red-text" : ""
                        } `}
                      >
                        {bioLetterCount}/{maxBioLetterCount}
                      </span>
                      <textarea
                        defaultValue={currentBio}
                        className="bio-content typing"
                        onChange={handleBioInput}
                      />
                    </>
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
                      <div className="profile-displayed-badge" key={index}>
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
                          onClickEvent={() => {
                            selectThisBadge(index);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {currentTab === 2 ? (
            <AchievementProfile
              completedAchievementsData={completedAchievementsData}
              onClose={onClose}
            />
          ) : null}

          {currentTab === 3 ? (
            <>
              <div className="profile-header-container">
                <CloseButtonModal onClose={onClose} />
                <div className="profile-header">
                  <p>Completed quests</p>
                </div>
              </div>
              <div id="completed-quests-tab">
                <div className="text-container">
                  <div className="content-header">
                    Completed quests:{" "}
                    {completedQuests[0] ? completedQuests[0].total_count : 0}
                  </div>
                  {completedQuests[0]
                    ? completedQuests.map((quest, index) => (
                        <div key={index}>
                          <p className="horizontal-long-rectangle">
                            {quest.quest_title}
                          </p>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default CharacterProfile;
