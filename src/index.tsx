import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Amplify } from "aws-amplify";
import AWSConfig from "./aws-exports";

Amplify.configure(AWSConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
