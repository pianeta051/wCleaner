import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CustomerJobModal } from "./CustomerJobModal";
import { theme } from "../../theme";
import { customerFactory } from "../../factories/customers";
import * as jobHooks from "../../hooks/Jobs/useAddJob";
import * as editJobHooks from "../../hooks/Jobs/useEditJob";
import * as userHooks from "../../hooks/Users/useUsers";
import * as jobTypeHooks from "../../hooks/Jobs/useJobTypes";
import dayjs from "dayjs";
import { JobFormValues } from "../JobForm/JobForm";
import { Job } from "../../types/types";

const customer = customerFactory.build();
const baseDate = dayjs("2024-10-10");

const defaultInitialValues: JobFormValues = {
  date: baseDate,
  startTime: baseDate.hour(9).minute(0),
  endTime: baseDate.hour(11).minute(0),
  price: 100,
  assignedTo: "mock-user-id-123",
  jobTypeId: "mock-job-type-id-456",
};

beforeEach(() => {
  if (!document.getElementById("modal-root")) {
    const modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.appendChild(modalRoot);
  }

  cy.stub(userHooks, "useUsers").returns([
    { id: "mock-user-id-123", name: "Test User" },
  ]);

  cy.stub(jobTypeHooks, "useJobTypes").returns([
    { id: "mock-job-type-id-456", name: "Mock Job Type" },
  ]);
});

const mountComponent = (
  props: Partial<React.ComponentProps<typeof CustomerJobModal>> = {}
) => {
  const onClose = cy.stub().as("onClose");

  cy.mount(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CustomerJobModal
          open={true}
          customer={customer}
          onClose={onClose}
          {...props}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

describe("CustomerJobModal", () => {
  beforeEach(() => {
    cy.stub(jobHooks, "useAddJob").returns({
      addJob: cy.stub().resolves({
        id: "job_123",
        ...defaultInitialValues,
      }),
      loading: false,
      error: null,
    });

    cy.stub(editJobHooks, "useCustomerEditJob").returns({
      editCustomerJob: cy.stub().resolves(),
      loading: false,
      error: null,
    });
  });

  it("renders 'New Job' title when creating", () => {
    mountComponent();
    cy.findByRole("heading", { name: /new job/i }).should("exist");
  });

  it("renders 'Edit Job' title when editing", () => {
    mountComponent({
      jobId: "job_123",
      initialValues: defaultInitialValues,
    });
    cy.findByRole("heading", { name: /edit job/i }).should("exist");
  });

  it("displays default values passed via props", () => {
    mountComponent({ initialValues: defaultInitialValues });

    cy.get('input[name="price"]').should("have.value", "100");
    cy.get('input[name="startTime"]').should("have.value", "09:00");
    cy.get('input[name="endTime"]').should("have.value", "11:00");
    cy.get('input[name="date"]').should("exist");
  });

  it("submits form and calls onSubmit for a new job", () => {
    mountComponent({ initialValues: defaultInitialValues });

    cy.get('input[name="price"]').clear().type("250");
    cy.findByRole("button", { name: /save/i }).click();

    cy.get("@onClose").should("have.been.called");
  });

  //   it("submits form and closes modal when editing a job", () => {
  //     mountComponent({
  //       jobId: "job_123",
  //       initialValues: defaultInitialValues,
  //     });

  //     cy.findByRole("button", { name: /save/i }).click();
  //     cy.get("@onClose").should("have.been.called");
  //   });

  //   it("calls onClose when Cancel button is clicked", () => {
  //     mountComponent();
  //     cy.findByRole("button", { name: /cancel/i }).click();
  //     cy.get("@onClose").should("have.been.called");
  //   });

  //   // ---------- Error state tests ----------
  //   it("shows error message if there is a creation error", () => {
  //     cy.stub(jobHooks, "useAddJob").returns({
  //       addJob: cy.stub().rejects(),
  //       loading: false,
  //       error: "Error creating job!",
  //     });

  //     mountComponent();
  //     cy.contains("Error creating job!").should("exist");
  //   });

  //   it("shows error message if there is an edition error", () => {
  //     cy.stub(editJobHooks, "useCustomerEditJob").returns({
  //       editCustomerJob: cy.stub().rejects(),
  //       loading: false,
  //       error: "Error updating job!",
  //     });

  //     mountComponent({
  //       jobId: "job_123",
  //       initialValues: defaultInitialValues,
  //     });

  //     cy.contains("Error updating job!").should("exist");
  //   });

  //   it("disables save button while loading", () => {
  //     cy.stub(jobHooks, "useAddJob").returns({
  //       addJob: cy.stub().resolves(),
  //       loading: true,
  //       error: null,
  //     });

  //     mountComponent();
  //     cy.findByRole("button", { name: /save/i }).should("be.disabled");
  //   });
});
