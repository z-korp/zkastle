/* Autogenerated file. Do not edit manually. */

import { DojoProvider } from "@dojoengine/core";
import { Config } from "../../../dojo.config.ts";
import { Account, InvocationsDetails, shortString } from "starknet";

export interface Signer {
  account: Account;
}

export interface Initialize extends Signer {
  world: string;
}

export interface Create extends Signer {
  name: string;
}

export interface Start extends Signer {}

export interface Play extends Signer {
  action: number;
  choice: number;
  resources: number;
}

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export const getContractByName = (manifest: any, name: string) => {
  const contract = manifest.contracts.find((contract: any) =>
    contract.name.includes("::" + name),
  );
  if (contract) {
    return contract.address;
  } else {
    return "";
  }
};

export async function setupWorld(provider: DojoProvider, config: Config) {
  const details: InvocationsDetails = { maxFee: 1e15 };

  function actions() {
    const contract_name = "actions";
    const contract = config.manifest.contracts.find((c: any) =>
      c.name.includes(contract_name),
    );
    if (!contract) {
      throw new Error(`Contract ${contract_name} not found in manifest`);
    }

    const initialize = async ({ account, world }: Initialize) => {
      try {
        return await provider.execute(
          account,
          contract_name,
          "initialize",
          [world],
          details,
        );
      } catch (error) {
        console.error("Error executing initialize:", error);
        throw error;
      }
    };

    const create = async ({ account, name }: Create) => {
      try {
        const encoded_name = shortString.encodeShortString(name);
        return await provider.execute(
          account,
          contract_name,
          "create",
          [provider.getWorldAddress(), encoded_name],
          details,
        );
      } catch (error) {
        console.error("Error executing create:", error);
        throw error;
      }
    };

    const start = async ({ account }: Start) => {
      try {
        return await provider.execute(
          account,
          contract_name,
          "start",
          [provider.getWorldAddress()],
          details,
        );
      } catch (error) {
        console.error("Error executing start:", error);
        throw error;
      }
    };

    const play = async ({ account, action, choice, resources }: Play) => {
      try {
        return await provider.execute(
          account,
          contract_name,
          "play",
          [provider.getWorldAddress(), action, choice, resources],
          details,
        );
      } catch (error) {
        console.error("Error executing play:", error);
        throw error;
      }
    };

    return {
      address: contract.address,
      initialize,
      create,
      start,
      play,
    };
  }

  return {
    actions: actions(),
  };
}
