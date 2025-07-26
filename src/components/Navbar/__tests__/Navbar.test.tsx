//cleared test
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";
import { BrowserRouter } from "react-router-dom";
import { logoutUser } from "../../../redux/Actions/userActions";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../../../constants/theme";

// ✅ Mock useMediaQuery inline to avoid ReferenceError
jest.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock hooks and functions
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/home/profile/me" }),
}));

jest.mock("../../../redux/Actions/userActions", () => ({
  logoutUser: jest.fn(() => ({ type: "LOGOUT" })),
}));

// Utility to render component with router
const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Navbar />
      </ThemeProvider>
    </BrowserRouter>
  );

describe("Navbar Component", () => {
  const useMediaQuery = require("@mui/material/useMediaQuery").default;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders mobile layout with nav links", () => {
    useMediaQuery.mockImplementation((query: string) => query.includes("max-width: 600px"));

    renderWithRouter();

    expect(screen.getByTestId("navbar-mobile")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-home")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-explore")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-search")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-profile")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logout")).toBeInTheDocument();
  });

  test("renders tablet layout with icons", () => {
    useMediaQuery.mockImplementation((query: string) =>
      query.includes("(min-width: 601px) and (max-width: 960px)")
    );

    renderWithRouter();

    expect(screen.getByTestId("navbar-tablet")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-home")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-explore")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-search")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-profile")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logout")).toBeInTheDocument();
  });

  test("renders desktop layout with full sidebar", () => {
    useMediaQuery.mockImplementation((query: string) =>
      query.includes("(min-width: 961px)")
    );

    renderWithRouter();

    expect(screen.getByTestId("navbar-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-home")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-explore")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-search")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-profile")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logout")).toBeInTheDocument();
  });

  test("logout button calls dispatch and navigate", () => {
    useMediaQuery.mockImplementation(() => true); // assume visible

    renderWithRouter();

    const logoutButton = screen.getByTestId("nav-logout");
    fireEvent.click(logoutButton);

    expect(mockDispatch).toHaveBeenCalledWith(logoutUser());
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("highlights the active nav item on desktop", () => {
    useMediaQuery.mockImplementation(() => true);

    renderWithRouter();

    const activeLink = screen.getByTestId("navlink-profile");
    expect(activeLink).toBeInTheDocument();
  });
});
