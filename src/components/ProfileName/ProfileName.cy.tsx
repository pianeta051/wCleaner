import { ProfileName } from "./ProfileName";

describe("ProfileName", () => {
  it("calls onChange when clicking on save button", () => {
    cy.mount(<ProfileName onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Name").type("Carlos");
    cy.get("button[type=submit]").as("submitBtn").click();
    cy.get("@changeHandler").should("have.been.called");
  });

  it("calls onChange when pressing enter", () => {
    cy.mount(<ProfileName onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Name").type("{enter}");
    cy.get("@changeHandler").should("have.been.called");
  });
});
