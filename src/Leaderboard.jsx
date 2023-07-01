import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import CloseButtonModal from "./components/CloseButtonModal";

const Leaderboard = ({ onClose }) => {
  return (
    <div className="leaderboard-main-container">
      <div className="leaderboard-header">
        <CloseButtonModal onClose={onClose} />
        <div>
          <h2>Leaderboard</h2>
        </div>
      </div>
      <div className="leaderboard-content-container">
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </div>
    </div>
  );
};

export default Leaderboard;
