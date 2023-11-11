import React, { createContext, useContext, useState } from "react";

const QuestsDataContext = createContext();

export const QuestsDataProvider = ({ children }) => {
  const [questsData, setQuestsData] = useState([]);
  const [availableQuests, setAvailableQuests] = useState([]);

  const updateQuestsData = (newData) => {
    setQuestsData(newData);
  };

  const updateAvailableQuests = (newData) => {
    const unlockedQuests = newData.filter((item) => {
      return (
        item.quest_status !== "locked" && item.quest_status !== "completed"
      );
    });
    setAvailableQuests(unlockedQuests);
  };

  return (
    <QuestsDataContext.Provider
      value={{
        questsData,
        availableQuests,
        updateQuestsData,
        updateAvailableQuests,
      }}
    >
      {children}
    </QuestsDataContext.Provider>
  );
};

export const useQuestsData = () => {
  const context = useContext(QuestsDataContext);

  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }

  return context;
};
