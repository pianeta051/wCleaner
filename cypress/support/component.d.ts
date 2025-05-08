import { mount } from "cypress/react";
import "cypress-file-upload";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
