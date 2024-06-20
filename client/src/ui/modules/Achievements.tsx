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
import { Card } from "../components/Card";
import { Game } from "@/dojo/game/models/game";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { Achievement } from "@/dojo/game/types/achievement";
import { Description } from "@/ui/components/Description";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

export const Achievements = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const isMdOrLarger = useMediaQuery({ query: "(min-width: 768px)" });
  const groups = useMemo(() => Game.getAchievements(), []);

  return (
    <Drawer handleOnly={true}>
      <DrawerTrigger asChild>
        <Button variant="outline">Achievements</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-sm md:max-w-full">
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
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
                  <Canvas
                    items={group}
                    has={
                      player && group.length > 0
                        ? player.has(group[0].achievement)
                        : false
                    }
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
}: {
  items: { achievement: Achievement; card: CardClass; side: Side }[];
  has: boolean;
}) => {
  const [page, setPage] = useState<SideType>(SideType.One);
  const [hover, setHover] = useState<boolean>(false);
  const item = useMemo(
    () => items.find(({ side }) => side.value === page),
    [items, page],
  );

  if (!item && items.length === 0) return null;

  if (!item) {
    const achievement = items[0].achievement;
    const card = items[0].card;
    const side = items[0].side;
    return (
      <>
        <div className="flex justify-center items-center">
          <FontAwesomeIcon
            icon={has ? faLockOpen : faLock}
            className="h-8 w-8"
          />
        </div>
        <div
          className={`flex flex-col justify-center items-center scale-[0.9]`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {!hover && <Card data={{ card, side, id: 0 }} />}
          {hover && <Description description={achievement.description()} />}
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
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
      <div className="flex justify-center items-center mt-4">
        <FontAwesomeIcon icon={has ? faLockOpen : faLock} className="h-8 w-8" />
      </div>
      <div
        className={``}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {!hover && (
          <Card
            data={{ card: item.card, side: item.side, id: 0 }}
            scale="scale-[0.9]"
          />
        )}
        {hover && (
          <Description
            description={item.achievement.description()}
            scale="scale-[0.9]"
          />
        )}
      </div>
    </div>
  );
};
