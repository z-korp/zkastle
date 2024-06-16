import { useCallback } from "react";
import { Account } from "@/ui/components/Account";
import { Separator } from "@/ui/elements/separator";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/ui/components/Theme";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";

export const Header = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("", { replace: true });
  }, [navigate]);

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <div className="cursor-pointer" onClick={handleClick}>
          <p className="text-4xl font-bold">zKastle</p>
        </div>
        <div className="flex gap-2 items-center">
          {!!player && <p className="mr-4">{player.name}</p>}
          <ModeToggle />
          <Account />
        </div>
      </div>
      <Separator className="mb-8" />
    </div>
  );
};
