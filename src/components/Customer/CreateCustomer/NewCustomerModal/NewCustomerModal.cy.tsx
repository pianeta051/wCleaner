import { NewCustomerModal } from "./NewCustomerModal";

describe("NewCustomerModal", () => {
  it("calls onSubmit when submitting the form", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={true}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.findByLabelText("name *").type("carlos");
    cy.findByLabelText("email *").type("some@email.com");
    cy.findByText("Save").click();
    cy.get("@submitHandler").should("have.been.calledWith", {
      name: "carlos",
      address: "",
      postcode: "",
      mainTelephone: "",
      secondTelephone: "",
      email: "some@email.com",
      id: 4,
      url: "some",
    });
  });

  it("shows the form when open is true", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={true}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.findByText("New Customer");
    cy.findByText("Save");
  });

  it("does not show the form when open is false", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={false}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.contains("button", "Save").should("not.exist");
  });

  it("calls onClose when the cancel button is clicked", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={true}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.findByText("Cancel").click();
    cy.get("@closeHandler").should("have.been.called");
  });

  it("calls onClose when there's a click outside the form", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={true}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.get("body").click(0, 0);
    cy.get("@closeHandler").should("have.been.called");
  });
});
