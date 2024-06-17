import { Side } from "@/dojo/game/types/side";
import { Card } from "@/dojo/game/types/card";
import { useCallback, useMemo } from "react";
import { Wheat } from "@/ui/components/Resource";
import { Stone } from "@/ui/components/Resource";
import { Iron } from "@/ui/components/Resource";
import { useGameStore } from "@/stores/game";
import { Packer } from "@/dojo/game/helpers/packer";

export const Slot = ({
  data,
  count,
  index,
}: {
  data: { card: Card; side: Side };
  count: number;
  index: number;
}) => {
  const { card, side } = data;

  const { resources, setResources } = useGameStore();

  const resource = useMemo(() => {
    return card.getResource(side);
  }, [card, side]);

  const selected = useMemo(() => {
    return Packer.unpack(resources, 16, count).includes(index);
  }, [count, index, resources]);

  const handleClick = useCallback(() => {
    // Unpack resources
    const indexes = Packer.unpack(resources, 16, count);
    // If the index is already in the array
    if (indexes.includes(index)) {
      // Remove the index from the array
      setResources(
        Packer.pack(
          indexes.filter((i) => i !== index),
          16,
        ),
      );
    } else {
      // Otherwise, add the index to the array, sort the array, and pack the array
      const sorted = [...indexes.filter((i) => !!i), index].sort(
        (a, b) => b - a,
      );
      setResources(Packer.pack(sorted, 16));
    }
  }, [count, index, resources]);

  return (
    <div
      className={`flex gap-2 justify-between items-center border-2 rounded h-16 w-52 p-4 cursor-pointer ${selected ? "bg-slate-500" : ""}`}
      onClick={handleClick}
    >
      <h2 className="text-xl">{`#${index}`}</h2>
      <div className="flex gap-4 grow justify-center">
        {Array.from({ length: resource.wheat }, (_, i) => (
          <Wheat key={i} height={8} width={8} />
        ))}
        {Array.from({ length: resource.stone }, (_, i) => (
          <Stone key={i} height={8} width={8} />
        ))}
        {Array.from({ length: resource.iron }, (_, i) => (
          <Iron key={i} height={8} width={8} />
        ))}
      </div>
    </div>
  );
};
