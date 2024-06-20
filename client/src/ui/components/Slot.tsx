import { Side } from "@/dojo/game/types/side";
import { Card } from "@/dojo/game/types/card";
import { useCallback, useMemo } from "react";
import { Wheat } from "@/ui/components/Resource";
import { Stone } from "@/ui/components/Resource";
import { Iron } from "@/ui/components/Resource";
import { useGameStore } from "@/stores/game";
import { Packer } from "@/dojo/game/helpers/packer";
import { CARD_BIT_SIZE } from "@/dojo/game/models/game";
import { Remove } from "../actions/Remove";

export const Slot = ({
  data,
  index,
}: {
  data: { card: Card; side: Side; id: number };
  index: number;
}) => {
  const { card, side, id } = data;

  const { resources, setResources } = useGameStore();

  const resource = useMemo(() => {
    return card.getResource(side);
  }, [card, side]);

  const selected = useMemo(() => {
    return Packer.unpack(BigInt(resources), CARD_BIT_SIZE).includes(id);
  }, [id, resources]);

  const { height, width } = useMemo(() => {
    return { height: "h-8", width: "w-8" };
  }, []);

  const handleClick = useCallback(() => {
    if (id == 0) return;
    // Unpack resources
    const ids = Packer.unpack(BigInt(resources), CARD_BIT_SIZE);
    // If the id is already in the array
    if (ids.includes(id)) {
      // Remove the id from the array
      setResources(
        Packer.pack(
          ids.filter((i) => i !== id),
          CARD_BIT_SIZE,
        ),
      );
    } else {
      // Otherwise, add the id to the array and pack
      setResources(Packer.pack([...ids, id], CARD_BIT_SIZE));
    }
  }, [id, resources]);

  return (
    <div
      className={`flex gap-2 justify-between items-center border-2 rounded h-16 w-60 p-4 ${!!id && "cursor-pointer"} ${selected && "bg-slate-500"}`}
      onClick={handleClick}
    >
      <h2 className="text-xl">{`#${index}`}</h2>
      <div className="flex gap-4 grow justify-center">
        {Array.from({ length: resource.wheat }, (_, i) => (
          <Wheat key={i} height={height} width={width} />
        ))}
        {Array.from({ length: resource.stone }, (_, i) => (
          <Stone key={i} height={height} width={width} />
        ))}
        {Array.from({ length: resource.iron }, (_, i) => (
          <Iron key={i} height={height} width={width} />
        ))}
      </div>
      {!!id && <Remove index={id} />}
    </div>
  );
};
