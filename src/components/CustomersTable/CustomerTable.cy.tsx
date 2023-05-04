import { Customer } from "../../types/types";
import { CustomersTable } from "./CustomersTable";

describe("CustomerTable", () => {
  // Semana que viene: arreglar este test
  it("calls onEdit when clicking a Edit button", () => {
    const customers: Customer[] = [
      {
        id: 1,
        name: "Carlos",
        address: "123 Fake St",
        postcode: "2005",
        mainTelephone: "+12345",
        secondTelephone: "+54321",
        email: "carlos@fake.com",
        url: "carlos",
      },
    ];
    cy.mount(
      <CustomersTable
        onEdit={cy.spy().as("editHandler")}
        customers={customers}
      />
    );
    cy.findByText("Edit").click();
    cy.get("@editHandler").should("have.been.called");
  });

  it("displays an empty table when the customers list is empty", () => {
    const customers: Customer[] = [];
    cy.mount(
      <CustomersTable
        onEdit={cy.spy().as("editHandler")}
        customers={customers}
      />
    );
    cy.contains(".selector", "Edit").should("not.exist");
  });
});
