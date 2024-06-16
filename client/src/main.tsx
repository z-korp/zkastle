import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setup, SetupResult } from "./dojo/setup.ts";
import { DojoProvider } from "./dojo/context.tsx";
import { dojoConfig } from "../dojo.config.ts";
import { Loading } from "@/ui/screens/Loading";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

function Main() {
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      const result = await setup(dojoConfig());
      setSetupResult(result);
    }

    initialize();
    setTimeout(() => setReady(true), 2000);
  }, []);

  if (!setupResult || !ready) return <Loading />;

  return (
    <React.StrictMode>
      <DojoProvider value={setupResult}>
        <App />
      </DojoProvider>
    </React.StrictMode>
  );
}

root.render(<Main />);
