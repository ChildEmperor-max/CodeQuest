import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CloseButtonModal = ({ onClose }) => {
  return (
    <button onClick={onClose} title="close" className="close-button-modal">
      <FontAwesomeIcon icon={faTimes} size="2x" />
    </button>
  );
};

export default CloseButtonModal;
