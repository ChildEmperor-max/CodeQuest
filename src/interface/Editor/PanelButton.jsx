import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PanelButton = ({ icon, onClick, title }) => {
  return (
    <button className="panel-buttons" onClick={onClick} title={title}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default PanelButton;
