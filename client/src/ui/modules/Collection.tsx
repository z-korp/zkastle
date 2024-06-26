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
import { Game as GameClass } from "@/dojo/game/models/game";
import { Side, SideType } from "@/dojo/game/types/side";
import { Card as CardClass } from "@/dojo/game/types/card";
import { Game } from "@/dojo/game/models/game";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Card from "../components/Card/Card";
import { Select } from "../actions/Select";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { Achievement, AchievementType } from "@/dojo/game/types/achievement";

export const Collection = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const isMdOrLarger = useMediaQuery({ query: "(min-width: 768px)" });
  const groups = useMemo(() => Game.getUniqueCards(), []);

  const selectable = useMemo(() => {
    return player && player.has(new Achievement(AchievementType.OracleStone));
  }, [player]);

  return (
    <Drawer handleOnly={true}>
      <DrawerTrigger asChild>
        <Button variant="outline">Collection</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-sm md:max-w-full m-auto pb-4">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl">
              Card collection
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
                  <Canvas items={group} selectable={!!selectable} />
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
  selectable,
}: {
  items: { card: CardClass; side: Side }[];
  selectable: boolean;
}) => {
  const [page, setPage] = useState<SideType>(SideType.One);
  const item = useMemo(
    () => items.find(({ side }) => side.value === page),
    [items, page],
  );
  const cardId = useMemo(() => {
    if (!item) return 0;
    return GameClass.getCardId(item.card);
  }, [item]);

  if (!item || !cardId) return null;

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
      <div className="mb-2">
        <Card data={{ ...item, id: 0 }} isFlipped={false} />
      </div>
      {selectable && <Select id={cardId} />}
    </div>
  );
};
