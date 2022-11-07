import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CustomerDetails } from "./CustomerDetails";
import { getCustomer } from "../../../services/customers";
import { Customer } from "../../../types/types";

jest.mock("../../../services/customers", () => ({
  ...jest.requireActual("../../../services/customers"),
  getCustomer: jest.fn(),
}));

describe("CustomerDetails", () => {
  it("displays an error when the url parameter is not provided", () => {
    render(
      <MemoryRouter initialEntries={["/not-relevant"]}>
        <Routes>
          <Route path="/:whatever" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    const internalErrorMessage = screen.getByTestId("internal-error-message");
    expect(internalErrorMessage).toBeInTheDocument();
    const notFoundMessage = screen.queryByTestId("not-found-message");
    expect(notFoundMessage).not.toBeInTheDocument();
  });

  it("displays a 404 error when the customer does not exist", () => {
    jest.mocked(getCustomer).mockReturnValue(null);
    render(
      <MemoryRouter initialEntries={["/not-relevant"]}>
        <Routes>
          <Route path="/:url" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    const notFoundMessage = screen.getByTestId("not-found-message");
    expect(notFoundMessage).toBeInTheDocument();
  });

  it("displays the customer details when the customer exists", () => {
    const customer: Customer = {
      name: "Amalia Rosso",
      address: "87 Tilling St",
      postcode: "MD35PF",
      mainTelephone: "+997555",
      secondTelephone: "+36544",
      email: "amalia@fake.com",
      url: "amalia",
    };
    jest.mocked(getCustomer).mockReturnValue(customer);
    render(
      <MemoryRouter initialEntries={["/not-relevant"]}>
        <Routes>
          <Route path="/:url" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    for (const key in customer) {
      if (key !== "url") {
        const value = customer[key as keyof Customer];
        if (value) {
          const uiDetail = screen.getByText(value);
          expect(uiDetail).toBeInTheDocument();
        }
      }
    }
  });

  it("displays the edit button when the customer exists", () => {
    const customer: Customer = {
      name: "Amalia Rosso",
      address: "87 Tilling St",
      postcode: "MD35PF",
      mainTelephone: "+997555",
      secondTelephone: "+36544",
      email: "amalia@fake.com",
      url: "amalia",
    };
    jest.mocked(getCustomer).mockReturnValue(customer);
    render(
      <MemoryRouter initialEntries={["/not-relevant"]}>
        <Routes>
          <Route path="/:url" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();
  });

  it("does not display the edit button when the customer does not exist", () => {
    jest.mocked(getCustomer).mockReturnValue(null);
    render(
      <MemoryRouter initialEntries={["/not-relevant"]}>
        <Routes>
          <Route path="/:url" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    const editButton = screen.queryByText("Edit");
    expect(editButton).not.toBeInTheDocument();
  });

  it.todo("opens the edit form when clicking on the edit button");
});
