import React, { useState, useEffect } from "react";
import "./Popup.css";

const Popup = ({
  header,
  message,
  description = null,
  onClose,
  positiveStyle = true,
}) => {
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
      className={`popup ${isOpen ? "open" : "close"} ${
        positiveStyle ? "positive" : "negative"
      } `}
    >
      <div className="popup-content">
        <p id="popup-header">{header}</p>
        <p id="popup-message">{message}</p>
        {description && <p id="popup-description">{description}</p>}
        <button onClick={handleClose}>Okay</button>
      </div>
    </div>
  );
};

export default Popup;
