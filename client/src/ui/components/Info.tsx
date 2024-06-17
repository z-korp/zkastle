import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "../elements/badge";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const Info = ({
  count,
  score,
  height = "h-96",
  width = "w-60",
  scale = "scale-100",
}: {
  count: number;
  score: number;
  height?: string;
  width?: string;
  scale?: string;
}) => {
  return (
    <div
      className={`relative ${height} ${width} rounded-2xl overflow-clip bg-slate-700 ${scale}`}
    >
      <Badge className="h-full w-full flex flex-col gap-4 justify-center items-center">
        <p className="text-6xl">{count}</p>
        <p className="flex gap-2 text-4xl items-center">
          <span className="font-bold">{score}</span>
          <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
        </p>
      </Badge>
    </div>
  );
};
