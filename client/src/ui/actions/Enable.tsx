import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { usePlayer } from "@/hooks/usePlayer";
import { Achievement } from "@/dojo/game/types/achievement";

export const Enable = ({ id }: { id: number }) => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { enable },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  const [isLoading, setIsLoading] = useState(false);

  const status = useMemo(() => {
    if (!player) return false;
    const achievement = Achievement.from(id);
    return player.isEnabled(achievement);
  }, [player]);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await enable({
        account: account as Account,
        achievement_id: id,
        enable: !status,
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, status, id]);

  const disabled = useMemo(() => {
    const achievement = Achievement.from(id);
    return (
      !account ||
      !master ||
      account === master ||
      !player ||
      !player.has(achievement)
    );
  }, [account, master, player, id]);

  return (
    <Button
      className="w-[85px] h-[28px]"
      size="sm"
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
    >
      {status ? "Disable" : "Enable"}
    </Button>
  );
};
