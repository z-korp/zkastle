import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { Start } from "../actions/Start";
import Table from "../containers/Table";
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

  return (
    <div className="relative flex flex-col">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute top-0 flex justify-center gap-4 w-full p-4 max-w-4xl">
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
