import { MemoryRouter, Routes, Route } from "react-router-dom";

import { CustomerDetails } from "./CustomerDetails";

describe("CustomerDetails", () => {
  it("renders 404 page when the URL parameter url is not defined", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/customers/amalia"]}>
        <Routes>
          <Route path="/customers/:incorrect" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("404 Page Not Found");
  });

  it("renders customer details  when the URL parameter is defined with a existing customer", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/customers/amalia"]}>
        <Routes>
          <Route path="/customers/:url" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByDisplayValue("Amalia Rosso");
  });

  it("renders 404 page when the URL parameter is defined with a not exiting customer", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/customers/not-existent"]}>
        <Routes>
          <Route path="/customers/:url" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("404 Page Not Found");
  });
});

// 3. Escribe un test de peticiones asíncronas, considerando tanto happy path como posibles errores,
// para alguno de los componentes que se comunican con el back end.
