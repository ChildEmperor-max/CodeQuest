import { useState, useEffect } from "react";
import ManageQuest from "../../db/ManageQuest";

const usePlayerQuests = () => {
  const manageQuest = new ManageQuest();
  const [questsData, setQuestsData] = useState([]);
  const [unlockedQuestsData, setUnlockedQuestsData] = useState([]);
  const [activeQuestsData, setActiveQuestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerQuests = async () => {
      try {
        const quests = await manageQuest.getPlayerQuests();
        setQuestsData(quests);

        const unlockedQuests = quests.filter((item) => {
          return (
            item.quest_status !== "locked" && item.quest_status !== "completed"
          );
        });

        const activeQuests = quests.filter((item) => {
          return item.quest_status === "active";
        });
        setUnlockedQuestsData(unlockedQuests);
        setActiveQuestsData(activeQuests);
      } catch (error) {
        console.error("Error fetching player quests: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerQuests();
  }, []);

  return { questsData, unlockedQuestsData, activeQuestsData, loading, error };
};

export default usePlayerQuests;
