import { useCallback } from "react";
import { Account } from "@/ui/components/Account";
import { Separator } from "@/ui/elements/separator";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/ui/components/Theme";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { Collection } from "./Collection";
import { MusicPlayer } from "../modules/MusicPlayer";
import { useMediaQuery } from "react-responsive";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/ui/elements/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Leaderboard } from "./Leaderboard";
import { Achievements } from "../modules/Achievements";

export const Header = () => {
  const {
    account: { account },
  } = useDojo();

  const isMdOrLarger = useMediaQuery({ query: "(min-width: 768px)" });

  const { player } = usePlayer({ playerId: account.address });

  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("", { replace: true });
  }, [navigate]);

  return isMdOrLarger ? (
    <div>
      <div className="flex justify-center items-center p-4 flex-wrap md:justify-between">
        <div
          className="cursor-pointer flex gap-8 items-center"
          onClick={handleClick}
        >
          <p className="text-4xl font-bold">zKastle</p>
          <MusicPlayer />
          <Collection />
          <Achievements />
          <Leaderboard />
        </div>
        <div className="flex flex-col gap-4 items-center md:flex-row">
          {!!player && <p className="text-2xl">{player.name}</p>}
          <div className="flex gap-2">
            <Account />
            <ModeToggle />
          </div>
        </div>
      </div>
      <Separator />
    </div>
  ) : (
    <div>
      <div className="p-4 flex gap-5">
        <Drawer direction="right">
          <DrawerTrigger>
            <FontAwesomeIcon icon={faBars} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="mt-4">
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-4 p-4">
              <Collection />
              <Leaderboard />
            </div>
            <div className="flex flex-col gap-5 p-4">
              <div className="flex flex-col gap-2 items-center">
                <p className="self-start">Burner Account</p> <Account />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="self-start">Theme</p> <ModeToggle />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="self-start">Sound</p>
                <div className="self-start">
                  <MusicPlayer />
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        <div className="w-full flex justify-between items-center">
          <p className="text-4xl font-bold">zKastle</p>
          {!!player && <p className="text-2xl">{player.name}</p>}
        </div>
      </div>
      <Separator />
    </div>
  );
};
