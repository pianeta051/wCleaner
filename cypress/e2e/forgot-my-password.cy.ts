describe("Forgot my password page", () => {
  it("Display empty authentication form when visit forgot-password page", () => {
    cy.visit("/forgot-password");
    const userName = cy.get('input[name="email"]');
    userName.should("have.value", "");
  });

  it("Re-direct log in page when type an correct email", () => {
    cy.visit("/forgot-password");
    cy.get('input[name="email"]').type("carlos@email.com");
    cy.get("button[type=submit]").as("Reset Password").click();
    cy.url().should("contain", "log-in");
  });

  it("Re-direct login page when click log-in button", () => {
    cy.visit("/forgot-password");
    cy.contains("Log In").click();
    cy.url().should("contain", "log-in");
  });

  it("Not Re-direct to any page when click on Reset Password button with empty value", () => {
    cy.visit("/forgot-password");
    cy.get("button[type=submit]").as("Reset Password").click();
    cy.url().should("contain", "forgot-password");
  });
});
