import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ResetPassword } from "./ResetPassword";
import { Auth } from "aws-amplify";

describe("ResetPassword", () => {
  it("display an error message when email parameter is not set", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/reset-password?code=1234"]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("This Reset password link in invalid.");
  });

  it("display an error message when code parameter is not set", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/reset-password?email=a@p.co"]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("This Reset password link in invalid.");
  });

  it("display a form when  email and code parameters are set", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/reset-password?email=a@p.co&code=1234"]}>
        <Routes>
          <Route path="reset-password" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Reset Password");
  });

  it("redirects to log in when reset password is successful", () => {
    cy.stub(Auth, "forgotPasswordSubmit").resolves();
    cy.mount(
      <MemoryRouter initialEntries={["/reset-password?email=a@p.co&code=1234"]}>
        <Routes>
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="log-in" element={<div>Success</div>} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("New Password").type("Maaaaaaa2?{enter}");
    cy.contains("Success");
  });

  it("renders an error when reset password has an error", () => {
    cy.stub(Auth, "forgotPasswordSubmit").rejects();
    cy.mount(
      <MemoryRouter initialEntries={["/reset-password?email=a@p.co&code=1234"]}>
        <Routes>
          <Route path="reset-password" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("New Password").type("Maaaaaaa2?{enter}");
    cy.contains("Internal error");
  });
});
