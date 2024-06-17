import background from "/assets/loading-bg.png";
import logo from "/assets/logo.png";
import loader from "/assets/loader.svg";

export const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-[pulse_30s_ease-in-out_infinite] opacity-50"
        style={{ backgroundImage: `url('${background}')` }}
      />

      {/* Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-20">
        <img src={logo} alt="logo" className="h-32 md:h-40" />
      </div>

      {/* Loader */}
      <div className="flex justify-center items-center z-50">
        <img src={loader} alt="loader" className="h-32 md:h-40" />
      </div>
    </div>
  );
};
