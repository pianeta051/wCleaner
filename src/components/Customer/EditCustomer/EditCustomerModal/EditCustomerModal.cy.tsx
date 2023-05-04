import { EditCustomerModal } from "./EditCustomerModal";

describe("EditCustomerModal", () => {
  it("calls onClose when clicking on cancel button", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={true}
        onEdit={cy.spy().as("editHandler")}
        customer={{
          name: "Pepe",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          id: 0,
          url: "",
        }}
      />
    );
    cy.findByText("Cancel").click();
    cy.get("@closeHandler").should("have.been.called");
  });

  it("calls onClose when clicking outside the modal", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={true}
        onEdit={cy.spy().as("editHandler")}
        customer={{
          name: "Pepe",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          id: 0,
          url: "",
        }}
      />
    );
    cy.get("body").click(0, 0);

    cy.get("@closeHandler").should("have.been.called");
  });

  it("shows the modal when open is true", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={true}
        onEdit={cy.spy().as("editHandler")}
        customer={{
          name: "Pepe",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          id: 0,
          url: "",
        }}
      />
    );
    cy.contains("Save");
  });

  it("does not show the modal when open is false", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={false}
        onEdit={cy.spy().as("editHandler")}
        customer={{
          name: "Pepe",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          id: 0,
          url: "",
        }}
      />
    );
    cy.findByRole("form").should("not.exist");
  });

  it("shows the customer data on the form", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={true}
        onEdit={cy.spy().as("editHandler")}
        customer={{
          name: "Pepe",
          address: "84 Alcala",
          postcode: "28017",
          mainTelephone: "66254",
          secondTelephone: "",
          email: "pepe@email.com",
          id: 0,
          url: "",
        }}
      />
    );
    // cy.findByText("Pepe");
    cy.findByDisplayValue("Pepe");
    cy.findByDisplayValue("84 Alcala");
    cy.findByDisplayValue("28017");
    cy.findByDisplayValue("66254");
    cy.findByDisplayValue("pepe@email.com");
  });

  // Nota: Revisitar onEdit cuando tengamos una API
});
