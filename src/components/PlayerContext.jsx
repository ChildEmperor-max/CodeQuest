import React, { createContext, useContext, useState } from "react";
import { fetchCharacterById } from "../db/HandleTable";

const PlayerContext = createContext();

export const usePlayerContext = () => {
  return useContext(PlayerContext);
};

export const PlayerProvider = ({ children }) => {
  const [playerId, setPlayerId] = useState(null);
  const [characterData, setCharacterData] = useState(null);

  const login = (playerId) => {
    setPlayerId(playerId);
    fetchCharacterById(playerId)
      .then((result) => {
        setCharacterData(result[0]);
      })
      .catch((err) => {
        console.log("PlayerContext.jsx: fetchCharacterById: ", err);
      });
  };

  const logout = () => {
    setPlayerId(null);
  };

  return (
    <PlayerContext.Provider value={{ playerId, characterData, login, logout }}>
      {children}
    </PlayerContext.Provider>
  );
};
