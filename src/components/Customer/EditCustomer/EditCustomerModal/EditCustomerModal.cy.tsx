import { EditCustomerModal } from "./EditCustomerModal";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { CustomersProvider } from "../../../../components/CustomersProvider/CustomersProvider";
import { theme } from "../../../../theme";
import { API } from "aws-amplify";
import { customerFactory } from "../../../../factories/customers";

const customer = customerFactory.build();
const mountComponent = () => {
  cy.mount(
    <ThemeProvider theme={theme}>
      <CustomersProvider>
        <MemoryRouter initialEntries={["/customers"]}>
          <Routes>
            <Route
              path="customers"
              element={
                <EditCustomerModal
                  onEdit={cy.spy().as("submitHandler")}
                  open={true}
                  onClose={cy.spy().as("closeHandler")}
                  onDelete={cy.spy().as("deleteHandler")}
                  customer={{
                    name: customer.name,
                    address: customer.address,
                    postcode: customer.postcode,
                    mainTelephone: customer.mainTelephone,
                    secondTelephone: customer.secondTelephone,
                    email: customer.email,
                    id: customer.id,
                    slug: customer.slug,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </CustomersProvider>
    </ThemeProvider>
  );
};
describe("EditCustomerModal", () => {
  it("calls onClose when clicking on cancel button", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={true}
        onEdit={cy.spy().as("editHandler")}
        onDelete={cy.spy().as("deleteHandler")}
        customer={{
          name: "Pepe",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          id: "abc",
          slug: "",
        }}
      />
    );
    cy.findByText("Cancel").click();
    cy.get("@closeHandler").should("have.been.called");
  });

  it("calls onClose when clicking outside the modal", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={true}
        onEdit={cy.spy().as("editHandler")}
        onDelete={cy.spy().as("deleteHandler")}
        customer={{
          name: "Pepe",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          id: "abc",
          slug: "",
        }}
      />
    );
    cy.get("body").click(0, 0);
    cy.get("@closeHandler").should("have.been.called");
  });

  it("shows the modal when open is true", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={true}
        onEdit={cy.spy().as("editHandler")}
        onDelete={cy.spy().as("deleteHandler")}
        customer={{
          name: "Pepe",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          id: "abc",
          slug: "",
        }}
      />
    );
    cy.contains("Save");
  });

  it("does not show the modal when open is false", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={false}
        onEdit={cy.spy().as("editHandler")}
        onDelete={cy.spy().as("deleteHandler")}
        customer={{
          name: "Pepe",
          address: "",
          postcode: "",
          mainTelephone: "",
          secondTelephone: "",
          email: "",
          id: "abc",
          slug: "",
        }}
      />
    );
    cy.findByRole("form").should("not.exist");
  });

  it("shows the customer data on the form", () => {
    cy.mount(
      <EditCustomerModal
        onClose={cy.spy().as("closeHandler")}
        open={true}
        onEdit={cy.spy().as("editHandler")}
        onDelete={cy.spy().as("deleteHandler")}
        customer={{
          name: "Pepe",
          address: "84 Alcala",
          postcode: "28017",
          mainTelephone: "66254",
          secondTelephone: "",
          email: "pepe@email.com",
          id: "abc",
          slug: "pepe",
        }}
      />
    );

    cy.findByDisplayValue("Pepe");
    cy.findByDisplayValue("84 Alcala");
    cy.findByDisplayValue("28017");
    cy.findByDisplayValue("66254");
    cy.findByDisplayValue("pepe@email.com");
  });

  // API TESTING
  // Editing customer
  it("calls onEdit when submitting the form and the API response is successful", () => {
    cy.stub(API, "put").resolves({
      customer,
    });
    mountComponent();
    cy.findByLabelText("name *").type("other name");
    cy.findByText("Save").click();
    cy.get("@submitHandler").should("have.been.called");
  });

  it("renders an error message when submitting the form and the API returns an error", () => {
    cy.stub(API, "put").rejects();
    mountComponent();
    cy.findByLabelText("name *").type("other name");
    cy.findByText("Save").click();
    cy.get("@submitHandler").should("not.have.been.called");
    cy.contains("Internal error");
  });

  // Deliting Customer

  it("calls onDelete when submitting the form and the API response is successful", () => {
    cy.stub(API, "del").resolves({
      customer,
    });
    mountComponent();
    cy.findByText("Delete").click();
    cy.findByRole("dialog").within(() => {
      cy.findByRole("button", { name: /AGREE/i }).click();
    });
    cy.get("@deleteHandler").should("have.been.called");
  });

  it("renders an error message when submitting the form and the API returns an error", () => {
    cy.stub(API, "del").rejects();
    mountComponent();
    cy.findByText("Delete").click();

    cy.findByRole("dialog").within(() => {
      cy.findByRole("button", { name: /AGREE/i }).click();
    });
    cy.get("@deleteHandler").should("not.have.been.called");
  });
  // Nota: Revisitar onEdit cuando tengamos una API
});
