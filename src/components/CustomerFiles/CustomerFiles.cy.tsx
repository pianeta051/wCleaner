import { CustomerFiles } from "./CustomerFiles";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../theme";
import { Storage } from "aws-amplify";
import "cypress-file-upload";
let fileUrls: string[] = [];
const remountCustomerFiles = () => {
  const customer = {
    id: "customer-123",
    get fileUrls() {
      return fileUrls;
    },
  } as any;
};
const mountCustomerFiles = (initialFileUrls: string[] = []) => {
  fileUrls = [...initialFileUrls];

  const customer = {
    id: "customer-123",
    get fileUrls() {
      return fileUrls;
    },
  } as any;

  cy.mount(
    <ThemeProvider theme={theme}>
      <CustomerFiles customer={customer} />
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

  it("displays the correct file label and upload date", () => {
    const timestamp = Date.now();
    const key = `${timestamp}-document.pdf`;
    mountCustomerFiles([`https://storage-service/${key}`]);
    const label = "document.pdf";
    const date = new Date(timestamp).toLocaleDateString("en-GB");

    cy.contains(label).should("exist");
    cy.contains(`Uploaded: ${date}`).should("exist");
  });

  it("renders and deletes multiple files independently", () => {
    const files = [
      `https://fake-file/${Date.now()}-file1.jpg`,
      `https://fake-file/${Date.now() + 1}-file2.pdf`,
    ];
    mountCustomerFiles(files);

    cy.get('[aria-label="Delete"]').should("have.length", 2).first().click();
    cy.get("@deleteHandler").should("have.been.calledWith", 0);
  });

  it("does not show images or file icons after remove icon clicked", () => {
    fileUrls = [`https://fake-file/${new Date().getTime()}-1.pdf`];

    mountCustomerFiles(fileUrls);
    cy.get('[aria-label="Delete"]').click();

    mountCustomerFiles(fileUrls);
    cy.get('[aria-label="Delete"]').should("not.exist");
  });
});
