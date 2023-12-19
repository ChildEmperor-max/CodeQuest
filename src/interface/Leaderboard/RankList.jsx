import React from "react";
import DefaultAvatarImage from "src/assets/icons/default-avatar.png";

const RankList = ({ item }) => {
  return (
    <>
      <div className="thumb">
        <span className="img" data-name="avatar">
          <img
            className="leaderboard-avatar"
            src={item.avatar_path ? item.avatar_path : DefaultAvatarImage}
            onError={(e) => {
              e.target.src = DefaultAvatarImage;
            }}
            alt={`Avatar of ${item.character_name}`}
          />
        </span>
        <span className="name">{item.character_name}</span>
        <span className="stat">
          <b>{item.level}</b>Level
        </span>
      </div>
      <div className="more">{/* To be designed & implemented */}</div>
    </>
  );
};

export default RankList;
