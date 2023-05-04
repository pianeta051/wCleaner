import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("calls onChange when change a textfield", () => {
    cy.mount(<PasswordInput onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Password").type("pass");
    cy.get("@changeHandler").should("have.been.called");
  });
  it("display value in textfield when value is defined", () => {
    cy.mount(
      <PasswordInput
        value={"password"}
        onChange={cy.spy().as("changeHandler")}
      />
    );
    cy.findByLabelText("********").should("be.visible");
  });
});
