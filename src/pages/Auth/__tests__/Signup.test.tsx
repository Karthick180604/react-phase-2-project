jest.mock("../../../assets/socialMediaPng.png", () => "mocked-image");
jest.mock("../../../assets/ApiErrorImage.png", ()=> "mocked-api-error-image")

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../Signup";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import * as apiCalls from "../../../services/apiCalls";

const mockStore = configureStore([thunk]);

const renderSignup = (storeOverride = {}) => {
  const store = mockStore({ user: {}, error:{hasApiError:false}, ...storeOverride });
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    </Provider>,
  );
  return store;
};

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form inputs and buttons", () => {
    renderSignup();

    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("signup-button")).toBeInTheDocument();
    expect(screen.getByTestId("login-redirect")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    renderSignup();

    const passwordInput = screen.getByTestId("password-input");
    const toggleButton = screen.getByTestId("toggle-password-visibility");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("disables Sign Up button with invalid inputs", () => {
    renderSignup();
    const button = screen.getByTestId("signup-button") as HTMLButtonElement;
    expect(button.disabled).toBeTruthy();
  });

  it("enables Sign Up button with valid inputs", () => {
    renderSignup();

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "Karthick" },
    });

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "karthick@example.com" },
    });

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Pass@123" },
    });

    const button = screen.getByTestId("signup-button") as HTMLButtonElement;
    expect(button.disabled).toBeFalsy();
  });

  it("shows snackbar if user already exists", async () => {
    jest.spyOn(apiCalls, "getAllUsers").mockResolvedValueOnce({
      data: {
        users: [{ email: "existing@example.com" }],
      },
    });

    renderSignup();

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "Existing User" },
    });

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "existing@example.com" },
    });

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Pass@123" },
    });

    fireEvent.click(screen.getByTestId("signup-button"));

    await waitFor(() => {
      expect(screen.getByTestId("user-exists-snackbar")).toBeInTheDocument();
    });
  });

  it("dispatches setUser and navigates to /home if user does not exist", async () => {
    jest
      .spyOn(apiCalls, "getAllUsers")
      .mockResolvedValueOnce({ data: { users: [] } });

    const store = renderSignup();

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "New User" },
    });

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "newuser@example.com" },
    });

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Pass@123" },
    });

    fireEvent.click(screen.getByTestId("signup-button"));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe("SET_USER");
    });
  });
});
