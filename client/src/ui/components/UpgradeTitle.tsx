import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKhanda } from "@fortawesome/free-solid-svg-icons";

export const UpgradeTitle = ({ score }: { score: number }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon
          icon={faKhanda}
          size="2xs"
          className="text-slate-500"
        />
        <p className="text-base">Upgrades</p>
        <FontAwesomeIcon
          size="2xs"
          icon={faKhanda}
          className="text-slate-500"
        />
      </div>
      <span className="font-bold text-4xl">{score}</span>
    </div>
  );
};
