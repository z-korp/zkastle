import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { KATANA_ETH_CONTRACT_ADDRESS } from "@dojoengine/core";
import { Copy } from "lucide-react";
import { Button } from "../elements/button";
import Balance from "./Balance";

const shortAddress = (address: string, size = 4) => {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
};

const Connect = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, status } = useAccount();

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  if (status === "connected" && address) {
    return (
      <div className="flex gap-3 items-center flex-col w-full vt323-font">
        <h2 className="m-0 text-2xl">Account</h2>
        <div className="flex items-center gap-3 w-full">
          <div className="flex-grow flex items-center gap-3 rounded-lg px-3 py-1 justify-between bg-gray-400 text-primary-foreground drop-shadow-lg h-[32px] box-border">
            <p className="font-joystix text-xs">{shortAddress(address, 15)}</p>
            <Balance
              address={address}
              token_address={KATANA_ETH_CONTRACT_ADDRESS}
            />
          </div>
          <Button className="h-[32px]" onClick={copyToClipboard}>
            <Copy size={16} />
          </Button>
          <Button
            className="h-[32px]"
            variant="destructive"
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {connectors.map((connector) => (
        <span key={connector.id}>
          <Button
            onClick={() => {
              connect({ connector });
            }}
          >
            Connect
          </Button>
        </span>
      ))}
    </div>
  );
};

export default Connect;
