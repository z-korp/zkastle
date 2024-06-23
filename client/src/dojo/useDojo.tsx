import { useContext } from "react";
import { DojoContext } from "./context";
import { useAccount } from "@starknet-react/core";
import { Account } from "starknet";

export const useDojo = () => {
  const context = useContext(DojoContext);
  if (!context)
    throw new Error("The `useDojo` hook must be used within a `DojoProvider`");

  const { account } = useAccount();

  return {
    setup: context,
    account: {
      account: account as Account,
    },
    master: context.master,
  };
};
