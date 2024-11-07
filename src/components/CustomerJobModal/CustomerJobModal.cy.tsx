// import { customerFactory } from "../../factories/customers";
// import { JobModal } from "./JobModal";

// describe("JobModal Component", () => {
//   beforeEach(() => {
//     // Mock customer and initial values for testing
//     const customers = customerFactory.buildList(5);
//     const customerSelected = customers[0];
//     const initialValues = {
//       date: "2024-10-10",
//       startTime: "09:00",
//       endTime: "11:00",
//       price: 100,
//     };

//     // Mount the JobModal component with required props
//     cy.mount(
//       <JobModal
//         open={true}
//         customer={customerSelected}
//         initialValues={initialValues}
//         onClose={cy.stub().as("onClose")}
//         onSubmit={cy.stub().as("onSubmit")}
//       />
//     );
//   });

//   it("should render the modal with the correct title for a new job", () => {
//     // Check that the modal title shows "New Job"
//     cy.contains("New Job").should("be.visible");
//   });

//   it("should render the modal with the correct title for editing a job", () => {
//     // Mount again with jobId to simulate editing

//     cy.mount(
//       <JobModal
//         open={true}
//         customer={customerSelected}
//         jobId={customer.jobId}
//         initialValues={initialValues}
//         onClose={cy.stub().as("onClose")}
//         onSubmit={cy.stub().as("onSubmit")}
//       />
//     );

//     // Check that the modal title changes to "Edit Job"
//     cy.contains("Edit Job").should("be.visible");
//   });

//   it("should submit the form and show a success alert for adding a new job", () => {
//     // Fill out the job form
//     cy.get('input[name="date"]').clear().type("2024-12-12");
//     cy.get('input[name="startTime"]').clear().type("10:00");
//     cy.get('input[name="endTime"]').clear().type("12:00");
//     cy.get('input[name="price"]').clear().type("200");

//     // Submit the form
//     cy.get('button[type="submit"]').click();

//     // Ensure that onSubmit handler is called
//     cy.get("@onSubmit").should("have.been.called");

//     // Check that the success alert message is shown
//     cy.contains("Job Added").should("be.visible");
//   });

//   it("should submit the form and show a success alert for editing a job", () => {
//     // Mount again with jobId to simulate editing

//     const initialValues = {
//       date: "2024-10-10",
//       startTime: "09:00",
//       endTime: "11:00",
//       price: 100,
//     };

//     cy.mount(
//       <JobModal
//         open={true}
//         customer={customerSelected}
//         jobId={"job123"}
//         initialValues={initialValues}
//         onClose={cy.stub().as("onClose")}
//         onSubmit={cy.stub().as("onSubmit")}
//       />
//     );

//     // Submit the form
//     cy.get('button[type="submit"]').click();

//     // Ensure that onSubmit handler is called
//     cy.get("@onSubmit").should("have.been.called");

//     // Check that the success alert message is shown
//     cy.contains("Job Edited").should("be.visible");
//   });

//   it("should close the modal when the cancel button is clicked", () => {
//     // Click the cancel button
//     cy.contains("Cancel").click();

//     // Ensure that the onClose handler is called
//     cy.get("@onClose").should("have.been.called");
//   });

//   it("should display an error message when there is an error during job creation", () => {
//     // Simulate an error by mounting the component with a fake error

//     const initialValues = {
//       date: "2024-10-10",
//       startTime: "09:00",
//       endTime: "11:00",
//       price: 100,
//     };
//     const creationError = "Error creating job!";

//     cy.mount(
//       <JobModal
//         open={true}
//         customer={customerSelected}
//         initialValues={initialValues}
//         onClose={cy.stub().as("onClose")}
//         onSubmit={cy.stub().as("onSubmit")}
//         creationError={creationError} // Simulate an error
//       />
//     );

//     // Ensure that the error message is shown
//     cy.contains("Error creating job!").should("be.visible");
//   });
// });
