import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKhanda } from "@fortawesome/free-solid-svg-icons";

export const UpgradeTitle = ({ score }: { score: number }) => {
  return (
    <div className="flex justify-start items-center gap-4">
      <FontAwesomeIcon
        size="xl"
        icon={faKhanda}
        className="text-slate-500 w-8"
      />
      <span className="font-bold text-4xl">{score}</span>
    </div>
  );
};
