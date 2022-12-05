import { first } from "cypress/types/lodash";

describe("Customers page", () => {
  it("Display customers list when visit customers page", () => {
    cy.visit("/admin/customers");
    cy.contains("Carlos");
    cy.contains("John Smith");
    cy.contains("Amalia Rosso");
  });

  it("Display customer details when click in name link", () => {
    cy.visit("/admin/customers");
    cy.contains("Carlos").click();
    cy.url().should("contain", `admin/customers/carlos`);
  });

  it("Display an customer edit modal when click edit button", () => {
    cy.visit("/admin/customers");
    cy.contains("Carlos").parents("tr").find("button").click();
    cy.contains("Edit Customer");
  });

  it("Displays an empty form when clicking on Add button", () => {
    cy.visit("/admin/customers");
    cy.get("button").first().click();
    cy.contains("New Customer");
    cy.get('input[name="name"]').should("have.value", "");
    cy.get('input[name="address"]').should("have.value", "");
    cy.get('input[name="postcode"]').should("have.value", "");
    cy.get('input[name="email"]').should("have.value", "");
  });

  it("Displays the selected user in the edit form when clicking the edit button", () => {
    cy.visit("/admin/customers");
    cy.contains("Carlos").parents("tr").find("button").click();
    cy.contains("Carlos");
    cy.contains("123 Fake St");
    cy.contains("2005");
    cy.contains("+54321");
    cy.contains("carlos@fake.com");
  });

  it("Creates a new user when submitting the creation form", () => {
    cy.visit("/admin/customers");
    cy.get("button").first().click();
    cy.get('input[name="name"]').type("Pedro");
    cy.get('input[name="address"]').type("2 Tilling Green");
    cy.get('input[name="postcode"]').type("LU65SW");
    cy.get('input[name="email"]').type("pedro@email.com");
    cy.get("button").contains("Submit").click();
    cy.contains("Pedro");
  });

  it("Updates an user when submitting the edition form", () => {
    cy.visit("/admin/customers");
    cy.contains("Amalia Rosso").parents("tr").find("button").click();
    const postCodeField = cy.get('input[id="postcode"]');
    postCodeField.clear();
    postCodeField.type("NEW PC");
    cy.get("button").contains("Update").click();
    cy.contains("NEW PC");
  });
});
