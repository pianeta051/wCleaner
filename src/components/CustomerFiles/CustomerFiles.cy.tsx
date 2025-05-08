import { CustomerFiles } from "./CustomerFiles";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../theme";
import { Storage } from "aws-amplify";
import "cypress-file-upload";

const mountCustomerFiles = (fileUrls: string[] = []) => {
  const customer = {
    id: "customer-123",
    fileUrls,
  } as any;

  const onEditUrls = cy.stub().as("editHandler");
  const onDeleteFile = cy.stub().as("deleteHandler");

  cy.mount(
    <ThemeProvider theme={theme}>
      <CustomerFiles
        customer={customer}
        onEditUrls={onEditUrls}
        onDeleteFile={onDeleteFile}
      />
    </ThemeProvider>
  );

  return { customer };
};

describe("CustomerFiles Component", () => {
  beforeEach(() => {
    cy.stub(Storage, "get").callsFake(async (key: string) => key);
    cy.stub(Storage, "put").resolves({});
  });

  it("calls onEdit when the file uploader generates new files", () => {
    mountCustomerFiles([]);
    cy.get('input[type="file"]').attachFile("test-image.png");
    cy.contains("button", "Upload").should("not.be.disabled").click();
    cy.get("@editHandler").should("have.been.called"); // Upload worked
  });

  it("calls onDelete when the delete button of a file is clicked", () => {
    mountCustomerFiles([
      `https://placehold.co/${new Date().getTime()}-600x400.png`,
    ]);
    cy.get('[aria-label="Delete"]').click();
    cy.get("@deleteHandler").should("have.been.called");
  });

  it("shows the images when the customer fileurls has them", () => {
    mountCustomerFiles([
      `https://placehold.co/${new Date().getTime()}-600x400.png`,
      `https://placehold.co/${new Date().getTime()}-400x400.jpg`,
    ]);
    cy.get("img").should("be.visible");
  });

  it("shows the file icon when the customer has file URLs that are not images", () => {
    mountCustomerFiles([
      `https://fake-file/${new Date().getTime()}-1.pdf`,
      `https://fake-file/${new Date().getTime()}-2.doc`,
    ]);
    cy.get('[aria-label="File"]').should("be.visible");
  });

  it("does not show images or file icons if the customer doesn't have fieUrls", () => {
    mountCustomerFiles();
    cy.get("img").should("not.exist");
    cy.get('[aria-label="File"]').should("not.exist");
  });
});
