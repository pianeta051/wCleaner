import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Amplify, ResourcesConfig } from "aws-amplify";
import { config } from "./config";

// The Amplify config file is generated (`amplify pull` locally, Amplify Hosting
// in its builds) and not committed, so it's loaded optionally: a build with
// `VITE_SWITCH_TO_NEW_INFRA=true` doesn't need it.
const amplifyConfigFiles = import.meta.glob<ResourcesConfig>(
  "./amplifyconfiguration.json",
  { eager: true, import: "default" }
);

if (!config.switchToNewInfra) {
  const amplifyConfig = amplifyConfigFiles["./amplifyconfiguration.json"];
  if (!amplifyConfig) {
    throw new Error(
      "src/amplifyconfiguration.json not found. Run `amplify pull` (see the README)."
    );
  }
  Amplify.configure(amplifyConfig);
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
