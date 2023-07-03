import React from "react";

const AchievementBadge = ({
  name,
  description,
  status,
  date_achieved,
  index,
  large,
  flipOnHover,
}) => {
  return (
    <div className="achieve-badge-container">
      <div className="date-achieved-tooltip-container">
        <div className="date-achieved-tooltip">
          {date_achieved ? (
            <p className="date-tooltip-text">
              Date achieved:
              {date_achieved}
            </p>
          ) : null}
        </div>
      </div>
      <div className="achieve-content-badge-front">
        <div className={`${flipOnHover ? "flipper" : ""}`}>
          <img
            className={`badge-img-front ${large ? "" : "small"}  ${
              status === "locked" ? "locked" : "unlocked"
            }`}
            src="src/assets/icons/test-icon1.png"
          />
        </div>
        <p id="badge-name">{name}</p>
      </div>
      <div className="achieve-content-badge-back">
        <div className={`${flipOnHover ? "flipper" : ""}`}>
          <div
            className={`badge-img-back ${large ? "" : "small"} ${
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

export default AchievementBadge;
