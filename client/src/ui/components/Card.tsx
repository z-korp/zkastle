import { Badge } from "@/ui/elements/badge";
import { Card as CardClass } from "@/dojo/game/types/card";
import { Discard } from "../actions/Discard";
import { Store } from "../actions/Store";
import { Flip } from "../actions/Flip";
import { Rotate } from "../actions/Rotate";
import { Side, SideType } from "@/dojo/game/types/side";
import { Action, ActionType } from "@/dojo/game/types/action";
import { useMemo } from "react";
import { Wheat } from "lucide-react";
import { Resource } from "./Resource";
import { Cost } from "./Cost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const Card = ({
  data,
  first,
  actionable,
  stored,
}: {
  data: { card: CardClass; side: Side; id: number };
  first: boolean;
  actionable: boolean;
  stored: boolean;
}) => {
  const { card, side } = data;

  const label = useMemo(() => {
    switch (side.value) {
      case SideType.One:
        return "I";
      case SideType.Two:
        return "II";
      case SideType.Three:
        return "III";
      case SideType.Four:
        return "IV";
      default:
        return "";
    }
  }, [side]);

  const score = useMemo(() => {
    return card.getScore(side);
  }, [card, side]);

  const resource = useMemo(() => card.getResource(side), [card, side]);

  if (!card) return null;

  return (
    <div className="relative h-96 w-60 rounded-2xl overflow-clip bg-white border-2 border-slate-700">
      <div
        className="absolute h-full w-full bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: `url('${card.getImage()}')` }}
      />

      <div className="absolute top-0 right-0 text-xl p-3">
        <p className="text-xl font-bold text-black">{label}</p>
      </div>

      {!!score && (
        <div className="absolute top-0 left-0 text-xl p-3 flex gap-1 items-center">
          <p className="text-xl font-bold text-black">{score}</p>
          <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
        </div>
      )}

      <div
        className={`absolute bottom-1/2 left-1/2 -translate-x-1/2 z-10 ${stored && "opacity-50"}`}
      >
        <Resource resource={resource} />
      </div>

      <div className="flex flex-col justify-between h-full pt-8 pb-4">
        <Badge className="flex mx-auto text-xl z-10">{card.value}</Badge>
        <div className="flex flex-col gap-2 items-start z-10 ml-2">
          {card.isAllowed(side, new Action(ActionType.Store)) && (
            <div className="flex gap-2 items-center">
              <Store choice={first} enabled={actionable && !stored} />
              <Cost
                resources={card.getCost(side, new Action(ActionType.Store))}
              />
            </div>
          )}
          {card.isAllowed(side, new Action(ActionType.Rotate)) && (
            <div className="flex gap-2 items-center">
              <Rotate choice={first} enabled={actionable} />
              <Cost
                resources={card.getCost(side, new Action(ActionType.Rotate))}
              />
            </div>
          )}
          {card.isAllowed(side, new Action(ActionType.Flip)) && (
            <div className="flex gap-2 items-center">
              <Flip choice={first} enabled={actionable} />
              <Cost
                resources={card.getCost(side, new Action(ActionType.Flip))}
              />
            </div>
          )}
          {first && card.isAllowed(side, new Action(ActionType.Discard)) && (
            <Discard choice={first} />
          )}
        </div>
      </div>
    </div>
  );
};
