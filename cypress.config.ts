import { defineConfig } from "cypress";
import webpackConfig from "./config/webpack.config";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    videosFolder: "cypress/videos/e2e",
    screenshotsFolder: "cypress/screenshots/e2e",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig: webpackConfig("development"),
    },
    videosFolder: "cypress/videos/component",
    screenshotsFolder: "cypress/screenshots/component",
    viewportHeight: 1000,
    viewportWidth: 1000,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (_browser, launchOptions) => {
        launchOptions.args.push("--js-flags=--max-old-space-size=3500");

        return launchOptions;
      });
    },
  },
});
