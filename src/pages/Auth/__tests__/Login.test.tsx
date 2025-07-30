jest.mock("../../../assets/socialMediaPng.png", () => "mocked-image");
jest.mock("../../../assets/ApiErrorImage.png", ()=>"mocked-api-error-image")
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Login from "../Login";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import * as api from "../../../services/apiCalls";

const mockStore = configureStore([thunk]);
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../services/apiCalls", () => ({
  getAllUsers: jest.fn(),
}));

describe("Login Component", () => {
  let store: ReturnType<typeof mockStore>;

  const mockUser = {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    password: "secret123",
    firstName: "John",
    lastName: "Doe",
    image: "avatar.png",
    phone: "123456789",
    gender: "male",
    company: "OpenAI",
  };

  beforeEach(() => {
    store = mockStore({
      user: { email: "", password: "" },
      error:{hasApiError:false}
    });
    jest.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    );

  it("renders login form elements", () => {
    renderLogin();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  it("disables login button when fields are empty", () => {
    renderLogin();
    expect(screen.getByTestId("login-button")).toBeDisabled();
  });

  it("enables login button when fields are filled", () => {
    renderLogin();

    const emailField = screen.getByTestId("email-input");
    const passwordField = screen.getByTestId("password-input");

    fireEvent.change(within(emailField).getByRole("textbox"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(within(passwordField).getByLabelText("Password"), {
      target: { value: "secret123" },
    });

    expect(screen.getByTestId("login-button")).not.toBeDisabled();
  });

  it("logs in successfully and navigates", async () => {
    (api.getAllUsers as jest.Mock).mockResolvedValue({
      data: { users: [mockUser] },
    });

    renderLogin();

    fireEvent.change(
      within(screen.getByTestId("email-input")).getByRole("textbox"),
      {
        target: { value: "john@example.com" },
      },
    );
    fireEvent.change(
      within(screen.getByTestId("password-input")).getByLabelText("Password"),
      {
        target: { value: "secret123" },
      },
    );

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(api.getAllUsers).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("shows error snackbar when credentials are invalid", async () => {
    (api.getAllUsers as jest.Mock).mockResolvedValue({
      data: { users: [mockUser] },
    });

    renderLogin();

    fireEvent.change(
      within(screen.getByTestId("email-input")).getByRole("textbox"),
      {
        target: { value: "invalid@example.com" },
      },
    );
    fireEvent.change(
      within(screen.getByTestId("password-input")).getByLabelText("Password"),
      {
        target: { value: "wrongpass" },
      },
    );

    fireEvent.click(screen.getByTestId("login-button"));

    const alert = await screen.findByTestId("error-alert");
    expect(alert).toHaveTextContent("Invalid email or password");
  });
});
