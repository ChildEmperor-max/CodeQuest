import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import CloseButtonModal from "../../components/CloseButtonModal";
import {
  fetchCharacterByLevelRank,
  fetchCharactersByLevel,
} from "../../db/HandleTable";
import RankList from "./RankList";

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
              <RankList item={item} />
            </li>
          ))}
          {currentPlayerRank ? (
            <li
              className="current-rank"
              key={currentPlayerRank.player_id}
              data-rank={parseInt(currentPlayerRank.rank)}
            >
              <RankList item={currentPlayerRank} />
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
