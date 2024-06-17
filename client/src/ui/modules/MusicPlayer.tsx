import { Play, Pause } from "lucide-react";
import { Button } from "@/ui/elements/button";
import { Slider } from "@/ui/elements/slider";
import { useMusicPlayer } from "@/contexts/music";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { useEffect, useState } from "react";

export const MusicPlayer = () => {
  const {
    playTheme,
    isPlaying,
    stopTheme,
    volume,
    setVolume,
    setTheme,
    playStart,
    playOver,
  } = useMusicPlayer();
  const [over, setOver] = useState(false);
  const [start, setStart] = useState(false);

  const {
    account: { account },
  } = useDojo();
  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({ gameId: player?.game_id || "0x0" });

  const handlePlay = () => {
    if (isPlaying) {
      stopTheme();
    } else {
      playTheme();
    }
  };

  useEffect(() => {
    setTheme(!game || game.isOver());
  }, [game, over]);

  // [Check] This is a useEffect hook that runs when the game is over
  useEffect(() => {
    if (!game && !start && !over) {
      setStart(false);
      setOver(true);
    } else if (game && !start && !over) {
      setStart(true);
      setOver(false);
    } else if (game && !start && over && !game.isOver()) {
      setStart(true);
      setOver(false);
      playStart();
    } else if (start && !over && (!game || game.isOver())) {
      setOver(true);
      setStart(false);
      playOver();
    }
  }, [game, start, over]);

  return (
    <>
      <div className="flex space-x-3 rounded-md p-2 backdrop-blur-lg z-1 border w-40">
        <Button
          onClick={() => handlePlay()}
          variant={"link"}
          className="self-center"
          size={"sm"}
        >
          {isPlaying ? (
            <Pause className="fill-transparen" />
          ) : (
            <Play className="fill-transparent" />
          )}
        </Button>

        <Slider
          onValueChange={(value) => setVolume(value[0])}
          defaultValue={[volume]}
          max={1}
          step={0.1}
        />
      </div>
    </>
  );
};
