import { Resource as ResourceClass } from "@/dojo/game/types/resource";
import wheat from "/assets/wheat.png";
import stone from "/assets/stone.png";
import iron from "/assets/iron.png";

export const Resource = ({ resource }: { resource: ResourceClass }) => {
  return (
    <div className="flex gap-4 justify-center">
      {Array.from({ length: resource.wheat }, (_, i) => (
        <Wheat key={i} height={16} width={16} />
      ))}
      {Array.from({ length: resource.stone }, (_, i) => (
        <Stone key={i} height={16} width={16} />
      ))}
      {Array.from({ length: resource.iron }, (_, i) => (
        <Iron key={i} height={16} width={16} />
      ))}
    </div>
  );
};

export const Wheat = ({ height, width }: { height: number; width: number }) => {
  return <img className={`h-${height} w-${width}`} src={wheat} alt="wheat" />;
};

export const Stone = ({ height, width }: { height: number; width: number }) => {
  return <img className={`h-${height} w-${width}`} src={stone} alt="stone" />;
};

export const Iron = ({ height, width }: { height: number; width: number }) => {
  return (
    <img className={`h-${height} w-${width} scale-150`} src={iron} alt="iron" />
  );
};
