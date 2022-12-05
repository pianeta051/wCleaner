describe("LogIn page", () => {
  it("Display empty authentication form when visit log-in page", () => {
    cy.visit("/log-in");
    const userName = cy.get('input[name="email"]');
    const password = cy.get('input[name="password"]');
    userName.should("have.value", "");
    password.should("have.value", "");
  });

  it("Redirect dashboard page when login is correct", () => {
    cy.visit("/log-in");
    cy.get('input[name="email"]').type("carlos@email.com");
    cy.get('input[name="password"]').type("1234");
    cy.get("button[type=submit]").as("log in").click();
    cy.url().should("contain", "customers");
  });

  it("Redirect forgot password page when click forgot-password button", () => {
    cy.visit("/log-in");
    cy.contains("Forgot password ?").click();
    cy.url().should("contain", "forgot-password");
  });
});
