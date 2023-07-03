import React, { useEffect, useState } from "react";
import { fetchAchievements } from "./db/HandleTable";
import CloseButtonModal from "./components/CloseButtonModal";
import AchievementBadge from "./components/AchievementBadge";
import "animate.css";

const Achievements = ({ onClose }) => {
  const [achievementsData, setAchievementsData] = useState([]);

  useEffect(() => {
    viewAchievements()
      .then((data) => {
        setAchievementsData(data);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, []);

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
        {achievementsData.map((achievement, index) => (
          <div className="achievement-wrapper" key={achievement.id}>
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
              large={true}
              flipOnHover={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
