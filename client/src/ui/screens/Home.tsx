import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { Start } from "../actions/Start";
import { Cards } from "../containers/Cards";
import { Deck } from "../containers/Deck";
import { Storage } from "../containers/Storage";
import { Surrender } from "../actions/Surrender";

export const Home = () => {
  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="flex flex-col gap-4 grow items-center justify-between">
        <div className="flex justify-center gap-4">
          <Create />
          <Start />
          <Surrender />
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col grow items-center">
            <Cards />
            <Deck />
          </div>
          <div className="absolute right-0 top-1/3">
            <Storage />
          </div>
        </div>
      </div>
    </div>
  );
};
