import { ProfileName } from "./ProfileName";

describe("ProfileName", () => {
  it("calls onChange when clicking on save button", () => {
    cy.mount(<ProfileName onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Name").type("Carlos");
    cy.get("button[type=submit]").as("submitBtn").click();
    cy.get("@changeHandler").should("have.been.calledWith", "Carlos");
  });

  it("calls onChange when pressing enter", () => {
    cy.mount(<ProfileName onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Name").type("{enter}");
    cy.get("@changeHandler").should("have.been.calledWith", "");
  });

  // Completar con tests para el resto de props
});
