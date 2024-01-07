import React, { useEffect, useState } from "react";

const SystemAlert = ({ message, onClose }) => {
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
    <div className="system-alert-container">
      <div className={`system-alert ${isOpen ? "open" : "close"}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SystemAlert;
