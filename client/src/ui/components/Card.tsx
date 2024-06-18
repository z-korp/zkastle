import { Badge } from "@/ui/elements/badge";
import { Card as CardClass } from "@/dojo/game/types/card";
import { Discard } from "../actions/Discard";
import { Store } from "../actions/Store";
import { Flip } from "../actions/Flip";
import { Rotate } from "../actions/Rotate";
import { Side } from "@/dojo/game/types/side";
import { Action, ActionType } from "@/dojo/game/types/action";
import { useMemo } from "react";
import { Resource } from "./Resource";
import { Cost } from "./Cost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useGameStore } from "@/stores/game";

export const Card = ({
  data,
  first = false,
  actionable = false,
  noButton = false,
  stored = false,
  height = "h-96",
  width = "w-60",
  scale = "scale-100",
}: {
  data: { card: CardClass; side: Side; id: number };
  first?: boolean;
  actionable?: boolean;
  noButton?: boolean;
  stored?: boolean;
  height?: string;
  width?: string;
  scale?: string;
}) => {
  const { card, side } = data;

  const { setUpgradeToShow, resetUpgradeToShow } = useGameStore();

  const label = useMemo(() => side.getName(), [side]);

  const score = useMemo(() => {
    return card.getScore(side);
  }, [card, side]);

  const resource = useMemo(() => card.getResource(side), [card, side]);

  const onMouseEnter = (action: ActionType) => {
    if (actionable) {
      setUpgradeToShow(card, side, new Side(side.update(action)));
    }
  };

  if (!card) return null;

  return (
    <div
      className={`relative ${height} ${width} ${scale} rounded-2xl overflow-clip border border-slate-900 bg-slate-200`}
    >
      <div
        className="absolute h-full w-full bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: `url('${card.getImage()}')` }}
      />

      <div className="absolute top-0 right-0 text-xl px-3 py-2">
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
              <Store
                choice={first}
                enabled={actionable && !stored}
                costs={card.getCost(side, new Action(ActionType.Store))}
              />
              <Cost
                resources={card.getCost(side, new Action(ActionType.Store))}
              />
            </div>
          )}
          {!noButton && card.isAllowed(side, new Action(ActionType.Rotate)) && (
            <div className="flex gap-2 items-center">
              <div
                onMouseEnter={() => onMouseEnter(ActionType.Rotate)}
                onMouseLeave={() => resetUpgradeToShow()}
              >
                <Rotate
                  choice={first}
                  enabled={actionable}
                  costs={card.getCost(side, new Action(ActionType.Rotate))}
                />
              </div>

              <Cost
                resources={card.getCost(side, new Action(ActionType.Rotate))}
              />
              {/*<FontAwesomeIcon
                className="block md:hidden"
                icon={faEye}
                onMouseEnter={() =>
                  onMouseEnter(ActionType.Rotate)
                }
                onMouseLeave={() => resetUpgradeToShow()}
              />*/}
            </div>
          )}
          {!noButton && card.isAllowed(side, new Action(ActionType.Flip)) && (
            <div className="flex gap-2 items-center">
              <div
                onMouseEnter={() => onMouseEnter(ActionType.Flip)}
                onMouseLeave={() => resetUpgradeToShow()}
              >
                <Flip
                  choice={first}
                  enabled={actionable}
                  costs={card.getCost(side, new Action(ActionType.Flip))}
                />
              </div>
              <Cost
                resources={card.getCost(side, new Action(ActionType.Flip))}
              />
            </div>
          )}
          {!noButton &&
            first &&
            card.isAllowed(side, new Action(ActionType.Discard)) && (
              <Discard choice={first} />
            )}
        </div>
      </div>
    </div>
  );
};
