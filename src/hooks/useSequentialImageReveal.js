import { useState, useEffect, useCallback } from "react";

export function useSequentialImageReveal(listKey) {
  const [unlockedCount, setUnlockedCount] = useState(1);

  useEffect(() => {
    setUnlockedCount(1);
  }, [listKey]);

  const handleSettled = useCallback((index) => {
    setUnlockedCount((prev) => (index + 1 > prev ? index + 1 : prev));
  }, []);

  const isUnlocked = useCallback((index) => index < unlockedCount, [unlockedCount]);

  return { isUnlocked, handleSettled };
}
