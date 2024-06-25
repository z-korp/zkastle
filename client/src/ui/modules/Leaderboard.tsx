import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/elements/pagination";
import { Button } from "@/ui/elements/button";
import { AchievementDetail, Game } from "@/dojo/game/models/game";
import { useGames } from "@/hooks/useGames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKhanda, faStar } from "@fortawesome/free-solid-svg-icons";
import { usePlayer } from "@/hooks/usePlayer";
import { useCallback, useEffect, useMemo, useState } from "react";

const GAME_PER_PAGE = 5;
const MAX_PAGE_COUNT = 5;

export const Leaderboard = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Leaderboard</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center text-2xl">
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogDescription />
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
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);

  useEffect(() => {
    const rem = Math.floor(games.length / GAME_PER_PAGE) + 1;
    // setPage(rem);
    setPageCount(rem);
  }, [games]);

  const { start, end } = useMemo(() => {
    const start = page - 1;
    const end = start + GAME_PER_PAGE;
    return { start, end };
  }, [page]);

  const handlePrevious = useCallback(() => {
    if (page === 1) return;
    setPage((prev) => prev - 1);
  }, [page]);

  const handleNext = useCallback(() => {
    if (page === pageCount) return;
    setPage((prev) => prev + 1);
  }, [page, pageCount]);

  const disabled = useMemo(
    () =>
      games.filter((game) => !!game.getScore() || !!game.getUpgrade())
        .length > 0,
    [games],
  );

  return (
    <>
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
            .slice(start, end)
            .filter((game) => !!game.getScore() || !!game.getUpgrade())
            .map((game, index) => (
              <Row
                key={index}
                rank={(page - 1) * GAME_PER_PAGE + index + 1}
                game={game}
              />
            ))}
        </TableBody>
      </Table>
      <Pagination className={`${!disabled && "hidden"}`}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`${page === 1 && "opacity-50"}`}
              onClick={handlePrevious}
            />
          </PaginationItem>
          {Array.from({ length: Math.min(pageCount, MAX_PAGE_COUNT) }).map(
            (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={index + 1 === page}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              className={`${page === pageCount && "opacity-50"}`}
              onClick={handleNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
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
      <TableCell className="text-left max-w-36 truncate">
        {player?.name || "-"}
      </TableCell>
    </TableRow>
  );
};

export const Achievements = ({ details }: { details: AchievementDetail[] }) => {
  return (
    <div className="grid grid-cols-5 gap-1 sm:grid-cols-9">
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
