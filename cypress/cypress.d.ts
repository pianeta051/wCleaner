/// <reference types="cypress" />
import { mount } from "cypress/react";
/// <reference types="cypress" />
import "cypress-file-upload";

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      attachFile(
        file:
          | string
          | { fileContent: Blob | string; fileName: string; mimeType: string }
      ): Chainable<Subject>;
      mount: typeof mount;
    }
  }
  interface Window {
    __mockCustomers?: Customer[];
  }
}
export const useCustomers = () => ({
  customers: window.__mockCustomers || [],
});
