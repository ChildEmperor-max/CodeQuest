import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const HelpButton = ({ onToggle }) => {
  const [showReminder, setShowReminder] = useState(true);
  const TIMEOUT = 2000;
  const CLOSE_REMINDER_ANIM_TIMEOUT = 3000;
  const SHOW_INTERVAL = 10_000;

  const handleClose = () => {
    const timer = setTimeout(() => {
      setShowReminder(false);
    }, CLOSE_REMINDER_ANIM_TIMEOUT);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, TIMEOUT);

    const interval = setInterval(() => {
      setShowReminder(true);
      handleClose();
    }, SHOW_INTERVAL);

    // Clear timers and intervals when the component is unmounted
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [TIMEOUT, SHOW_INTERVAL]);

  return (
    <div className="help-button-container">
      <FontAwesomeIcon
        icon={faQuestionCircle}
        size="2xl"
        className="help-button"
        onClick={onToggle}
      />
      <p className={`${showReminder ? "open-reminder" : "close-reminder"}`}>
        Need some help? Click here!
      </p>
    </div>
  );
};

export default HelpButton;
