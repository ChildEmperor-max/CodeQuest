import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ButtonText = ({ onClick, disabled = false, title, icon, buttonText }) => {
  return (
    <div className="button-text-container">
      <button
        className="panel-buttons"
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
      <span className="button-text">{buttonText}</span>
    </div>
  );
};

export default ButtonText;
