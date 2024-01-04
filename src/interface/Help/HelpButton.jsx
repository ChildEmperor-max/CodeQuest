import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const HelpButton = ({ onToggle }) => {
  const [showReminder, setShowReminder] = useState(true);
  const timeout = 2000;
  // this should be the exact duration of the closing animation
  const closeAnimationTimeout = 1000;

  const handleClose = () => {
    const timer = setTimeout(() => {
      setShowReminder(false);
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
