// import { CustomerJobModal } from "./CustomerJobModal";
// import { customerFactory } from "../../factories/customers";
// import { ThemeProvider } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { theme } from "../../theme";
// import * as jobHooks from "../../hooks/Jobs/useAddJob";
// import * as editJobHooks from "../../hooks/Jobs/useEditJob";

// const initialValues = {
//   date: "2024-10-10",
//   startTime: "09:00",
//   endTime: "11:00",
//   price: 100,
// };

// const customer = customerFactory.build();

// const mountComponent = (props: any = {}) => {
//   cy.mount(
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <ThemeProvider theme={theme}>
//         <CustomerJobModal
//           open={true}
//           customer={customer}
//           initialValues={initialValues}
//           onClose={cy.stub().as("onClose")}
//           onSubmit={cy.stub().as("onSubmit")}
//           {...props}
//         />
//       </ThemeProvider>
//     </LocalizationProvider>
//   );
// };

// describe("CustomerJobModal", () => {
//   beforeEach(() => {
//     cy.stub(jobHooks, "useAddJob").returns({
//       addJob: cy.stub().resolves({
//         id: "job_123",
//         ...initialValues,
//       }),
//       loading: false,
//       error: null,
//     });

//     cy.stub(editJobHooks, "useCustomerEditJob").returns({
//       editCustomerJob: cy.stub().resolves(),
//       loading: false,
//       error: null,
//     });
//   });

//   it("renders 'New Job' title when creating", () => {
//     mountComponent();
//     cy.contains("New Job").should("be.visible");
//   });

//   it("renders 'Edit Job' title when editing", () => {
//     mountComponent({ jobId: "job_123" });
//     cy.contains("Edit Job").should("be.visible");
//   });

//   it("submits form and calls onSubmit for new job", () => {
//     mountComponent();

//     cy.get('input[name="date"]').clear().type("2024-12-12");
//     cy.get('input[name="startTime"]').clear().type("10:00");
//     cy.get('input[name="endTime"]').clear().type("12:00");
//     cy.get('input[name="price"]').clear().type("200");

//     cy.findByRole("button", { name: /save/i }).click();
//     cy.get("@onSubmit").should("have.been.called");
//     cy.get("@onClose").should("have.been.called");
//   });

//   it("submits form and closes modal when editing a job", () => {
//     mountComponent({ jobId: "job_123" });

//     cy.findByRole("button", { name: /save/i }).click();
//     cy.get("@onClose").should("have.been.called");
//   });

//   it("calls onClose when Cancel button is clicked", () => {
//     mountComponent();
//     cy.contains("Cancel").click();
//     cy.get("@onClose").should("have.been.called");
//   });

//   it("shows error message if there is a creation error", () => {
//     cy.stub(jobHooks, "useAddJob").returns({
//       addJob: cy.stub().rejects(),
//       loading: false,
//       error: "Error creating job!",
//     });

//     mountComponent();
//     cy.contains("Error creating job!").should("be.visible");
//   });

//   it("shows error message if there is an edition error", () => {
//     cy.stub(editJobHooks, "useCustomerEditJob").returns({
//       editCustomerJob: cy.stub().rejects(),
//       loading: false,
//       error: "Error updating job!",
//     });

//     mountComponent({ jobId: "job_123" });
//     cy.contains("Error updating job!").should("be.visible");
//   });
// });
