import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import { theme } from "../../theme";
import { CustomersProvider } from "../CustomersProvider/CustomersProvider";
import { CustomerJobs } from "./CustomerJobs";
import { jobFactory } from "../../factories/job";
import { customerFactory } from "../../factories/customers";

const customer = customerFactory.build();
const job = jobFactory.build();
const mountComponent = () => {
  cy.mount(
    <ThemeProvider theme={theme}>
      <CustomersProvider>
        <MemoryRouter initialEntries={["/customers"]}>
          <Routes>
            <Route
              path="customers"
              element={<CustomerJobs customer={customer} />}
            />
          </Routes>
        </MemoryRouter>
      </CustomersProvider>
    </ThemeProvider>
  );
};

describe("CustomerJobs", () => {
  it("shows Create your first job in the following button when No jobs in customer", () => {
    cy.mount(<CustomerJobs customer={customer} />);
    cy.findByText("Create your first job in the following button");
  });
  it("shows customer jobs when existing jobs in customers", () => {
    // job.customerId = customer.id;
    cy.mount(<CustomerJobs customer={customer} />);
    cy.findByText("Jobs");
  });
});
