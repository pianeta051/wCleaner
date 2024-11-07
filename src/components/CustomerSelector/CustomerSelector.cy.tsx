import { ThemeProvider } from "styled-components";
import { customerFactory } from "../../factories/customers";
import { CustomerSelector } from "./CustomerSelector";
import { API } from "aws-amplify";

describe("CustomerSelector Component", () => {
  let customer1: {
      id: any;
      name: any;
      address: any;
      postcode: any;
      mainTelephone: any;
      secondTelephone: any;
      email: any;
      slug: any;
    },
    customer2: {
      address: any;
      postcode: any;
      name?: string;
      mainTelephone?: string;
      secondTelephone?: string;
      email?: string;
      id?: string;
      slug?: string;
    };

  beforeEach(() => {
    // Generate customers dynamically using customerFactory
    customer1 = customerFactory.build({
      name: "John Doe",
      address: "123 Main St",
    });
    customer2 = customerFactory.build({
      name: "Jane Smith",
      address: "456 Elm St",
    });

    // Mount the component with an initial onSelectCustomer spy
    cy.mount(
      <CustomerSelector onSelectCustomer={cy.spy().as("onSelectCustomer")} />
    );
  });

  context("Normal functionality", () => {
    beforeEach(() => {
      // Mock the customer data to return factory-generated customers
      //   cy.stub(customers, "useCustomers").returns({
      //     customers: [customer1, customer2],
      //   });
      const customers = customerFactory.buildList(5);
      cy.stub(API, "get").resolves({
        customers,
      });
    });

    it("displays customer options in the autocomplete dropdown", () => {
      cy.get('input[aria-label="Select Customer"]').type("John");
      cy.contains("John Doe").should("be.visible");
      cy.contains("Jane Smith").should("be.visible");
    });

    it("suggests customer options based on name in search", () => {
      cy.get('input[aria-label="Select Customer"]').type("John");
      cy.contains("John Doe").should("be.visible");
      cy.contains("Jane Smith").should("not.exist");
    });

    it("suggests customer options based on address in search", () => {
      cy.get('input[aria-label="Select Customer"]').type("456 Elm St");
      cy.contains("Jane Smith").should("be.visible");
      cy.contains("John Doe").should("not.exist");
    });

    it("updates selectedCustomer and enables button on selection", () => {
      cy.get('input[aria-label="Select Customer"]').type("Jane");
      cy.contains("Jane Smith").click();

      cy.get('input[aria-label="Address"]').should(
        "have.value",
        customer2.address
      );
      cy.get('input[aria-label="Postcode"]').should(
        "have.value",
        customer2.postcode
      );
      cy.get("button").contains("Next").should("not.be.disabled");
    });

    it("disables button when no customer is selected", () => {
      cy.get('input[aria-label="Select Customer"]').clear();
      cy.get("button").contains("Next").should("be.disabled");
    });

    it("calls onSelectCustomer when Next button is clicked with a selected customer", () => {
      cy.get('input[aria-label="Select Customer"]').type("John");
      cy.contains("John Doe").click();
      cy.get("button").contains("Next").click();

      cy.get("@onSelectCustomer").should("have.been.calledOnceWith", {
        id: customer1.id,
        name: customer1.name,
        address: customer1.address,
        postcode: customer1.postcode,
        mainTelephone: customer1.mainTelephone,
        secondTelephone: customer1.secondTelephone,
        email: customer1.email,
        slug: customer1.slug,
      });
    });
  });

  context("Error and Edge Cases", () => {
    it("displays no options when customer list is empty", () => {
      // Mock useCustomers to return an empty customer list
      cy.stub("useCustomers").returns({
        customers: [],
      });

      cy.get('input[aria-label="Select Customer"]').type("John");
      cy.contains("No customers found").should("be.visible");
      cy.get("button").contains("Next").should("be.disabled");
    });

    it("handles customer retrieval failure gracefully", () => {
      // Mock useCustomers to simulate a retrieval error
      cy.stub("useCustomers").throws(new Error("Failed to load customers"));

      cy.get('input[aria-label="Select Customer"]').type("John");
      cy.contains("Failed to load customers").should("be.visible");
      cy.get("button").contains("Next").should("be.disabled");
    });

    it("disables button and clears input when an invalid customer is selected and then cleared", () => {
      cy.get('input[aria-label="Select Customer"]').type("Invalid Name");
      cy.get('input[aria-label="Select Customer"]').clear();
      cy.get("button").contains("Next").should("be.disabled");
      cy.get('input[aria-label="Address"]').should("have.value", "");
      cy.get('input[aria-label="Postcode"]').should("have.value", "");
    });

    it("shows no suggestions if user enters special characters that don’t match any customer", () => {
      cy.get('input[aria-label="Select Customer"]').type("@#$%^&*");
      cy.contains("No options").should("be.visible");
      cy.get("button").contains("Next").should("be.disabled");
    });

    it("allows re-selection of a different customer after initial selection", () => {
      cy.get('input[aria-label="Select Customer"]').type("John");
      cy.contains("John Doe").click();
      cy.get('input[aria-label="Select Customer"]').clear().type("Jane");
      cy.contains("Jane Smith").click();

      cy.get('input[aria-label="Address"]').should(
        "have.value",
        customer2.address
      );
      cy.get('input[aria-label="Postcode"]').should(
        "have.value",
        customer2.postcode
      );
      cy.get("button").contains("Next").should("not.be.disabled");
    });
  });
});
