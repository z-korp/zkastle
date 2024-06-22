import { useState, useEffect } from "react";

interface Navigator {
  standalone?: boolean;
}

export const isAppPwa = (): boolean => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator).standalone === true
  );
};

function useIsPwa() {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    const checkPwa = () => {
      setIsPwa(isAppPwa());
    };

    checkPwa();

    window.addEventListener("resize", checkPwa);
    return () => {
      window.removeEventListener("resize", checkPwa);
    };
  }, []);

  return isPwa;
}

export default useIsPwa;
