import { Resource as ResourceClass } from "@/dojo/game/types/resource";
import wheat from "/assets/wheat.png";
import stone from "/assets/stone.png";
import iron from "/assets/iron.png";
import { useMemo } from "react";

export const Resource = ({ resource }: { resource: ResourceClass }) => {
  const { height, width } = useMemo(
    () => ({ height: "h-12", width: "w-12" }),
    [],
  );
  return (
    <div className="flex gap-4 justify-center">
      {Array.from({ length: resource.wheat }, (_, i) => (
        <Wheat key={i} height={height} width={width} />
      ))}
      {Array.from({ length: resource.stone }, (_, i) => (
        <Stone key={i} height={height} width={width} />
      ))}
      {Array.from({ length: resource.iron }, (_, i) => (
        <Iron key={i} height={height} width={width} />
      ))}
    </div>
  );
};

export const Wheat = ({ height, width }: { height: string; width: string }) => {
  return <img className={`${height} ${width}`} src={wheat} alt="wheat" />;
};

export const Stone = ({ height, width }: { height: string; width: string }) => {
  return <img className={`${height} ${width}`} src={stone} alt="stone" />;
};

export const Iron = ({ height, width }: { height: string; width: string }) => {
  return (
    <img className={`${height} ${width} scale-[1.3]`} src={iron} alt="iron" />
  );
};
