import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import CloseButtonModal from "../../components/CloseButtonModal";
import {
  fetchCharacterByLevelRank,
  fetchCharactersByLevel,
} from "../../db/HandleTable";
import DefaultAvatarImage from "src/assets/icons/default-avatar.png";

const Leaderboard = ({ onClose }) => {
  const [levelRank, setLevelRank] = useState([]);
  const [currentPlayerRank, setCurrentPlayerRank] = useState(null);
  useEffect(() => {
    const playerId = JSON.parse(localStorage.getItem("playerId"));
    fetchCharactersByLevel()
      .then((result) => {
        setLevelRank(result);
      })
      .catch((err) => {
        console.log(err);
      });
    fetchCharacterByLevelRank(playerId)
      .then((result) => {
        setCurrentPlayerRank(result[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const RankList = ({ key, name, level, rank }) => {
    <li key={key} data-rank={rank}>
      <div className="thumb">
        <span className="img" data-name={name}></span>
        <span className="name">{name}</span>
        <span className="stat">
          <b>{level}</b>Level
        </span>
      </div>
    </li>;
  };

  return (
    <div className="leaderboard-main-container">
      <div className="leaderboard-header">
        <CloseButtonModal onClose={onClose} />
        <div>
          <h2>Leaderboard</h2>
        </div>
      </div>
      <div className="leaderboard-content-container">
        {/* <p>𐤀𐤍𐤅 𐤅𐤍𐤈𐤓𐤊, 𐤀 𐤓𐤋𐤈𐤔 𐤊𐤋𐤌𐤍𐤉,</p>
        <p>2</p>
        <p>3</p> */}
        <br />
        <ul className="toplist">
          {levelRank.map((item, index) => (
            <li key={index} data-rank={index + 1}>
              <div className="thumb">
                <span className="img" data-name="avatar">
                  <img
                    src={
                      item.avatar_path ? item.avatar_path : DefaultAvatarImage
                    }
                    onError={(e) => {
                      e.target.src = DefaultAvatarImage;
                    }}
                  />
                </span>
                <span className="name">{item.character_name}</span>
                <span className="stat">
                  <b>{item.level}</b>Level
                </span>
              </div>
              <div className="more">{/* To be designed & implemented */}</div>
            </li>
          ))}
          {currentPlayerRank ? (
            <li
              className="current-rank"
              key={currentPlayerRank.player_id}
              data-rank={parseInt(currentPlayerRank.rank)}
            >
              <div className="thumb">
                <span className="img" data-name="avatar">
                  <img
                    src={
                      currentPlayerRank.avatar_path
                        ? currentPlayerRank.avatar_path
                        : DefaultAvatarImage
                    }
                    onError={(e) => {
                      e.target.src = DefaultAvatarImage;
                    }}
                  />
                </span>
                <span className="name">{currentPlayerRank.character_name}</span>
                <span className="stat">
                  <b>{currentPlayerRank.level}</b>Level
                </span>
              </div>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
