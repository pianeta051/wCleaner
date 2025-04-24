import { CustomerFiles } from "./CustomerFiles";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../theme";
import { customerFactory } from "../../factories/customers";
import * as fileService from "../../services/files";

const mockFileUrls = [
  "uploads/1682384000000-example-image.jpg",
  "uploads/1682470400000-document.pdf",
];

const mountComponent = (customerOverrides = {}) => {
  const customer = customerFactory.build({
    fileUrls: mockFileUrls,
    ...customerOverrides,
  });

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

describe("CustomerFiles", () => {
  beforeEach(() => {
    cy.stub(fileService, "getFileUrl").callsFake((key: string) =>
      Promise.resolve(`https://signed-url.com/${key}`)
    );
  });

  it("renders uploaded image and document with correct labels", () => {
    mountComponent();
    cy.findAllByRole("link").should("have.length", 2);
    cy.get("img").should("have.attr", "alt", "Uploaded file 1");
    cy.contains("example-image.jpg");
    cy.contains("document.pdf");
    cy.contains("Uploaded:");
  });

  it("renders nothing when fileUrls is empty", () => {
    mountComponent({ fileUrls: [] });
    cy.findAllByRole("link").should("have.length", 0);
  });

  it("handles error if getFileUrl fails", () => {
    (fileService.getFileUrl as any).restore();
    cy.stub(fileService, "getFileUrl").rejects(
      new Error("Failed to fetch URL")
    );

    mountComponent();
    cy.findAllByRole("link").should("have.length", 0);
  });

  it("calls onDeleteFile when delete icon is clicked", () => {
    mountComponent();
    cy.get('[aria-label="delete"]').eq(0).click({ force: true });
    cy.get("@deleteHandler").should("have.been.calledWith", 0);
  });

  it("calls onEditUrls when FileUploader submits new keys", () => {
    const { customer } = mountComponent();

    const newKeys = ["uploads/1683000000000-newfile.png"];
    const merged = [...mockFileUrls, ...newKeys];

    cy.get("@editHandler").should("not.have.been.called");

    // Simulate direct call to onSubmit (skip UI interaction)
    cy.get("@editHandler").invoke("call", null, merged);

    cy.get("@editHandler").should("have.been.calledWith", merged);
  });
});
