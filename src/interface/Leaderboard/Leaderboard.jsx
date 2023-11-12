import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import CloseButtonModal from "../../components/CloseButtonModal";

const Leaderboard = ({ onClose }) => {
  const data = [
    { rank: 1, name: "Player_1", level: 43 },
    { rank: 2, name: "Player_2", level: 40 },
    { rank: 3, name: "Player_3", level: 30 },
    { rank: 4, name: "Player_4", level: 28 },
    { rank: 5, name: "Player_5", level: 26 },
    { rank: 6, name: "Player_6", level: 25 },
    { rank: 7, name: "Player_7", level: 23 },
    { rank: 8, name: "Player_8", level: 20 },
    { rank: 9, name: "Player_8", level: 15 },
    { rank: 10, name: "Player_10", level: 8 },
    { rank: 25, name: "Player_50", level: 3 },
  ];
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
          {data.map((item) => (
            <li key={item.rank} data-rank={item.rank}>
              <div className="thumb">
                <span className="img" data-name={item.name}></span>
                <span className="name">{item.name}</span>
                <span className="stat">
                  <b>{item.level}</b>Level
                </span>
              </div>
              <div className="more">{/* To be designed & implemented */}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
