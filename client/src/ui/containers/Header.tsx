import { useCallback } from "react";
import { Account } from "@/ui/components/Account";
import { Separator } from "@/ui/elements/separator";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/ui/components/Theme";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { Collection } from "./Collection";
import { MusicPlayer } from "../modules/MusicPlayer";
import { Leaderboard } from "./Leaderboard";

export const Header = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("", { replace: true });
  }, [navigate]);

  return (
    <div>
      <div className="flex justify-center items-center p-4 flex-wrap md:justify-between">
        <div
          className="cursor-pointer flex gap-8 items-center"
          onClick={handleClick}
        >
          <p className="text-4xl font-bold">zKastle</p>
          <MusicPlayer />
          <Collection />
          <Leaderboard />
        </div>
        <div className="flex flex-col gap-4 items-center md:flex-row">
          {!!player && <p className="text-2xl">{player.name}</p>}
          <div className="flex gap-2">
            <ModeToggle />
            <Account />
          </div>
        </div>
      </div>
      <Separator className="mb-8" />
    </div>
  );
};
