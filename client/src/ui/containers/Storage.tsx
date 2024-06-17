import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { useGame } from "@/hooks/useGame";
import { Slot } from "../components/Slot";
import { Button } from "@/ui/elements/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/ui/elements/dialog";
import { useCallback } from "react";
import { useGameStore } from "@/stores/game";

export const Storage = () => {
  const {
    account: { account },
  } = useDojo();

  const { setResources } = useGameStore();
  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const handleClose = useCallback(() => {
    setResources(0);
  }, []);

  if (!player || !game) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="text-2xl">
          Storage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Storage</DialogTitle>
          <DialogDescription>Select the resources to spend</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 min-w-60 items-center">
          {game.stores.map((store, index) => (
            <Slot key={index} data={store} index={index + 1} />
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="m-1" variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogClose>
          <Button className="m-1" type="submit">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
