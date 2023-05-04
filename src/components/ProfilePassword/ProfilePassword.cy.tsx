import { ProfilePassword } from "./ProfilePassword";

describe("ProfilePassword", () => {
  it("calls onChange when clicking on save button", () => {
    cy.mount(<ProfilePassword onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Current password").type("password");
    cy.findByLabelText("New password").type("password");
    cy.get("button[type=submit]").as("submitBtn").click();
    cy.get("@changeHandler").should("have.been.called");
  });

  it("calls onChange when pressing enter", () => {
    cy.mount(<ProfilePassword onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Current password").type("password");
    cy.findByLabelText("New password").type("password{enter}");

    cy.get("@changeHandler").should("have.been.called");
  });
});
