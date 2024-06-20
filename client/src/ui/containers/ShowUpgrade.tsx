import { useGameStore } from "@/stores/game";
import { motion, AnimatePresence } from "framer-motion";
import FlipCard from "../components/FlipCard/FlipCard";

interface ShowUpradeProps {
  coords: { x: number; y: number };
}

export const ShowUprade: React.FC<ShowUpradeProps> = ({ coords }) => {
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
          className="absolute z-50"
        >
          <FlipCard
            data={{
              card: upgradeToShow.card,
              side: upgradeToShow.side,
              id: 0,
            }}
            isFlipped={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
