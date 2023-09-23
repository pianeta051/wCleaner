import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import { AuthContext, AuthContextData } from "../context/AuthContext";
import { CognitoUserWithAttributes } from "../services/authentication";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";

describe("AdminRoute", () => {
  it("renders to admin page when user is admin", () => {
    const user: CognitoUserWithAttributes = new CognitoUser({
      Username: "test",
      Pool: new CognitoUserPool({
        UserPoolId: "eu-west-1_test",
        ClientId: "test",
      }),
    });

    const value: AuthContextData = {
      user,
      authStatus: "authenticated",
      logOut: cy.stub(),
      logIn: cy.stub(),
      isInGroup: cy.stub().returns(true),
    };

    cy.mount(
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={<AdminRoute children={<div>Admin access</div>} />}
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    cy.contains("Admin access");
  });

  it("renders to denied page when user is not admin", () => {
    const user: CognitoUserWithAttributes = new CognitoUser({
      Username: "test",
      Pool: new CognitoUserPool({
        UserPoolId: "eu-west-1_test",
        ClientId: "test",
      }),
    });

    const value: AuthContextData = {
      user,
      authStatus: "authenticated",
      logOut: cy.stub(),
      logIn: cy.stub(),
      isInGroup: cy.stub().returns(false),
    };
    cy.mount(
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={<AdminRoute children={<div>Admin access</div>} />}
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    cy.contains("Access denied");
  });
});
