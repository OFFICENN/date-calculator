import { useState, useEffect } from "react";

const STORAGE_KEY = "date-calculator-username";
const ENV_OWNER_NAME = import.meta.env.VITE_OWNER_NAME as string | undefined;

export function useUserName() {
  const isLocked = !!ENV_OWNER_NAME;
  const [userName, setUserName] = useState<string>(ENV_OWNER_NAME ?? "");

  useEffect(() => {
    if (isLocked) return;

    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get("name");

    if (nameFromUrl) {
      setUserName(nameFromUrl);
      localStorage.setItem(STORAGE_KEY, nameFromUrl);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUserName(stored);
    }
  }, [isLocked]);

  const updateUserName = (name: string) => {
    if (isLocked) return;
    setUserName(name);
    if (name) {
      localStorage.setItem(STORAGE_KEY, name);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return { userName, updateUserName, isLocked };
}
