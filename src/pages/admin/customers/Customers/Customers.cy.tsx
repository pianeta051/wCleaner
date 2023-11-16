import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { CustomersProvider } from "../../../../components/CustomersProvider/CustomersProvider";
import { theme } from "../../../../theme";
import { API } from "aws-amplify";
import { customerFactory } from "../../../../factories/customers";
import { Customers } from "./Customers";

const mountComponent = () => {
  cy.mount(
    <ThemeProvider theme={theme}>
      <CustomersProvider>
        <MemoryRouter initialEntries={["/customers"]}>
          <Routes>
            <Route path="customers" element={<Customers />} />
          </Routes>
        </MemoryRouter>
      </CustomersProvider>
    </ThemeProvider>
  );
};

describe("CustomersPage", () => {
  it("Display a list of existing customers", () => {
    const customers = customerFactory.buildList(5);
    cy.stub(API, "get").resolves({
      customers,
    });
    mountComponent();
    for (const customer of customers) {
      cy.contains(customer.name);
    }
  });

  it("Displays No Customers message when the customers list is empty", () => {
    cy.stub(API, "get").resolves({
      customers: [],
    });
    mountComponent();
    cy.contains("No customers found");
  });

  it("Displays an error message if some of the customers is not valid", () => {
    const invalidCustomer = {
      id: "1",
      surname: "Candon",
    };
    cy.stub(API, "get").resolves({
      customers: [invalidCustomer],
    });
    mountComponent();
    cy.contains("Internal error");
  });

  it("Displays the Load More button when there is a nextToken available", () => {
    const customers = customerFactory.buildList(5);
    cy.stub(API, "get").resolves({
      customers,
      nextToken: "next custumers",
    });
    mountComponent();
    cy.contains("Load more");
  });

  it("Display the second page of Customer when clicking the Load More button", () => {
    const customersFirstPage = customerFactory.buildList(5);
    const customersSecondPage = customerFactory.buildList(4);
    cy.stub(API, "get")
      .onFirstCall()
      .resolves({
        customers: customersFirstPage,
        nextToken: "next customers",
      })
      .onSecondCall()
      .resolves({
        customers: customersSecondPage,
      });
    mountComponent();

    for (const customer of customersFirstPage) {
      cy.contains(customer.name);
    }
    for (const customer of customersSecondPage) {
      cy.contains(customer.name).should("not.exist");
    }
    cy.contains("Load more").click();

    for (const customer of customersFirstPage) {
      cy.contains(customer.name);
    }
    for (const customer of customersSecondPage) {
      cy.contains(customer.name);
    }
  });

  it("adds a customer to the list after creating it", () => {});

  it("updates the customer address in the list after successfully changing it", () => {});

  it("removes a customer from the list after deleting it", () => {});
});
