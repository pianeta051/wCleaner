import { CustomerForm, CustomerFormValues } from "./CustomerForm";
import {
  customerFactory,
  customerToFormValuesFactory,
} from "../../../factories/customers";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../../theme";
import { customerToFormValues } from "../../../helpers/customer";

describe("CustomerForm", () => {
  const mountCustomerForm = () => {
    const submitHandler = cy.stub().as("submitHandler");
    const cancelHandler = cy.stub().as("cancelHandler");

    cy.mount(
      <ThemeProvider theme={theme}>
        <CustomerForm onSubmit={submitHandler} onCancel={cancelHandler} />
      </ThemeProvider>
    );

    return { submitHandler, cancelHandler };
  };

  it("calls onSubmit with correct values when form is valid and Save is clicked", () => {
    const customer = customerToFormValuesFactory.build();

    mountCustomerForm();

    cy.findByLabelText(/name \*/i).type(customer.name);
    cy.findByLabelText(/address \*/i).type(customer.address);
    cy.findByLabelText(/postcode \*/i).type(customer.postcode);
    cy.findByLabelText(/email \*/i).type(customer.email);
    cy.findByLabelText(/main telephone/i).type(customer.mainTelephone);
    cy.findByLabelText(/second telephone/i).type(customer.secondTelephone);

    cy.findByRole("button", { name: /save/i }).click();

    cy.get("@submitHandler").should("have.been.calledOnce");

    cy.get("@submitHandler").should("have.been.calledWithMatch", {
      name: customer.name,
      address: customer.address,
      postcode: customer.postcode,
      email: customer.email,
      mainTelephone: customer.mainTelephone,
      secondTelephone: customer.secondTelephone,
      fileUrls: [],
    });
  });

  it("calls onSubmit when pressing intro in a text input", () => {
    const customer = customerToFormValuesFactory.build();

    mountCustomerForm();

    cy.findByLabelText(/name \*/i).type(customer.name);
    cy.findByLabelText(/address \*/i).type(customer.address);
    cy.findByLabelText(/postcode \*/i).type(customer.postcode);
    cy.findByLabelText(/email \*/i).type(customer.email);
    cy.findByLabelText(/main telephone/i).type(customer.mainTelephone);
    cy.findByLabelText(/second telephone/i).type(
      `${customer.secondTelephone}{enter}`
    );

    cy.get("@submitHandler").should("have.been.calledOnce");

    cy.get("@submitHandler").should("have.been.calledWithMatch", {
      name: customer.name,
      address: customer.address,
      postcode: customer.postcode,
      email: customer.email,
      mainTelephone: customer.mainTelephone,
      secondTelephone: customer.secondTelephone,
      fileUrls: [],
    });
  });

  it("calls OnCancel when clicking on cancel button", () => {
    mountCustomerForm();
    cy.findByText("Cancel").click();
    cy.get("@cancelHandler").should("have.been.called");
  });
  it("displays the values in the form when initialValues is defined", () => {
    const customer = customerFactory.build();
    const formValues = customerToFormValues(customer);

    cy.mount(
      <ThemeProvider theme={theme}>
        <CustomerForm
          onSubmit={cy.spy().as("submitHandler")}
          onCancel={cy.spy().as("closeHandler")}
          initialValues={formValues}
        />
      </ThemeProvider>
    );

    cy.findByLabelText("name *").should("have.value", formValues.name);
    cy.findByLabelText("email *").should("have.value", formValues.email);
  });

  it("displays an empty form when initialValues is empty", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        onCancel={cy.spy().as("closeHandler")}
        initialValues={{
          name: "",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          cleaningAddresses: [],
        }}
      />
    );
    cy.findByLabelText("name *").should("have.value", "");
    cy.findByLabelText("address *").should("have.value", "");
    cy.findByLabelText("postcode *").should("have.value", "");
    cy.findByLabelText("main telephone").should("have.value", "");
    cy.findByLabelText("second telephone").should("have.value", "");
    cy.findByLabelText("email *").should("have.value", "");
  });

  it("does not render an error message when errorMessage is null", () => {
    cy.mount(
      <CustomerForm
        onSubmit={cy.spy().as("submitHandler")}
        onCancel={cy.spy().as("closeHandler")}
        initialValues={{
          name: "carlos",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          cleaningAddresses: [],
        }}
      />
    );
    cy.findByRole("alert").should("not.exist");
  });

  it("displays a spinner when loading is true", () => {
    cy.mount(
      <CustomerForm loading={true} onSubmit={cy.spy().as("submitHandler")} />
    );
    cy.findByRole("progressbar");
  });

  it("displays a save button when loading is false", () => {
    cy.mount(
      <CustomerForm loading={false} onSubmit={cy.spy().as("submitHandler")} />
    );
    cy.contains("Save");
  });

  it("displays a save button when loading is undefined", () => {
    cy.mount(<CustomerForm onSubmit={cy.spy().as("submitHandler")} />);
    cy.contains("Save");
  });
});
