import { useAccount, useDisconnect } from "@starknet-react/core";
import { KATANA_ETH_CONTRACT_ADDRESS } from "@dojoengine/core";
import { Copy } from "lucide-react";
import { Button } from "../elements/button";
import Balance from "./Balance";

const shortAddress = (address: string, size = 4) => {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
};

const AccountData = () => {
  const { disconnect } = useDisconnect();
  const { address, status } = useAccount();

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  if (status === "connected" && address) {
    return (
      <div className="flex gap-3 items-center flex-col text-primary">
        <div className="flex items-center gap-3 w-full flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3 rounded-lg px-3 py-1 justify-between border">
            <p className="text-sm">{shortAddress(address, 4)}</p>
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
  } else {
    return null;
  }
};

export default AccountData;
