import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const DialogButton = ({ text, event }) => {
  return (
    <button className="npc-dialog-button" onClick={event}>
      {text === "Next" ? (
        <FontAwesomeIcon icon={faChevronRight} size="lg" />
      ) : (
        text
      )}
    </button>
  );
};

export default DialogButton;
