import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/elements/tooltip";
import { Button } from "@/ui/elements/button";
import { Game } from "@/dojo/game/models/game";
import { useGames } from "@/hooks/useGames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { usePlayer } from "@/hooks/usePlayer";

export const Leaderboard = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Leaderboard</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="select-none">Leaderboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
          <TableHead className="w-[100px]">Score</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games
          .sort((a, b) => b.getScore() - a.getScore())
          .slice(0, 10)
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
        <p className="flex gap-1 items-center">
          <span className="font-bold">{game.getScore()}</span>
          <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
        </p>
      </TableCell>
      <TableCell className="text-left">{player?.name || "-"}</TableCell>
    </TableRow>
  );
};
