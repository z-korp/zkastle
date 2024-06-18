import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { Start } from "../actions/Start";
import { Cards } from "../containers/Cards";
import { Deck } from "../containers/Deck";
import { Surrender } from "../actions/Surrender";
import { Upgrade } from "../containers/Upgrade";

export const Home = () => {
  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="flex flex-col gap-8 grow items-center justify-start">
        <div className="flex justify-center gap-4">
          <Create />
          <Start />
          <Surrender />
        </div>
        <Cards />
      </div>
      <Deck />
      <Upgrade />
    </div>
  );
};
