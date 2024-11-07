import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../../../theme";
import { API } from "aws-amplify";
import { customerFactory } from "../../../../factories/customers";
import { Customers } from "./Customers";
import { CustomerFormValues } from "../../../../components/Customer/CustomerForm/CustomerForm";
import { NewCustomerModal } from "../../../../components/Customer/CreateCustomer/NewCustomerModal/NewCustomerModal";
import { contains } from "cypress/types/jquery";

const mountComponent = () => {
  cy.mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={["/customers"]}>
        <Routes>
          <Route path="customers" element={<Customers />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};
// const mountNewCustomerComponent = ()=>{
//    cy.mount(
//      <ThemeProvider theme={theme}>
//          <MemoryRouter initialEntries={["/customers"]}>
//            <Routes>
//              <Route
//                path="customers"
//                element={
//                  <NewCustomerModal
//                    onSubmit={cy.spy().as("submitHandler")}
//                    open={true}
//                    onClose={cy.spy().as("closeHandler")}
//                  />
//                }
//              />
//            </Routes>
//          </MemoryRouter>
//      </ThemeProvider>
//    );
// }

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

  it("adds a customer to the list after creating it", () => {
    const customer = customerFactory.build();
    const customers = customerFactory.buildList(2);
    cy.stub(API, "get").resolves({
      customers,
    });
    const formValues: CustomerFormValues = {
      ...customer,
    };
    cy.stub(API, "post").resolves({
      customer,
    });
    mountComponent();
    cy.contains("New customer").click();
    cy.findByLabelText("name *").type(formValues.name);
    cy.findByLabelText("address *").type(formValues.address);
    cy.findByLabelText("postcode *").type(formValues.postcode);
    cy.findByLabelText("email *").type(formValues.email);
    cy.findByText("Save").click();
    cy.contains(formValues.name);
  });

  it("updates the customer address in the list after successfully changing it", () => {
    const customers = customerFactory.buildList(2);
    const customer = customers[0];
    cy.stub(API, "get").resolves({
      customers,
    });

    cy.stub(API, "put").resolves({
      customer: {
        ...customer,
        name: "other name",
      },
    });
    mountComponent();
    cy.contains(customers[0].name)
      .get(`[aria-label="edit customer"]`)
      .eq(0)
      .click();
    cy.findByLabelText("name *").clear();
    cy.findByLabelText("name *").type("other name");
    cy.findByText("Save").click();
    cy.contains("other name");
  });

  it("removes a customer from the list after deleting it", () => {
    const customers = customerFactory.buildList(2);
    const customer = customers[0];
    cy.stub(API, "get").resolves({
      customers,
    });

    cy.stub(API, "del").resolves({
      customer,
    });
    mountComponent();
    cy.contains(customers[0].name)
      .get(`[aria-label="edit customer"]`)
      .eq(0)
      .click();
    cy.findByText("Delete").click();
    cy.findByRole("dialog").within(() => {
      cy.findByRole("button", { name: /AGREE/i }).click();
    });
    cy.contains(customer.name).should("not.exist");
  });
});
