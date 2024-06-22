import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/ui/elements/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/ui/elements/drawer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/ui/elements/pagination";
import { Button } from "@/ui/elements/button";
import { Side, SideType } from "@/dojo/game/types/side";
import { Card as CardClass } from "@/dojo/game/types/card";
import { Game } from "@/dojo/game/models/game";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { Achievement, AchievementType } from "@/dojo/game/types/achievement";
import Card from "../components/Card/Card";
import { Select } from "../actions/Select";
import { Enable } from "../actions/Enable";

export const Achievements = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const isMdOrLarger = useMediaQuery({ query: "(min-width: 768px)" });
  const groups = useMemo(() => Game.getAchievements(), []);
  const selectable = useMemo(() => {
    return player && player.has(new Achievement(AchievementType.OracleStone));
  }, [player]);

  return (
    <Drawer handleOnly={true}>
      <DrawerTrigger asChild>
        <Button variant="outline">Achievements</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-sm md:max-w-full m-auto pb-4">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl">
              Achievements
            </DrawerTitle>
          </DrawerHeader>

          <Carousel
            className="w-full"
            orientation={"horizontal"}
            opts={{ dragFree: isMdOrLarger }}
          >
            <CarouselContent className="flex items-end">
              {groups.map((group, index) => (
                <CarouselItem
                  key={index}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
                >
                  <Canvas
                    items={group}
                    has={
                      player && group.length > 0
                        ? player.has(group[0].achievement)
                        : false
                    }
                    selectable={!!selectable}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const Canvas = ({
  items,
  has,
  selectable,
}: {
  items: { achievement: Achievement; card: CardClass; side: Side }[];
  has: boolean;
  selectable: boolean;
}) => {
  const [page, setPage] = useState<SideType>(SideType.One);
  const [hover, setHover] = useState<boolean>(false);
  const item = useMemo(
    () => items.find(({ side }) => side.value === page),
    [items, page],
  );

  const cardId = useMemo(() => {
    if (!item) return 0;
    return Game.getCardId(item.card);
  }, [item]);

  if (!item && items.length === 0) return null;

  if (!item) {
    const achievement = items[0].achievement;
    const card = items[0].card;
    const side = items[0].side;
    return (
      <div className="flex flex-col gap-2 pb-2">
        <div
          className={`flex flex-col justify-center items-center ${!has && "grayscale"}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Card
            data={{ card, side, id: 0 }}
            isFlipped={hover}
            fgDescription={achievement.effect()}
            bgDescription={achievement.description()}
          />
        </div>
        <div className="w-full flex justify-center">
          <Enable id={cardId} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 pb-2">
      <Pagination>
        <PaginationContent>
          {items.map(({ side }, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                className={`${side.value === page && "opacity-80"}`}
                isActive={side.value === page}
                onClick={() => setPage(side.value)}
              >
                {side.getName()}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
      <div
        className={`${!has && "grayscale"}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Card
          data={{ card: item.card, side: item.side, id: 0 }}
          isFlipped={hover}
          bgDescription={item.achievement.description()}
        />
      </div>
      <div className="w-full flex justify-center gap-4">
        {selectable && <Select id={cardId} />}
        <Enable id={cardId} />
      </div>
    </div>
  );
};
