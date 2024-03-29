import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Customer } from "../../types/types";
import { CustomersTable } from "./CustomersTable";

describe("CustomerTable", () => {
  // Semana que viene: arreglar este test
  it("calls onEdit when clicking a Edit button", () => {
    const customers: Customer[] = [
      {
        id: "abcd",
        name: "Carlos",
        address: "123 Fake St",
        postcode: "2005",
        mainTelephone: "+12345",
        secondTelephone: "+54321",
        email: "carlos@fake.com",
        slug: "carlos",
      },
    ];
    cy.mount(
      <MemoryRouter initialEntries={["/customersTable"]}>
        <Routes>
          <Route
            path="/customersTable"
            element={<CustomersTable customers={customers} />}
          />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("edit customer").click();
    cy.get("@editHandler").should("have.been.called");
  });

  it("displays an empty table when the customers list is empty", () => {
    const customers: Customer[] = [];
    cy.mount(<CustomersTable customers={customers} />);
    cy.findByRole("table").should("exist");
  });
});
