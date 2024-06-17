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
import { useCallback, useMemo } from "react";
import { useGameStore } from "@/stores/game";
import { Cost } from "../components/Cost";

export const Storage = () => {
  const {
    account: { account },
  } = useDojo();

  const { resources, storage, costs, callback, setStorage, reset } =
    useGameStore();
  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const hidden = useMemo(() => {
    return costs.filter((cost) => !cost.isNull()).length === 0;
  }, [costs]);

  const disabled = useMemo(() => {
    if (!game) return true;
    return !game.isAffordable(resources, costs);
  }, [resources, game, costs]);

  const handleClose = useCallback(() => {
    reset();
  }, []);

  const handleConfirm = useCallback(() => {
    callback(resources);
    reset();
  }, [resources, callback]);

  const handleChange = useCallback((state: boolean) => {
    setStorage(state);
    if (state) return;
    handleClose();
  }, []);

  if (!player || !game) return null;

  return (
    <Dialog open={storage} onOpenChange={handleChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="text-2xl">
          Storage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="text-2xl">Storage</DialogTitle>
          <DialogDescription>Select the resources to spend</DialogDescription>
          <Cost resources={costs} />
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
          <Button
            disabled={disabled}
            className={`m-1 ${hidden && "hidden"}`}
            type="submit"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
