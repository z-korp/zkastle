import React, { useMemo } from "react";
import "./FlipCard.css";
import { Card } from "@/dojo/game/types/card";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Side } from "@/dojo/game/types/side";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Resource } from "../Resource";
import { Discard } from "@/ui/actions/Discard";
import { Flip } from "@/ui/actions/Flip";
import { Rotate } from "@/ui/actions/Rotate";
import { Badge } from "@/ui/elements/badge";
import { Store } from "@/ui/actions/Store";
import { Action, ActionType } from "@/dojo/game/types/action";
import { Cost } from "../Cost";
import { useGameStore } from "@/stores/game";
import { CARD_WIDTH, CARD_HEIGHT } from "@/ui/constants";

interface FlipCardProps {
  data: { card: Card; side: Side; id: number };
  isFlipped: boolean;
  first?: boolean;
  greyed?: boolean;
  actionable?: boolean;
  noButton?: boolean;
  noBg?: boolean;
  stored?: boolean;
  height?: string;
  width?: string;
  scale?: string;
  bgDescription?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  data,
  isFlipped,
  first = false,
  greyed = false,
  actionable = false,
  noButton = false,
  noBg = false,
  stored = false,
  bgDescription = "",
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
      setUpgradeToShow(card, new Side(side.update(new Action(action))));
    }
  };

  return (
    <div
      className={`flip-card relative`}
      style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}
    >
      <div
        className={`flip-card-inner relative w-full h-full text-center transition-transform duration-800 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        <div className="bg-cover bg-center flip-card-front absolute flex flex-col justify-center w-full h-full rounded-2xl overflow-clip border border-slate-900 bg-slate-200 backface-hidden">
          {greyed && (
            <div
              className={`absolute h-full w-full bg-black opacity-20 z-50`}
            />
          )}
          {!noBg && (
            <div
              className={`absolute h-full w-full bg-cover bg-center opacity-50 z-0`}
              style={{ backgroundImage: `url('${card.getImage()}')` }}
            />
          )}
          <div className="absolute top-0 right-0 px-6 py-3">
            <p className="font-bold text-black">{label}</p>
          </div>

          {!!score && (
            <div className="absolute top-0 left-0 p-3 flex gap-1 items-center">
              <p className="font-bold text-black">{score}</p>
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            </div>
          )}

          <div className={`absolute bottom-1/2 left-1/2 -translate-x-1/2 z-10`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${stored && "opacity-50"}`}>
                    <Resource resource={resource} />
                  </div>
                </TooltipTrigger>
                {stored && (
                  <TooltipContent className="">Already stored</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col justify-between h-full pt-8 pb-4">
            <Badge className="flex mx-auto text z-10">{card.value}</Badge>
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
              {!noButton &&
                card.isAllowed(side, new Action(ActionType.Rotate)) && (
                  <div className="flex gap-2 items-center">
                    <div
                      onMouseEnter={() => onMouseEnter(ActionType.Rotate)}
                      onMouseLeave={() => resetUpgradeToShow()}
                    >
                      <Rotate
                        newSide={
                          new Side(side.update(new Action(ActionType.Rotate)))
                        }
                        choice={first}
                        enabled={actionable}
                        costs={card.getCost(
                          side,
                          new Action(ActionType.Rotate),
                        )}
                      />
                    </div>

                    <Cost
                      resources={card.getCost(
                        side,
                        new Action(ActionType.Rotate),
                      )}
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
              {!noButton &&
                card.isAllowed(side, new Action(ActionType.Flip)) && (
                  <div className="flex gap-2 items-center">
                    <div
                      onMouseEnter={() => onMouseEnter(ActionType.Flip)}
                      onMouseLeave={() => resetUpgradeToShow()}
                    >
                      <Flip
                        newSide={
                          new Side(side.update(new Action(ActionType.Flip)))
                        }
                        choice={first}
                        enabled={actionable}
                        costs={card.getCost(side, new Action(ActionType.Flip))}
                      />
                    </div>
                    <Cost
                      resources={card.getCost(
                        side,
                        new Action(ActionType.Flip),
                      )}
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
        <div
          style={{
            backgroundImage: `url('/assets/backside-bg.png')`,
          }}
          className="bg-cover bg-center flip-card-back absolute flex flex-col justify-center w-full h-full shadow-md  text-white border border-coral rounded-xl backface-hidden"
        >
          <p className="text-2xl text-white z-10">{bgDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
