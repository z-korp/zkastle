import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { Start } from "../actions/Start";
import { Cards } from "../containers/Cards";
import { Deck } from "../containers/Deck";
import { Surrender } from "../actions/Surrender";
import { Upgrade } from "../containers/Upgrade";
import CardFlip from "../components/CardFlip/CardFlip";
import { Button } from "../elements/button";
import Table from "../containers/Table";
import { Storage } from "../containers/Storage";
import { Info } from "../containers/Info";
import { useGame } from "@/hooks/useGame";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";

export const Home = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  console.log(player, game);

  return (
    <div className="relative flex flex-col">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute top-0 flex justify-center gap-4 w-full p-4">
          <Create />
          <Start />

          {game && <Info count={game.move_count} score={game.getScore()} />}
        </div>
        <div className="absolute top-0 flex justify-center gap-4"></div>
        <Table />
      </div>
    </div>
  );
};
