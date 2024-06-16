import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { Start } from "../actions/Start";
import { Cards } from "../containers/Cards";

export const Home = () => {
  return (
    <div className="relative flex flex-col space-between h-screen">
      <Header />
      <div className="flex flex-col gap-4 grow items-center">
        <Create />
        <Start />
        <Cards />
      </div>
    </div>
  );
};
