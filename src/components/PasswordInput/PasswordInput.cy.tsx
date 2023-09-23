import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("calls onChange when change a textfield", () => {
    cy.mount(<PasswordInput onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Password").type("pass");
    cy.get("@changeHandler").should("have.been.calledWith", "pass");
  });

  it("display value in textfield when value is defined", () => {
    cy.mount(
      <PasswordInput
        value={"password"}
        onChange={cy.spy().as("changeHandler")}
      />
    );
    cy.findByLabelText("Password").should("have.value", "password");
  });

  // Hacer para la semana que viene

  it("shows a custom label when label has a value", () => {
    cy.mount(<PasswordInput label="dummy label" />);
    cy.findByLabelText("dummy label").should("exist");
  });

  it("shows the label 'Password' when label is undefined", () => {
    cy.mount(<PasswordInput />);
    cy.findByLabelText("Password").should("exist");
  });

  it("show text with restriction when showRestrictions is true", () => {
    cy.mount(<PasswordInput showRestrictions />);
    cy.findByLabelText("Password").type("p");
    cy.contains("Password must contain");
  });

  it("do not show text with restriction when showRestrictions is false", () => {
    cy.mount(<PasswordInput showRestrictions={false} />);
    cy.findByLabelText("Password").type("p");
    cy.findByText("Password must contain").should("not.exist");
  });

  it("do not show text with restriction when showRestrictions is undefined", () => {
    cy.mount(<PasswordInput />);
    cy.findByLabelText("Password").type("p");
    cy.findByText("Password must contain").should("not.exist");
  });
});
