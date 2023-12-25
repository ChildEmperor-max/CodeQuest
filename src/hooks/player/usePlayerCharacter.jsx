import { useState, useEffect } from "react";
import { fetchCharacterById } from "../../db/HandleTable";

const usePlayerCharacter = () => {
  const [characterData, setCharacterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const playerId = localStorage.getItem("playerId");
        const data = await fetchCharacterById(playerId);
        setCharacterData(data);
      } catch (error) {
        console.error("Error fetching player character: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, []);

  return { characterData, loading, error };
};

export default usePlayerCharacter;
