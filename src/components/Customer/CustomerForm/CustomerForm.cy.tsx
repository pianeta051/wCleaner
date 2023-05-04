import { CustomerForm, CustomerFormValues } from "./CustomerForm";

describe("CustomerForm", () => {
  it("calls onSubmit when clicking a send button", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        errorMessage={null}
      />
    );
    cy.findByLabelText("name *").type("carlos");
    cy.findByLabelText("email *").type("carlos@email.com");
    cy.findByText("Save").click();
    cy.get("@submitHandler").should("have.been.calledWith", {
      name: "carlos",
      address: "",
      postcode: "",
      mainTelephone: "",
      secondTelephone: "",
      email: "carlos@email.com",
    });
  });

  it("calls onSubmit when pressing intro in a text input", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        errorMessage={null}
      />
    );
    cy.findByLabelText("name *").type("carlos");
    cy.findByLabelText("email *").type("carlos@email.com{enter}");

    cy.get("@submitHandler").should("have.been.calledWith", {
      name: "carlos",
      address: "",
      postcode: "",
      mainTelephone: "",
      secondTelephone: "",
      email: "carlos@email.com",
    });
  });

  it("calls OnCancel when clicking on cancel button", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        onCancel={cy.spy().as("cancelHandler")}
        errorMessage={null}
      />
    );
    cy.findByText("Cancel").click();
    cy.get("@cancelHandler").should("have.been.called");
  });

  it("displays the values in the form when initialValues is defined", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        onCancel={cy.spy().as("closeHandler")}
        errorMessage={null}
        initialValues={{
          name: "carlos",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "some@email.com",
        }}
      />
    );
    cy.findByLabelText("name *").should("have.value", "carlos");
    cy.findByLabelText("email *").should("have.value", "some@email.com");
  });

  it("displays an empty form when initialValues is empty", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        onCancel={cy.spy().as("closeHandler")}
        errorMessage={null}
        initialValues={{
          name: "",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
        }}
      />
    );
    cy.findByLabelText("name *").should("have.value", "");
    cy.findByLabelText("address").should("have.value", "");
    cy.findByLabelText("postcode").should("have.value", "");
    cy.findByLabelText("main telephone").should("have.value", "");
    cy.findByLabelText("second telephone").should("have.value", "");
    cy.findByLabelText("email *").should("have.value", "");
  });

  it("does not render an error message when errorMessage is null", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        onCancel={cy.spy().as("closeHandler")}
        errorMessage={null}
        initialValues={{
          name: "carlos",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
        }}
      />
    );
    cy.findByRole("alert").should("not.exist");
  });

  it("renders an error message when errorMessage is not null", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        onCancel={cy.spy().as("closeHandler")}
        errorMessage={"USER_NOT_EXISTS"}
        initialValues={{
          name: "carlos",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
        }}
      />
    );
    cy.findByRole("alert").contains(
      "The email is not registered. Please contact the system administrator"
    );
  });

  it("displays a spinner when loading is true", () => {
    cy.mount(
      <CustomerForm
        loading={true}
        onSubmit={cy.spy().as("submitHandler")}
        errorMessage={null}
      />
    );
    cy.findByRole("progressbar");
  });

  it("displays a save button when loading is false", () => {
    cy.mount(
      <CustomerForm
        loading={false}
        onSubmit={cy.spy().as("submitHandler")}
        errorMessage={null}
      />
    );
    cy.contains("Save");
  });

  it("displays a save button when loading is undefined", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        errorMessage={null}
      />
    );
    cy.contains("Save");
  });
});
