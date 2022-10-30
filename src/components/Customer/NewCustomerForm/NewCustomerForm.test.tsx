import { render, screen, waitFor } from "@testing-library/react";
import { NewCustomerForm } from "./NewCustomerForm";
import userEvent from "@testing-library/user-event";

describe("NewCustomerForm", () => {
  it("calls onCancel when clicking on the cancel button", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<NewCustomerForm onSubmit={onSubmit} onCancel={onCancel} />);
    const cancelButton = screen.getByText("Cancel", {
      selector: "button",
    });

    user.click(cancelButton);
    await waitFor(() => expect(onCancel).toHaveBeenCalled());
  });

  // Si envio el formulario en blanco, tiene que llamar a onSubmit con un Customer
  // que tiene todos los campos en blanco
  it("calls onSubmit with a blank Customer when clicking the submit button", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<NewCustomerForm onSubmit={onSubmit} onCancel={onCancel} />);
    const submitButton = screen.getByText("Submit", {
      selector: "button",
    });
    user.click(submitButton);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "",
        address: "",
        postcode: "",
        mainTelephone: "",
        secondTelephone: "",
        email: "",
        url: "",
      })
    );
  });

  // Si envio el formulario con datos, tiene que mandar un Customer con esos datos
  // como parametro del onSubmit
  it("calls onSubmit with a non-blank Customer when submitting a completed form", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    jest.setTimeout(60000);
    render(<NewCustomerForm onSubmit={onSubmit} onCancel={onCancel} />);

    const submitButton = screen.getByText("Submit", {
      selector: "button",
    });
    await user.type(screen.getByLabelText(/name/i), "Maria Beltran");
    await user.type(screen.getByLabelText(/address/i), "127 Alcala");
    await user.type(screen.getByLabelText(/postcode/i), "28017");
    await user.type(screen.getByLabelText("Main Telephone"), "222222222");
    await user.type(screen.getByLabelText(/secondTelephone/i), "55454545454");
    await user.type(screen.getByLabelText(/email/i), "maria@email.com");

    user.click(submitButton);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Maria Beltran",
        address: "127 Alcala",
        postcode: "28017",
        mainTelephone: "222222222",
        secondTelephone: "55454545454",
        email: "maria@email.com",
        url: "maria@email.com",
      })
    );
  }, 60_000);
});
