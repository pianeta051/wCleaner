import { Form } from "./Form";

// A partir de aqui no los hemos corregido

describe("Form", () => {
  it("calls onSubmit when click a submit button", () => {
    cy.mount(
      <Form onSubmit={cy.spy().as("submitHandler")}>
        <button type="submit">Send</button>
      </Form>
    );
    cy.findByRole("button").click();
    cy.get("@submitHandler").should("have.been.called");
  });
  it("calls onSubmit when pressing intro", () => {
    cy.mount(
      <Form onSubmit={cy.spy().as("submitHandler")}>
        <button type="submit">Send</button>
      </Form>
    );
    cy.get("button").type("{}");
    cy.get("@submitHandler").should("have.been.called");
  });
});
