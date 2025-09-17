import { AddressSelector } from "./AddressSelector";
import { customerFactory } from "../../factories/customers";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../theme";
import * as mockCustomersHook from "../../hooks/Customers/useCustomers";

describe("AddressSelector", () => {
  const customers = [
    customerFactory.build({
      name: "John Doe",
      address: "1 High St",
      postcode: "W1A 0AX",
    }),
    customerFactory.build({
      name: "Jane Smith",
      address: "2 Oak Ave",
      postcode: "SW1A 1AA",
    }),
  ];

  beforeEach(() => {
    cy.stub(mockCustomersHook, "useCustomers").returns({ customers });
  });
  const mountAddressSelector = () => {
    const onSelectAddress = cy.stub().as("onSelectAddress");

    cy.mount(
      <ThemeProvider theme={theme}>
        <AddressSelector onSelectAddress={onSelectAddress} />
      </ThemeProvider>
    );

    return { onSelectAddress };
  };

  it("renders the Autocomplete and attempts to fetch customers", () => {
    mountAddressSelector();

    cy.findByLabelText(/select customer/i).click();
    cy.get('[role="option"]').should("have.length", 2);
    cy.get('[role="option"]').first().should("contain.text", "John Doe");
  });

  // it("updates the address and postcode fields when a customer is selected", () => {
  //   const customer = customerFactory.build();
  //   cy.intercept("/api/customers?take=10&skip=0", {
  //     body: { data: [customer], total: 1 },
  //   }).as("fetchCustomers");

  //   mountAddressSelector();
  //   cy.wait("@fetchCustomers");

  //   cy.findByLabelText(/select customer/i).click();
  //   cy.get('[role="option"]').contains(customer.name).click();

  //   cy.findByLabelText(/address/i).should("have.value", customer.address);
  //   cy.findByLabelText(/postcode/i).should("have.value", customer.postcode);
  // });

  // it("calls onSelectAddress with the selected customer when Next is clicked", () => {
  //   const customer = customerFactory.build();
  //   const { onSelectAddress } = mountAddressSelector();
  //   cy.intercept("/api/customers?take=10&skip=0", {
  //     body: { data: [customer], total: 1 },
  //   }).as("fetchCustomers");
  //   cy.wait("@fetchCustomers");

  //   cy.findByLabelText(/select customer/i).click();
  //   cy.get('[role="option"]').contains(customer.name).click();
  //   cy.findByRole("button", { name: /next/i }).should("not.be.disabled");
  //   cy.findByRole("button", { name: /next/i }).click();

  //   cy.get("@onSelectAddress").should("have.been.calledOnceWith", customer);
  // });

  // it("disables the Next button initially", () => {
  //   mountAddressSelector();
  //   cy.findByRole("button", { name: /next/i }).should("be.disabled");
  // });

  // it("enables the Next button when a customer is selected", () => {
  //   const customer = customerFactory.build();
  //   cy.intercept("/api/customers?take=10&skip=0", {
  //     body: { data: [customer], total: 1 },
  //   }).as("fetchCustomers");

  //   mountAddressSelector();
  //   cy.wait("@fetchCustomers");

  //   cy.findByLabelText(/select customer/i).click();
  //   cy.get('[role="option"]').contains(customer.name).click();
  //   cy.findByRole("button", { name: /next/i }).should("not.be.disabled");
  // });

  // it("disables the Next button when the selected customer is cleared", () => {
  //   const customer = customerFactory.build();
  //   cy.intercept("/api/customers?take=10&skip=0", {
  //     body: { data: [customer], total: 1 },
  //   }).as("fetchCustomers");

  //   mountAddressSelector();
  //   cy.wait("@fetchCustomers");

  //   cy.findByLabelText(/select customer/i).click();
  //   cy.get('[role="option"]').contains(customer.name).click();
  //   cy.findByRole("button", { name: /next/i }).should("not.be.disabled");
  //   cy.findByLabelText(/select customer/i).type("{backspace}{backspace}"); // Clear the input
  //   cy.findByRole("button", { name: /next/i }).should("be.disabled");
  //   cy.findByLabelText(/address/i).should("have.value", "");
  //   cy.findByLabelText(/postcode/i).should("have.value", "");
  // });

  // it("filters customer options based on input", () => {
  //   const customer1 = customerFactory.build({
  //     name: "John Doe",
  //     address: "1 Main St",
  //   });
  //   const customer2 = customerFactory.build({
  //     name: "Jane Smith",
  //     address: "2 Oak Ave",
  //   });
  //   cy.intercept("/api/customers?take=10&skip=0", {
  //     body: { data: [customer1, customer2], total: 2 },
  //   }).as("fetchCustomers");

  //   mountAddressSelector();
  //   cy.wait("@fetchCustomers");

  //   cy.findByLabelText(/select customer/i).type("John");
  //   cy.get('[role="listbox"]').should("be.visible");
  //   cy.get('[role="option"]').should("have.length", 1);
  //   cy.get('[role="option"]').should("contain.text", "John Doe");

  //   cy.findByLabelText(/select customer/i)
  //     .clear()
  //     .type("Oak");
  //   cy.get('[role="listbox"]').should("be.visible");
  //   cy.get('[role="option"]').should("have.length", 1);
  //   cy.get('[role="option"]').should("contain.text", "2 Oak Ave");
  // });

  // it("displays empty address and postcode when no customer is selected", () => {
  //   mountAddressSelector();
  //   cy.findByLabelText(/address/i).should("have.value", "");
  //   cy.findByLabelText(/postcode/i).should("have.value", "");
  // });
});
