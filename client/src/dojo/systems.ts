import type { IWorld } from "./generated/contractSystems";

import { toast } from "sonner";
import * as SystemTypes from "./generated/contractSystems";
import { ClientModels } from "./models";
import { shortenHex } from "@dojoengine/utils";

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

  const notify = (message: string, transaction: any) => {
    if (transaction.execution_status != "REVERTED") {
      toast.success(message, {
        description: shortenHex(transaction.transaction_hash),
        action: {
          label: "View",
          onClick: () =>
            window.open(
              `https://worlds.dev/networks/slot/worlds/zkastle/txs/${transaction.transaction_hash}`,
            ),
        },
      });
    } else {
      toast.error(extractedMessage(transaction.revert_reason));
    }
  };

  const create = async ({ account, ...props }: SystemTypes.Create) => {
    try {
      const { transaction_hash } = await client.actions.create({
        account,
        ...props,
      });

      notify(
        `Player has been created.`,
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const rename = async ({ account, ...props }: SystemTypes.Rename) => {
    try {
      const { transaction_hash } = await client.actions.rename({
        account,
        ...props,
      });

      notify(
        `Player has been renamed.`,
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const select = async ({ account, ...props }: SystemTypes.Select) => {
    try {
      const { transaction_hash } = await client.actions.select({
        account,
        ...props,
      });

      notify(
        `Card has been selected.`,
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const start = async ({ account, ...props }: SystemTypes.Start) => {
    try {
      const { transaction_hash } = await client.actions.start({
        account,
        ...props,
      });

      notify(
        `Game has been started.`,
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const play = async ({ account, ...props }: SystemTypes.Play) => {
    try {
      const { transaction_hash } = await client.actions.play({
        account,
        ...props,
      });

      notify(
        `Move has been registered.`,
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const remove = async ({ account, ...props }: SystemTypes.Discard) => {
    try {
      const { transaction_hash } = await client.actions.discard({
        account,
        ...props,
      });

      notify(
        `Game has been discarded.`,
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  const surrender = async ({ account, ...props }: SystemTypes.Surrender) => {
    try {
      const { transaction_hash } = await client.actions.surrender({
        account,
        ...props,
      });

      notify(
        `Game has been surrendered.`,
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      );
    } catch (error: any) {
      toast.error(extractedMessage(error.message));
    }
  };

  return {
    create,
    rename,
    select,
    start,
    play,
    remove,
    surrender,
  };
}
