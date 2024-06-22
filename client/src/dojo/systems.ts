import type { IWorld } from "./generated/contractSystems";
import { toast } from "sonner";
import * as SystemTypes from "./generated/contractSystems";
import { ClientModels } from "./models";
import { shortenHex } from "@dojoengine/utils";
import { Account } from "starknet";

export type SystemCalls = ReturnType<typeof systems>;

export function systems({
  client,
  clientModels,
}: {
  client: IWorld;
  clientModels: ClientModels;
}) {
  const extractedMessage = (message: string) => {
    return message.match(/\('([^']+)'\)/)?.[1];
  };

  const getToastAction = (transaction_hash: string) => {
    return {
      label: "View",
      onClick: () =>
        window.open(
          `https://worlds.dev/networks/slot/worlds/zkastle/txs/${transaction_hash}`,
        ),
    };
  };

  const notify = (
    message: string,
    transaction: any,
    toastId: string | number,
  ) => {
    if (transaction.execution_status !== "REVERTED") {
      toast.success(message, {
        id: toastId,
        description: shortenHex(transaction.transaction_hash),
        action: getToastAction(transaction.transaction_hash),
        position: "top-center",
      });
    } else {
      toast.error(extractedMessage(transaction.revert_reason), {
        id: toastId,
        position: "top-center",
      });
    }
  };

  const handleTransaction = async (
    account: Account,
    action: () => Promise<{ transaction_hash: string }>,
    successMessage: string,
  ) => {
    const toastId = toast.loading("Transaction in progress...");
    try {
      const { transaction_hash } = await action();
      toast.loading("Transaction in progress...", {
        description: shortenHex(transaction_hash),
        action: getToastAction(transaction_hash),
        id: toastId,
        position: "top-center",
      });

      const transaction = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      notify(successMessage, transaction, toastId);
    } catch (error: any) {
      toast.error(extractedMessage(error.message), { id: toastId });
    }
  };

  const create = async ({ account, ...props }: SystemTypes.Create) => {
    await handleTransaction(
      account,
      () => client.actions.create({ account, ...props }),
      "Player has been created.",
    );
  };

  const rename = async ({ account, ...props }: SystemTypes.Rename) => {
    await handleTransaction(
      account,
      () => client.actions.rename({ account, ...props }),
      "Player has been renamed.",
    );
  };

  const select = async ({ account, ...props }: SystemTypes.Select) => {
    await handleTransaction(
      account,
      () => client.actions.select({ account, ...props }),
      "Card has been selected.",
    );
  };

  const enable = async ({ account, ...props }: SystemTypes.Enable) => {
    await handleTransaction(
      account,
      () => client.actions.enable({ account, ...props }),
      "Achievement status has been updated.",
    );
  };

  const start = async ({ account, ...props }: SystemTypes.Start) => {
    await handleTransaction(
      account,
      () => client.actions.start({ account, ...props }),
      "Game has been started.",
    );
  };

  const play = async ({ account, ...props }: SystemTypes.Play) => {
    await handleTransaction(
      account,
      () => client.actions.play({ account, ...props }),
      "Move has been registered.",
    );
  };

  const remove = async ({ account, ...props }: SystemTypes.Discard) => {
    await handleTransaction(
      account,
      () => client.actions.discard({ account, ...props }),
      "Game has been discarded.",
    );
  };

  const surrender = async ({ account, ...props }: SystemTypes.Surrender) => {
    await handleTransaction(
      account,
      () => client.actions.surrender({ account, ...props }),
      "Game has been surrendered.",
    );
  };

  return {
    create,
    rename,
    select,
    enable,
    start,
    play,
    remove,
    surrender,
  };
}
