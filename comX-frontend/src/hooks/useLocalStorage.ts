import { useState } from "react";

export const useLocalStorage = (key: string, initialValue: unknown) => {
  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue; 

      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error("Error getting localStorage item:", error);
      return initialValue;
    }
  };

  const [value, setValue] = useState(getItem);

  const setItem = (newValue: unknown) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  };

  return { value, setItem, getItem, removeItem };
};
