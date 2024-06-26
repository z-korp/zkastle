import { useGameStore } from "@/stores/game";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card/Card";
import { useMediaQuery } from "react-responsive";

interface UpgradeProps {
  coords: { x: number; y: number };
}

export const Upgrade: React.FC<UpgradeProps> = ({ coords }) => {
  const isMdOrLarger = useMediaQuery({ query: "(min-width: 768px)" });

  const { upgradeToShow } = useGameStore();

  if (!upgradeToShow) return null;

  return (
    <AnimatePresence>
      {upgradeToShow && (
        <motion.div
          initial={{
            x: coords.x,
            y: coords.y,
            scale: 0.9, // Start smaller
            opacity: 0, // Start transparent
          }}
          animate={{
            scale: 1, // Scale to normal size
            opacity: 1, // Fade in
          }}
          exit={{
            scale: 0.9, // Scale down
            opacity: 0, // Fade out
          }}
          transition={{ type: "spring", stiffness: 80 }}
          className="absolute z-[2000] rounded-2xl"
        >
          <Card
            data={{
              card: upgradeToShow.card,
              side: upgradeToShow.side,
              id: 0,
            }}
            isFlipped={false}
            style={{
              boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.6)",
              transform: isMdOrLarger ? "scale(1)" : "scale(0.9)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
