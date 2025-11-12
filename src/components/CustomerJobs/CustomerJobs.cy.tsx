import { CustomerJobs } from "./CustomerJobs";
import { customerFactory } from "../../factories/customers";

const customer = customerFactory.build();

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
