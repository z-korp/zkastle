import { useState, useEffect } from "react";

interface Navigator {
  standalone?: boolean;
}

const useIsPwa = () => {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    const checkPwa = () => {
      const isInPwa =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator).standalone === true;
      setIsPwa(isInPwa);
    };

    checkPwa();

    window.addEventListener("resize", checkPwa);
    return () => {
      window.removeEventListener("resize", checkPwa);
    };
  }, []);

  return isPwa;
};

export default useIsPwa;
