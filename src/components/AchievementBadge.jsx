import React from "react";
import "animate.css";
import TestBadgeIcon from "src/assets/icons/test-icon1.png";

const AchievementBadge = ({
  name,
  description,
  status,
  date_achieved,
  index,
  large,
  flipOnHover,
  onClickEvent = null,
}) => {
  return (
    <div className="achieve-badge-container" onClick={onClickEvent}>
      <div className="achieve-content-badge-front">
        <div className={`${flipOnHover ? "flipper" : ""}`}>
          <img
            className={`badge-img-front animate__animated animate__flipInX ${
              large ? "" : "small"
            }  ${status === "locked" ? "locked" : "unlocked"}`}
            src={TestBadgeIcon}
          />
        </div>
        <div className="date-achieved-tooltip-container">
          {date_achieved ? (
            <p className="date-tooltip-text">
              Date achieved:
              {date_achieved}
            </p>
          ) : null}
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
