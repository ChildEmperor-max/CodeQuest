import { useState, useEffect } from "react";
import { fetchCharacterItems } from "../../db/HandleTable";

const usePlayerInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const playerId = localStorage.getItem("playerId");
        const data = await fetchCharacterItems(playerId);
        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching inventory: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return { inventoryData, loading, error };
};

export default usePlayerInventory;
