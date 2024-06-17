import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/ui/elements/carousel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
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

export const Collection = () => {
  const groups = useMemo(() => Game.getUniqueCards(), []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Collection</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-sm md:max-w-full">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl">
              Card collection
            </DrawerTitle>
          </DrawerHeader>

          <Carousel
            className="w-full"
            orientation={"horizontal"}
            opts={{ dragFree: false }}
          >
            <CarouselContent className="flex">
              {groups.map((group, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
                  <Canvas items={group} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const Canvas = ({
  items,
}: {
  items: { card: CardClass; side: Side }[];
}) => {
  const [page, setPage] = useState<SideType>(SideType.One);
  const item = useMemo(
    () => items.find(({ side }) => side.value === page),
    [items, page],
  );

  if (!item) return null;

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
      <Card data={{ ...item, id: 0 }} scale="scale-[0.9]" />
    </div>
  );
};
