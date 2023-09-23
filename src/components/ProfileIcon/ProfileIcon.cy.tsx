import { AuthContextData, AuthContext } from "../../context/AuthContext";

import { CognitoUserWithAttributes } from "../../services/authentication";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { ProfileIcon } from "./ProfileIcon";

describe("ProfileIcon", () => {
  const setup = (name?: string, email?: string) => {
    const user: CognitoUserWithAttributes = new CognitoUser({
      Username: "test",
      Pool: new CognitoUserPool({
        UserPoolId: "eu-west-1_test",
        ClientId: "test",
      }),
    });

    user.attributes = {};
    if (name) {
      user.attributes.name = name;
    }
    if (email) {
      user.attributes.email = email;
    }

    const value: AuthContextData = {
      user,
      authStatus: "authenticated",
      logOut: cy.stub(),
      logIn: cy.stub(),
      isInGroup: cy.stub().returns(true),
    };

    cy.mount(
      <AuthContext.Provider value={value}>
        <ProfileIcon />
      </AuthContext.Provider>
    );
  };

  it("show first letter in Capital when the user has name but no email", () => {
    setup("Pedro");
    cy.contains("P");
  });

  it("show first letter in capital when the user has email but no name", () => {
    setup(undefined, "pedro@ho.com");
    cy.contains("P");
  });

  it("show first letter of name in capital when the user has both name and email", () => {
    setup("camilo", "email@h.com");
    cy.contains("C");
  });
});
