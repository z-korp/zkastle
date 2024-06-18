import { useGameStore } from "@/stores/game";
import { Card } from "../components/Card";

export const Upgrade = () => {
  const { upgradeToShow } = useGameStore();

  if (!upgradeToShow) return null;

  return (
    <div className="flex items-center gap-4 absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4 ">
      <Card
        data={{
          card: upgradeToShow.card,
          side: upgradeToShow.side1,
          id: 0,
        }}
        height="h-72"
        width="w-48"
      />
      <p className="text-3xl">-&gt;</p>
      <Card
        data={{
          card: upgradeToShow.card,
          side: upgradeToShow.side2,
          id: 0,
        }}
        height="h-72"
        width="w-48"
      />
    </div>
  );
};
