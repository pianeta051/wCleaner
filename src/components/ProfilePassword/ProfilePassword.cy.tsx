import { ProfilePassword } from "./ProfilePassword";

describe("ProfilePassword", () => {
  it("calls onChange when clicking on save button", () => {
    cy.mount(<ProfilePassword onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Current password").type("password");
    cy.findByLabelText("New password").type("newPassword1?");
    cy.get("button[type=submit]").as("submitBtn").click();
    cy.get("@changeHandler").should("have.been.calledWith", {
      oldPassword: "password",
      newPassword: "newPassword1?",
    });
  });

  it("calls onChange when pressing enter", () => {
    cy.mount(<ProfilePassword onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Current password").type("password");
    cy.findByLabelText("New password").type("newPassword1?{enter}");

    cy.get("@changeHandler").should("have.been.called");
  });

  // Completar con tests para loading
});
