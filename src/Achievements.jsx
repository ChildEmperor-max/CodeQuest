import React, { useEffect, useState } from "react";
import { fetchAchievements } from "./db/HandleTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "animate.css";

const Achievements = ({ onClose }) => {
  const [achievementsData, setAchievementsData] = useState([]);
  const [flippedStates, setFlippedStates] = useState([]);

  useEffect(() => {
    viewAchievements()
      .then((data) => {
        setAchievementsData(data);
        setFlippedStates(Array(data.length).fill(false)); // Initialize flippedStates array
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, []);

  const viewAchievements = async () => {
    try {
      const achievementsData = await fetchAchievements();
      return achievementsData;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  // const flipBadge = (index) => {
  //   const newFlippedStates = Array(flippedStates.length).fill(false);
  //   newFlippedStates[index] = true;
  //   setFlippedStates(newFlippedStates);
  //   console.log(newFlippedStates);
  // };

  const flipBadge = (index) => {
    setFlippedStates((prevFlippedStates) => {
      const newFlippedStates = [...prevFlippedStates];
      newFlippedStates[index] = !newFlippedStates[index];
      console.log(newFlippedStates);
      return newFlippedStates;
    });
  };

  const AchievementBadge = ({ name, description, index }) => {
    return (
      <div className="achieve-badge-container">
        <div className={`${flippedStates[index] ? "flipper" : ""}`}>
          <div className="achieve-content-badge-front">
            <img
              className="badge-img"
              src="src/assets/icons/test-icon1.png"
              onClick={() => flipBadge(index)}
            />
            <p>{name}</p>
          </div>
          <div className="achieve-content-badge-back">
            <img
              className="badge-img"
              src="src/assets/icons/test-icon1.png"
              onClick={() => flipBadge(index)}
            />
            <p>{description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="achievements-container">
      <div>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
      </div>
      <div className="achieve-header">
        <h2>Achievements</h2>
      </div>
      <div className="achieve-content">
        {achievementsData.map((achievement, index) => (
          <AchievementBadge
            key={achievement.id}
            name={achievement.name}
            description={achievement.description}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
