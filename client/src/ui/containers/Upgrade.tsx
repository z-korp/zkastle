import { useGameStore } from "@/stores/game";
import { Card } from "../components/Card";

export const Upgrade = () => {
  const { upgradeToShow } = useGameStore();

  if (!upgradeToShow) return null;

  return (
    <div className="flex items-center gap-4 absolute -bottom-10 left-1/2 transform -translate-x-1/2 scale-[0.6] md:scale-[0.7]">
      <Card
        data={{
          card: upgradeToShow.card,
          side: upgradeToShow.side,
          id: 0,
        }}
      />
    </div>
  );
};
