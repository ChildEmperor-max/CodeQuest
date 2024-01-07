import { useState, useEffect } from "react";
import { fetchAllItems } from "../../db/HandleTable";

const useItems = () => {
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllItems();
        setItemsData(data);
      } catch (error) {
        console.error("useItems.jsx: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { itemsData, loading, error };
};

export default useItems;
