import React, { createContext, useContext, useState } from "react";

const WorldContext = createContext();

export const useWorldContext = () => {
  return useContext(WorldContext);
};

export const WorldProvider = ({ children }) => {
  const [npcs, setNpcs] = useState(null);

  const initializeNpcs = (npcs) => {
    setNpcs(npcs);
  };

  return (
    <WorldContext.Provider value={{ npcs, initializeNpcs }}>
      {children}
    </WorldContext.Provider>
  );
};
