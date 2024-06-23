import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { Start } from "../actions/Start";
import Table from "../containers/Table";
import { GameInfo } from "../containers/GameInfo";
import { GameOver } from "../containers/GameOver";
import { useDojo } from "@/dojo/useDojo";

export const Home = () => {
  const { account } = useDojo();

  return (
    <div className="relative flex flex-col">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute top-10 flex flex-col items-center gap-4 w-full p-4 max-w-4xl">
          <Create />
          <Start />
          {account === undefined && (
            <div className="text-xl">Please connect a Wallet.</div>
          )}
        </div>
        <div className="absolute top-0 flex flex-col items-center gap-4 w-full px-4 py-2 max-w-4xl">
          <GameInfo />
          <GameOver />
        </div>
        <div className="absolute top-0 flex justify-center gap-4"></div>
        <Table />
      </div>
    </div>
  );
};
