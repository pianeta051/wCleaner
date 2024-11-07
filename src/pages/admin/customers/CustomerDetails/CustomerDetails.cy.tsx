import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CustomerDetails } from "./CustomerDetails";

import { customerFactory } from "../../../../factories/customers";
import { API } from "aws-amplify";

describe("CustomerDetails", () => {
  it("renders 404 page when the URL parameter url is not defined", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/customers/amalia"]}>
        <Routes>
          <Route path="/customers/:incorrect" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("404 Page Not Found");
  });

  it("renders customer details  when the URL parameter is defined with a existing customer", () => {
    const customer = customerFactory.build();
    cy.stub(API, "get").resolves({
      customer,
    });
    cy.mount(
      <MemoryRouter initialEntries={[`/customers/${customer.slug}`]}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    cy.findByDisplayValue(customer.name);
  });

  it("renders 404 page when the URL parameter is defined with a not exiting customer", () => {
    cy.stub(API, "get").rejects({ response: { status: 404 } });
    cy.mount(
      <MemoryRouter initialEntries={["/customers/not-existent"]}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("404 Page Not Found");
  });
});
