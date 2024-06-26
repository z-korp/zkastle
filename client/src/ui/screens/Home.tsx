import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { Start } from "../actions/Start";
import { Board } from "../containers/Board";
import { GameInfo } from "../containers/GameInfo";
import { GameOver } from "../containers/GameOver";

export const Home = () => {
  return (
    <div className="relative flex flex-col">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute top-10 flex flex-col items-center gap-4 w-full p-4 max-w-4xl">
          <Create />
          <Start />
        </div>
        <div className="absolute top-0 flex flex-col items-center gap-4 w-full px-4 py-2 max-w-4xl">
          <GameInfo />
          <GameOver />
        </div>
        <div className="absolute top-0 flex justify-center gap-4"></div>
        <Board />
      </div>
    </div>
  );
};
