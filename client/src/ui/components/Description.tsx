import backside from "/assets/backside-bg.png";

export const Description = ({
  description,
  height = "h-96",
  width = "w-60",
  scale = "scale-100",
}: {
  description: string;
  height?: string;
  width?: string;
  scale?: string;
}) => {
  return (
    <div
      className={`relative ${height} ${width} ${scale} rounded-2xl overflow-clip border border-slate-900 bg-slate-200`}
    >
      <div
        className={`absolute h-full w-full bg-cover bg-center opacity-90 z-0`}
        style={{ backgroundImage: `url('${backside}')` }}
      />

      <div className="w-full h-full flex justify-center items-center text-center p-8">
        <p className="text-2xl text-white z-10">{description}</p>
      </div>
    </div>
  );
};
