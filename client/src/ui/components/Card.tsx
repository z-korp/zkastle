import { Badge } from "@/ui/elements/badge";
import { Card as CardClass } from "@/dojo/game/types/card";
import { Discard } from "../actions/Discard";
import { Store } from "../actions/Store";
import { Flip } from "../actions/Flip";
import { Rotate } from "../actions/Rotate";

export const Card = ({ card }: { card: CardClass }) => {
  if (!card) return null;

  return (
    <div className="relative h-80 w-52 rounded-2xl overflow-clip">
      <div
        className="absolute h-full w-full bg-cover bg-no-repeat bg-center opacity-50 z-0"
        style={{ backgroundImage: `url('${card.getImage()}')` }}
      />
      <div className="flex flex-col justify-between h-full pt-8 pb-4">
        <Badge className="flex mx-auto text-xl z-10">{card.value}</Badge>
        <div className="flex flex-col gap-2 items-center z-10">
          <Discard />
          <Store />
          <Rotate />
          <Flip />
        </div>
      </div>
    </div>
  );
};
