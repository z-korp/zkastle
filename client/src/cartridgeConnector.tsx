import { Connector } from "@starknet-react/core";
import CartridgeConnector from "@cartridge/connector";
import { getContractByName } from "@dojoengine/core";
import manifest from "../../contracts/manifests/sepolia/manifest.json";

const actions_contract_address = getContractByName(
  manifest,
  "zkastle::systems::actions::actions",
)?.address;

const cartridgeConnector = new CartridgeConnector(
  [
    {
      target: import.meta.env.VITE_PUBLIC_FEE_TOKEN_ADDRESS,
      method: "approve",
    },
    {
      target: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH,
      method: "initialize",
    },
    {
      target: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH,
      method: "create",
    },
    // actions
    {
      target: actions_contract_address,
      method: "create",
    },
    {
      target: actions_contract_address,
      method: "rename",
    },
    {
      target: actions_contract_address,
      method: "select",
    },
    {
      target: actions_contract_address,
      method: "enable",
    },
    {
      target: actions_contract_address,
      method: "start",
    },
    {
      target: actions_contract_address,
      method: "play",
    },
    {
      target: actions_contract_address,
      method: "discard",
    },
    {
      target: actions_contract_address,
      method: "surrender",
    },
  ],
  { theme: "zkastle" },
) as never as Connector;

export default cartridgeConnector;
