import { Auth } from "aws-amplify";
import { ForgotMyPassword } from "./ForgotMyPassword";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ResetPassword } from "../ResetPassword/ResetPassword";

describe("ForgotMyPassword", () => {
  it("shows a success message when the operation is successful", () => {
    cy.stub(Auth, "forgotPassword").resolves();
    cy.mount(
      <MemoryRouter initialEntries={["/forgotPassword"]}>
        <Routes>
          <Route path="forgotPassword" element={<ForgotMyPassword />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Email address *").type("c@email.com{enter}");
    cy.contains("We've sent you an email");
    cy.contains("Check your inbox to reset your password");
  });
  it("render an error message when the operation is not successful", () => {
    cy.stub(Auth, "forgotPassword").rejects();
    cy.mount(
      <MemoryRouter initialEntries={["/forgotPassword"]}>
        <Routes>
          <Route path="forgotPassword" element={<ForgotMyPassword />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Email address *").type("c@email.com{enter}");
    cy.contains("Internal error");
  });
});
