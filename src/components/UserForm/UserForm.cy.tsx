import { UserForm } from "./UserForm";

describe("UserForm", () => {
  it("calls onSubmit when clicking a Create button", () => {
    cy.mount(<UserForm onSubmit={cy.spy().as("submitHandler")} />);
    cy.findByLabelText("Email *").type("carlos@h.com");
    cy.findByLabelText("Password *").type("password");
    cy.findByText("Create").click();
    cy.get("@submitHandler").should("have.been.calledWith", {
      email: "carlos@h.com",
      password: "password",
    });
  });

  it("calls onSubmit when pressing intro in a text input", () => {
    cy.mount(<UserForm onSubmit={cy.spy().as("submitHandler")} />);
    cy.findByLabelText("Email *").type("carlos@h.com");
    cy.findByLabelText("Password *").type("password{enter}");
    cy.get("@submitHandler").should("have.been.calledWith", {
      email: "carlos@h.com",
      password: "password",
    });
  });

  it("shows a spinner when loading is true", () => {
    cy.mount(
      <UserForm
        loading={true}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    cy.findByRole("progressbar");
  });

  it("shows a create button when loading is false", () => {
    cy.mount(
      <UserForm
        loading={false}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    cy.findByText("Create");
  });

  it("shows a create button when loading is undefined", () => {
    cy.mount(
      <UserForm
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    cy.findByText("Create");
  });

  it("displays the values in the form when the initial values are provided", () => {
    cy.mount(
      <UserForm
        initialValues={{
          email: "carlos@h.com",
          password: "password",
          color: "#f44336",
          name: "carlos",
        }}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    cy.findByLabelText("Email *").should("have.value", "carlos@h.com");
    cy.findByLabelText("Password *").should("have.value", "password");
  });

  it("displays an empty form when the initial values are undefined", () => {
    cy.mount(
      <UserForm
        initialValues={undefined}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    cy.findByLabelText("Email *").should("have.value", "");
    cy.findByLabelText("Password *").should("have.value", "");
  });
});
