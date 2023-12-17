import React, { useState, useEffect } from "react";

const AchievementModal = ({ achievementName, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const timeout = 5000;
  // this should be the exact duration of the closing animation
  const closeAnimationTimeout = 1000;

  const handleClose = () => {
    setIsOpen(false);
    const timer = setTimeout(() => {
      onClose();
    }, closeAnimationTimeout);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);
  return (
    <div
      className={`achievement-modal-container ${isOpen ? "open" : "close"}`}
      style={{ top: isOpen ? "10%" : "-10%" }}
    >
      <div className="achivement-modal-content">
        <p className="achievement-text-title">New achievement</p>
        <p className="achievement-text-name">{achievementName}</p>
      </div>
    </div>
  );
};

export default AchievementModal;
