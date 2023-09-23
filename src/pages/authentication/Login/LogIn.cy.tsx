import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Auth } from "aws-amplify";

const logInWith = (error: { code: string; message?: string }) => {
  cy.stub(Auth, "signIn").rejects(error);
  cy.mount(
    <MemoryRouter initialEntries={["/log-in"]}>
      <Routes>
        <Route path="/log-in" element={<Login />} />
      </Routes>
    </MemoryRouter>
  );
  cy.findByLabelText("Email *").type("user@email.com");
  cy.findByLabelText("Password *").type("myfakepassword");
  cy.findByText("Log in").click();
};

describe("LogIn", () => {
  it("redirects to set-password when the user logs in for the first time", () => {
    cy.stub(Auth, "signIn").as("logIn").resolves({
      challengeName: "NEW_PASSWORD_REQUIRED",
    });
    cy.mount(
      <MemoryRouter initialEntries={["/log-in"]}>
        <Routes>
          <Route path="/log-in" element={<Login />} />
          <Route
            path="/set-password"
            element={<div>Dummy set password page</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Email *").type("user@email.com");
    cy.findByLabelText("Password *").type("myfakepassword");
    cy.findByText("Log in").click();
    cy.contains("Dummy set password page");
  });

  it("redirects to customers page when the user logs in and its not the first time", () => {
    cy.stub(Auth, "signIn").as("logIn").resolves({
      challengeName: "OTHEROPTION",
    });
    cy.mount(
      <MemoryRouter initialEntries={["/log-in"]}>
        <Routes>
          <Route path="/log-in" element={<Login />} />
          <Route path="/admin/customers" element={<div>Customers page</div>} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Email *").type("user@email.com");
    cy.findByLabelText("Password *").type("myfakepassword");
    cy.findByText("Log in").click();
    cy.contains("Customers page");
  });

  it("shows an error when the request fails", () => {
    cy.stub(Auth, "signIn").as("logIn").rejects();
    cy.mount(
      <MemoryRouter initialEntries={["/log-in"]}>
        <Routes>
          <Route path="/log-in" element={<Login />} />
          <Route path="/admin/customers" element={<div>Customers page</div>} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Email *").type("user@email.com");
    cy.findByLabelText("Password *").type("myfakepassword");
    cy.findByText("Log in").click();
    cy.contains("Internal error");
  });

  it("shows an error message when the user does not exist", () => {
    logInWith({ code: "UserNotFoundException" });
    cy.contains("The email is not registered.");
    cy.contains("Please contact the system administrator");
  });

  it("shows an error message when the user pasword is invalid", () => {
    logInWith({ code: "NotAuthorizedException" });
    cy.contains("Your password is not correct");
  });

  it("shows an error message when the user try inserter a password too many times ", () => {
    logInWith({
      code: "NotAuthorizedException",
      message: "Password attempts exceeded",
    });
    cy.contains("You tried this too many times.");
    cy.contains("Please try again later.");
  });

  it("shows an internal when the server is down", () => {
    logInWith({ code: "Anything" });
    cy.contains("Internal error");
  });
});
