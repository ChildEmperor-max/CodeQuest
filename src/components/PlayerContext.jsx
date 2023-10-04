import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCharacterById } from "../db/HandleTable";

const PlayerContext = createContext();

export const usePlayerContext = () => {
  return useContext(PlayerContext);
};

export const PlayerProvider = ({ children }) => {
  const [playerId, setPlayerId] = useState(null);
  const [characterData, setCharacterData] = useState(null);

  // Load playerId and characterData from localStorage on component mount
  useEffect(() => {
    const storedPlayerId = localStorage.getItem("playerId");
    const storedCharacterData = JSON.parse(
      localStorage.getItem("characterData")
    );

    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    }

    if (storedCharacterData) {
      setCharacterData(storedCharacterData);
    }
  }, []);

  // Save playerId and characterData to localStorage whenever they change
  useEffect(() => {
    if (playerId) {
      localStorage.setItem("playerId", playerId);
    } else {
      localStorage.removeItem("playerId");
    }

    if (characterData) {
      localStorage.setItem("characterData", JSON.stringify(characterData));
    } else {
      localStorage.removeItem("characterData");
    }
  }, [playerId, characterData]);

  const login = (playerId) => {
    setPlayerId(playerId);
    updateCharacterData(playerId);
  };

  const updateCharacterData = (playerId) => {
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
    setCharacterData(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        playerId,
        characterData,
        login,
        updateCharacterData,
        logout,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
