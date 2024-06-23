import background from "/assets/loading-bg.png";
import logo from "/assets/logo.png";
import loader from "/assets/loader.svg";
import { Button } from "@/ui/elements/button";

export const Loading = ({
  enter,
  setEnter,
}: {
  enter: boolean;
  setEnter: (state: boolean) => void;
}) => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 animate-zoom-in-out"
          style={{ backgroundImage: `url('${background}')` }}
        />
      </div>

      {/* Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-20">
        <img src={logo} alt="logo" className="h-32 md:h-40" />
      </div>

      {/* Loader */}
      <div
        className={`flex justify-center items-center z-[2000] ${!enter && "hidden"}`}
      >
        <img src={loader} alt="loader" className="h-32 md:h-40" />
      </div>

      {/* Enter Button */}
      <div
        className={`absolute bottom-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-[2000] ${enter && "hidden"}`}
      >
        <Button
          onClick={() => setEnter(true)}
          className="text-2xl"
          variant="default"
        >
          Enter
        </Button>
      </div>
    </div>
  );
};
