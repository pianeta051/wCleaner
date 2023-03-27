import { defineConfig } from "cypress";

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
      framework: "create-react-app",
      bundler: "webpack",
    },
    videosFolder: "cypress/videos/component",
    screenshotsFolder: "cypress/screenshots/component",
  },
});
