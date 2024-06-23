import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setup, SetupResult } from "./dojo/setup.ts";
import { DojoProvider } from "./dojo/context.tsx";
import { dojoConfig } from "../dojo.config.ts";
import { Loading } from "@/ui/screens/Loading";
import { MusicPlayerProvider } from "./contexts/music.tsx";
import { StarknetConfig, jsonRpcProvider } from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";
import cartridgeConnector from "./cartridgeConnector.tsx";

function rpc() {
  return {
    nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
  };
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

function Main() {
  const chains = [sepolia];
  const connectors = [cartridgeConnector];

  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);
  const [ready, setReady] = useState(false);
  const [enter, setEnter] = useState(false);

  const loading = useMemo(
    () => !enter || !setupResult || !ready,
    [enter, setupResult, ready],
  );

  useEffect(() => {
    async function initialize() {
      const result = await setup(dojoConfig());
      setSetupResult(result);
    }

    initialize();
  }, [enter]);

  useEffect(() => {
    if (!enter) return;
    setTimeout(() => setReady(true), 2000);
  }, [enter]);

  return (
    <React.StrictMode>
      <StarknetConfig
        chains={chains}
        provider={jsonRpcProvider({ rpc })}
        connectors={connectors}
        autoConnect
      >
        <MusicPlayerProvider>
          {!loading && setupResult ? (
            <DojoProvider value={setupResult}>
              <App />
            </DojoProvider>
          ) : (
            <Loading enter={enter} setEnter={setEnter} />
          )}
        </MusicPlayerProvider>
      </StarknetConfig>
    </React.StrictMode>
  );
}

root.render(<Main />);
