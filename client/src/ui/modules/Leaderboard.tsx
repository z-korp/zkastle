import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/ui/elements/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/elements/table";
import { Button } from "@/ui/elements/button";
import { Game } from "@/dojo/game/models/game";
import { useGames } from "@/hooks/useGames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKhanda, faStar } from "@fortawesome/free-solid-svg-icons";
import { usePlayer } from "@/hooks/usePlayer";

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
  return (
    <Table className="text-md">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead className="w-[100px] text-center">Score</TableHead>
          <TableHead className="w-[100px] text-center">Upgrades</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games
          .sort((a, b) => b.getUpgrade() - a.getUpgrade())
          .sort((a, b) => b.getScore() - a.getScore())
          .slice(0, 10)
          .filter((game) => !!game.getScore())
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
          <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
        </p>
      </TableCell>
      <TableCell className="text-right">
        <p className="flex gap-1 justify-center items-center">
          <span className="font-bold">{game.getUpgrade()}</span>
          <FontAwesomeIcon icon={faKhanda} className="text-slate-500" />
        </p>
      </TableCell>
      <TableCell className="text-left">{player?.name || "-"}</TableCell>
    </TableRow>
  );
};
