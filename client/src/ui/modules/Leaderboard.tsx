import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/ui/elements/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/elements/table";
import { Button } from "@/ui/elements/button";
import { AchievementDetail, Game } from "@/dojo/game/models/game";
import { useGames } from "@/hooks/useGames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKhanda, faStar } from "@fortawesome/free-solid-svg-icons";
import { usePlayer } from "@/hooks/usePlayer";
import { useMemo } from "react";

export const Leaderboard = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Leaderboard</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center text-2xl">
          Leaderboard
        </DialogHeader>
        <div className="m-auto">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const Content = () => {
  const { games } = useGames();
  const disabled = useMemo(
    () =>
      games.filter((game) => !!game.getScore() || !!game.getUpgrade()).length >
      0,
    [games],
  );

  return (
    <Table className="text-md">
      <TableCaption className={`${disabled && "hidden"}`}>
        Leaderbord is waiting for its best players to make history
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Rank</TableHead>
          <TableHead className="text-center">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
          </TableHead>
          <TableHead className="text-center">
            <FontAwesomeIcon icon={faKhanda} className="text-slate-500" />
          </TableHead>
          <TableHead className="text-center">Achievements</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games
          .sort((a, b) => b.getUpgrade() - a.getUpgrade())
          .sort((a, b) => b.getScore() - a.getScore())
          .slice(0, 10)
          .filter((game) => !!game.getScore() || !!game.getUpgrade())
          .map((game, index) => (
            <Row key={index} rank={index + 1} game={game} />
          ))}
      </TableBody>
    </Table>
  );
};

export const Row = ({ rank, game }: { rank: number; game: Game }) => {
  const { player } = usePlayer({ playerId: game.player_id });
  return (
    <TableRow>
      <TableCell>{`# ${rank}`}</TableCell>
      <TableCell className="text-right">
        <p className="flex gap-1 justify-center items-center">
          <span className="font-bold">{game.getScore()}</span>
        </p>
      </TableCell>
      <TableCell className="text-right">
        <p className="flex gap-1 justify-center items-center">
          <span className="font-bold">{game.getUpgrade()}</span>
        </p>
      </TableCell>
      <TableCell className="flex justify-center">
        <Achievements details={game.achievements} />
      </TableCell>
      <TableCell className="text-left">
        {player?.getShortName() || "-"}
      </TableCell>
    </TableRow>
  );
};

export const Achievements = ({ details }: { details: AchievementDetail[] }) => {
  return (
    <div className="flex gap-1 justify-center">
      {details.map(({ achievement, has }, index) => (
        <div
          key={index}
          className={`h-5 w-5 bg-cover bg-center ${!has && "grayscale"} z-0`}
          style={{ backgroundImage: `url('${achievement.getIcon()}')` }}
        />
      ))}
    </div>
  );
};
