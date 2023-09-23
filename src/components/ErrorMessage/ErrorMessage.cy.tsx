import { ErrorMessage } from "./ErrorMessage";
describe("ErrorMessage", () => {
  it("renders `User already exists!` when the code is DUPLICATED_USER.", () => {
    cy.mount(<ErrorMessage code={"DUPLICATED_USER"} />);
    cy.findByText("User already exists!");
  });

  it("renders Internal error when code is INTERNAL_ERROR", () => {
    cy.mount(<ErrorMessage code={"INTERNAL_ERROR"} />);
    cy.findByText("Internal error");
  });
});
