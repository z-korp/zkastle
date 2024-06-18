import { Resource as ResourceClass } from "@/dojo/game/types/resource";
import { Wheat } from "@/ui/components/Resource";
import { Stone } from "@/ui/components/Resource";
import { Iron } from "@/ui/components/Resource";

export const Cost = ({
  resources,
  textColor = "text-neutral-800",
  height = "h-6",
  width = "w-6",
}: {
  resources: ResourceClass[];
  textColor?: string;
  height?: string;
  width?: string;
}) => {
  return (
    <div className="flex gap-1">
      {resources.map((resource, index) => (
        <div key={index} className={`flex gap-2 items-center ${textColor}`}>
          {!!index && <p className="text-xs font-bold">{"or"}</p>}
          {!!resource.wheat && (
            <div className="flex items-center gap-1">
              <p className="font-bold">{resource.wheat}</p>
              <Wheat height={height} width={width} />
            </div>
          )}
          {!!resource.stone && (
            <div className="flex items-center gap-1">
              <p className="font-bold">{resource.stone}</p>
              <Stone height={height} width={width} />
            </div>
          )}
          {!!resource.iron && (
            <div className="flex items-center gap-1">
              <p className="font-bold">{resource.iron}</p>
              <Iron height={height} width={width} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
