import { CreateUserForm } from "./CreateUserForm";

describe("CreateUserForm", () => {
  it("calls onSubmit when clicking a Create button", () => {
    cy.mount(<CreateUserForm onSubmit={cy.spy().as("submitHandler")} />);
    cy.findByLabelText("Email *").type("carlos@h.com");
    cy.findByLabelText("Password *").type("password");
    cy.findByText("Create").click();
    cy.get("@submitHandler").should("have.been.calledWith", {
      email: "carlos@h.com",
      password: "password",
    });
  });

  it("calls onSubmit when pressing intro in a text input", () => {
    cy.mount(<CreateUserForm onSubmit={cy.spy().as("submitHandler")} />);
    cy.findByLabelText("Email *").type("carlos@h.com");
    cy.findByLabelText("Password *").type("password{enter}");
    cy.get("@submitHandler").should("have.been.calledWith", {
      email: "carlos@h.com",
      password: "password",
    });
  });

  it("shows a spinner when loading is true", () => {
    cy.mount(<CreateUserForm loading={true} />);
    cy.findByRole("progressbar");
  });

  it("shows a create button when loading is false", () => {
    cy.mount(<CreateUserForm loading={false} />);
    cy.findByText("Create");
  });

  it("shows a create button when loading is undefined", () => {
    cy.mount(<CreateUserForm />);
    cy.findByText("Create");
  });

  it("displays the values in the form when the initial values are provided", () => {
    cy.mount(
      <CreateUserForm
        initialValues={{ email: "carlos@h.com", password: "password" }}
      />
    );
    cy.findByLabelText("Email *").should("have.value", "carlos@h.com");
    cy.findByLabelText("Password *").should("have.value", "password");
  });

  it("displays an empty form when the initial values are undefined", () => {
    cy.mount(<CreateUserForm initialValues={undefined} />);
    cy.findByLabelText("Email *").should("have.value", "");
    cy.findByLabelText("Password *").should("have.value", "");
  });
});
