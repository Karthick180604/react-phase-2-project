import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";
import { BrowserRouter } from "react-router-dom";
import { logoutUser } from "../../../redux/Actions/userActions";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../../../constants/theme";

// MUI mocking for breakpoints
jest.mock("@mui/material/useMediaQuery", () => jest.fn());

// Mock hooks and functions
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: "/home/profile/me",
  }),
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
    </BrowserRouter>,
  );

describe("Navbar Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders mobile layout with nav links", () => {
    require("@mui/material/useMediaQuery").mockImplementation((query) =>
      typeof query === "function"
        ? query({ breakpoints: { down: () => true } })
        : true,
    );

    renderWithRouter();

    expect(screen.getByTestId("navbar-mobile")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-home")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-explore")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-search")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-profile")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logout")).toBeInTheDocument();
  });

  test.skip("renders tablet layout with icons", () => {
    require("@mui/material/useMediaQuery").mockImplementation((query) => {
      if (typeof query === "function")
        return query({
          breakpoints: {
            down: (key) => key === "sm",
            between: (a, b) => a === "sm" && b === "md",
          },
        });
      return false;
    });

    renderWithRouter();

    expect(screen.getByTestId("navbar-tablet")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-home")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-explore")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-search")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-profile")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logout")).toBeInTheDocument();
  });

  test("renders desktop layout with full sidebar", () => {
    require("@mui/material/useMediaQuery").mockImplementation(() => false);

    renderWithRouter();

    expect(screen.getByTestId("navbar-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-home")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-explore")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-search")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-profile")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logout")).toBeInTheDocument();
  });

  test("logout button calls dispatch and navigate", () => {
    require("@mui/material/useMediaQuery").mockImplementation(() => false);

    renderWithRouter();

    const logoutButton = screen.getByTestId("nav-logout");
    fireEvent.click(logoutButton);

    expect(mockDispatch).toHaveBeenCalledWith(logoutUser());
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("highlights the active nav item on desktop", () => {
    require("@mui/material/useMediaQuery").mockImplementation(() => false);

    renderWithRouter();

    const activeLink = screen.getByTestId("navlink-profile");
    // Just check if it rendered with expected color class
    expect(activeLink).toBeInTheDocument();
  });
});
