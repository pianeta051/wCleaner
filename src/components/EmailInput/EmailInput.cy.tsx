import { EmailInput } from "./EmailInput";

describe("EmailInput", () => {
  it("calls onChange when the user types", () => {
    cy.mount(<EmailInput onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Email *").type("hello");
    cy.get("@changeHandler")
      .its("firstCall.args.0")
      .its("target")
      .should("have.value", "hello");
  });

  it("display value when it is defined ", () => {
    cy.mount(
      <EmailInput value={"pepe"} onChange={cy.spy().as("changeHandler")} />
    );
    cy.findByLabelText("Email *").should("have.value", "pepe");
  });

  it("display value when it is not defined ", () => {
    cy.mount(<EmailInput onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Email *").should("have.value", "");
  });
});
