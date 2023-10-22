import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import CloseButtonModal from "../../components/CloseButtonModal";
import AchievementBadge from "../../components/AchievementBadge";

const AchievementProfile = ({ completedAchievementsData, onClose }) => {
  return (
    <>
      <div className="profile-header-container">
        <CloseButtonModal onClose={onClose} />
        <div className="profile-header">
          <p>Achievements</p>
        </div>
      </div>
      <div id="achievements-tab">
        <div className="text-container">
          <div className="content-header">
            <FontAwesomeIcon icon={faTrophy} color="gold" />
            Achievements <span>({completedAchievementsData.length})</span>
          </div>
          <div className="profile-achievements">
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementProfile;
