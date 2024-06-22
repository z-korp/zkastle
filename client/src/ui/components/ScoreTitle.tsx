import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const ScoreTitle = ({ score }: { score: number }) => {
  return (
    <div className="flex justify-start items-center gap-4">
      <FontAwesomeIcon
        icon={faStar}
        size="xl"
        className="text-yellow-500 w-8"
      />
      <div className="font-bold text-4xl">{score}</div>
    </div>
  );
};
