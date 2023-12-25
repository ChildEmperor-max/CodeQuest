import React, { useEffect, useState } from "react";
import { fetchAchievements, fetchAchievementById } from "../../db/HandleTable";
import CloseButtonModal from "../../components/CloseButtonModal";
import AchievementBadge from "../../components/AchievementBadge";
import "animate.css";
import usePlayerCharacter from "../../hooks/player/usePlayerCharacter";

const Achievements = ({ onClose }) => {
  const { characterData, loading, error } = usePlayerCharacter();
  const [achievementsData, setAchievementsData] = useState([]);
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    if (!loading && !error) {
      console.log(characterData);
      viewCompletedAchievements(characterData[0].achievements)
        .then((result) => {
          setUnlocked(result);
          viewAchievements()
            .then((nonFiltered) => {
              let remainingAchievement = nonFiltered.filter(
                (o1) => !result.some((o2) => o1.id === o2.id)
              );
              setAchievementsData(remainingAchievement);
            })
            .catch((error) => {
              console.log("Achievements.jsx: ", error);
            });
        })
        .catch((error) => {
          console.log("Achievements.jsx: ", error);
        });
    }
  }, [loading]);

  const viewCompletedAchievements = async (achievements) => {
    try {
      let achievementArray = Object.keys(achievements);
      const data = await Promise.all(
        achievementArray.map(async (achievementId) => {
          try {
            const result = await fetchAchievementById(achievementId);
            return {
              ...result[0],
              date_achieved: achievements[achievementId],
            };
          } catch (error) {
            console.log("Achievements.jsx: " + error);
            return null;
          }
        })
      );
      return data.flat().filter((result) => result !== null);
    } catch (error) {
      console.error("Achievements.jsx: ", error);
      throw error;
    }
  };

  const viewAchievements = async () => {
    try {
      const achievementsData = await fetchAchievements();
      return achievementsData;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  return (
    <div className="achievements-container">
      <div className="achieve-header-container">
        <CloseButtonModal onClose={onClose} />
        <div className="achieve-header">
          <h2>Achievements</h2>
        </div>
      </div>
      <div className="achieve-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {unlocked.length > 0 && (
              <>
                {unlocked.map((achievement, index) => (
                  <div className="achievement-wrapper" key={achievement.id}>
                    <AchievementBadge
                      name={achievement.name}
                      description={achievement.description}
                      status="unlocked"
                      date_achieved={
                        achievement.date_achieved
                          ? new Date(
                              achievement.date_achieved
                            ).toLocaleDateString("en-US")
                          : null
                      }
                      index={index}
                      large={true}
                      flipOnHover={true}
                    />
                  </div>
                ))}
              </>
            )}

            {achievementsData.length > 0 && (
              <>
                {achievementsData.map((achievement, index) => (
                  <div className="achievement-wrapper" key={achievement.id}>
                    <AchievementBadge
                      name={achievement.name}
                      description={achievement.description}
                      status="locked"
                      date_achieved={
                        achievement.date_achieved
                          ? new Date(
                              achievement.date_achieved
                            ).toLocaleDateString("en-US")
                          : null
                      }
                      index={index}
                      large={true}
                      flipOnHover={true}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Achievements;
