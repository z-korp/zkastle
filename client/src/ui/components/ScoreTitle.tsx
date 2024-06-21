import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const ScoreTitle = ({ score }: { score: number }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faStar} size="2xs" className="text-yellow-500" />
        <p className="text-base">Score</p>
        <FontAwesomeIcon size="2xs" icon={faStar} className="text-yellow-500" />
      </div>
      <span className="font-bold text-4xl">{score}</span>
    </div>
  );
};
