import React, { useEffect, useState } from "react";
import { fetchAchievements } from "./db/HandleTable";
import CloseButtonModal from "./components/CloseButtonModal";
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

  const AchievementBadge = ({
    name,
    description,
    status,
    date_achieved,
    index,
  }) => {
    return (
      <div className="achieve-badge-container">
        <div className="date-achieved-tooltip-container animate__animated animate__fadeInUp">
          <div className="date-achieved-tooltip">
            {date_achieved ? (
              <p>
                Date achieved: <br />
                {date_achieved}
              </p>
            ) : null}
          </div>
        </div>
        <div className="achieve-content-badge-front">
          <div className="flipper">
            <img
              className={`badge-img-front ${
                status === "locked" ? "locked" : "unlocked"
              }`}
              src="src/assets/icons/test-icon1.png"
            />
          </div>
          <p id="badge-name">{name}</p>
        </div>
        <div className="achieve-content-badge-back">
          <div className="flipper">
            <div
              className={`badge-img-back ${
                status === "locked" ? "locked" : "unlocked"
              }`}
            >
              <p id="badge-description">{description}</p>
            </div>
          </div>
        </div>
      </div>
    );
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
          <AchievementBadge
            key={achievement.id}
            name={achievement.name}
            description={achievement.description}
            status={achievement.status}
            date_achieved={achievement.date_achieved}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
