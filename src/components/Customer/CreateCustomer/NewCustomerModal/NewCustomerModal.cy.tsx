import { NewCustomerModal } from "./NewCustomerModal";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../../../theme";
import { API } from "aws-amplify";
import { customerFactory } from "../../../../factories/customers";
import { CustomerFormValues } from "../../CustomerForm/CustomerForm";

const mountComponent = () => {
  cy.mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={["/customers"]}>
        <Routes>
          <Route
            path="customers"
            element={
              <NewCustomerModal
                onSubmit={cy.spy().as("submitHandler")}
                open={true}
                onClose={cy.spy().as("closeHandler")}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe("NewCustomerModal", () => {
  it("shows the form when open is true", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={true}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.findByText("New Customer");
    cy.findByText("Save");
  });

  it("does not show the form when open is false", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={false}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.contains("button", "Save").should("not.exist");
  });

  it("calls onClose when there's a click outside the form", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={true}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.get("body").click(0, 0);
    cy.get("@closeHandler").should("have.been.called");
  });

  it("calls onClose when the cancel button is clicked", () => {
    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={true}
        onClose={cy.spy().as("closeHandler")}
      />
    );
    cy.findByText("Cancel").click();
    cy.get("@closeHandler").should("have.been.called");
  });

  // API TESTING

  it("calls onSubmit when submitting the form and the API response is successful", () => {
    const customer = customerFactory.build();
    const formValues: CustomerFormValues = {
      ...customer,
    };
    cy.stub(API, "post").resolves({
      customer,
    });
    mountComponent();
    cy.findByLabelText("name *").type(formValues.name);
    cy.findByLabelText("address *").type(formValues.address);
    cy.findByLabelText("postcode *").type(formValues.postcode);
    cy.findByLabelText("email *").type(formValues.email);
    cy.findByText("Save").click();
    cy.get("@submitHandler").should("have.been.calledWith", customer);
  });

  it("renders an error message when submitting the form and the API returns an error", () => {
    const customer = customerFactory.build();
    const formValues: CustomerFormValues = {
      ...customer,
    };
    cy.stub(API, "post").rejects();
    mountComponent();
    cy.findByLabelText("name *").type(formValues.name);
    cy.findByLabelText("address *").type(formValues.address);
    cy.findByLabelText("postcode *").type(formValues.postcode);
    cy.findByLabelText("email *").type(formValues.email);
    cy.findByText("Save").click();
    cy.get("@submitHandler").should("not.have.been.called");
    cy.contains("Internal error");
  });

  it("renders an error message when there is already a user with that email", () => {
    const customer = customerFactory.build();
    const formValues: CustomerFormValues = { ...customer };

    // Simulate a 409 conflict response (email already exists)
    cy.stub(API, "post")
      .as("apiPost")
      .rejects({
        response: {
          status: 409,
        },
      });

    cy.mount(
      <NewCustomerModal
        onSubmit={cy.spy().as("submitHandler")}
        open={true}
        onClose={cy.spy().as("closeHandler")}
      />
    );

    cy.findByLabelText("name *").type(formValues.name);
    cy.findByLabelText("address *").type(formValues.address);
    cy.findByLabelText("postcode *").type(formValues.postcode);
    cy.findByLabelText("email *").type(formValues.email);

    cy.findByText("Save").click();

    cy.get("@submitHandler").should("not.have.been.called");

    cy.contains(
      "There is an existing customer with this email. Please try with other email"
    ).should("be.visible");
  });
});
