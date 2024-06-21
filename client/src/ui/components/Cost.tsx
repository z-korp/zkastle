import { Resource as ResourceClass } from "@/dojo/game/types/resource";
import { Wheat } from "@/ui/components/Resource";
import { Stone } from "@/ui/components/Resource";
import { Iron } from "@/ui/components/Resource";

export const Cost = ({
  resources,
  textColor = "text-neutral-800",
  height = "h-6",
  width = "w-6",
  col = false,
  gap = 0.5,
}: {
  resources: ResourceClass[];
  textColor?: string;
  height?: string;
  width?: string;
  col?: boolean;
  gap?: number;
}) => {
  return (
    <div className="flex gap-1 justify-end">
      {resources.map((resource, index) => (
        <div
          key={index}
          className={`flex ${col && "flex-col"} gap-2 items-center ${textColor}`}
        >
          {!!index && <p className="text-xs font-bold">{"or"}</p>}
          {!!resource.wheat && (
            <div className={`flex items-center gap-${gap}`}>
              <p className="font-bold">{resource.wheat}</p>
              <Wheat height={height} width={width} />
            </div>
          )}
          {!!resource.stone && (
            <div className={`flex items-center gap-${gap}`}>
              <p className="font-bold">{resource.stone}</p>
              <Stone height={height} width={width} />
            </div>
          )}
          {!!resource.iron && (
            <div className={`flex items-center gap-${gap}`}>
              <p className="font-bold">{resource.iron}</p>
              <Iron height={height} width={width} />
            </div>
          )}
          {!!resource.message && (
            <div className={`flex items-center gap-${gap}`}>
              <p className="font-bold text-sm">{resource.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
