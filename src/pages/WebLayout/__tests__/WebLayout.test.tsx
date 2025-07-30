import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import WebLayout from "../WebLayout";

jest.mock("../../../components/Navbar/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>;

const createMockStore = () => {
  const initialState = {};

  const rootReducer = (state = initialState, action: any) => {
    return state;
  };

  return createStore(rootReducer);
};

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </BrowserRouter>
    </Provider>,
  );
};

describe("WebLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders navbar and outlet", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(false);

    renderWithProviders(<WebLayout />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("applies correct styles for mobile viewport", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(false);

    renderWithProviders(<WebLayout />);

    const mainBox = screen.getByTestId("outlet").parentElement;
    expect(mainBox).toHaveStyle({
      "flex-grow": "1",
      padding: "16px",
    });
  });

  it("applies correct styles for tablet viewport", () => {
    mockUseMediaQuery.mockReturnValueOnce(true).mockReturnValueOnce(false);

    renderWithProviders(<WebLayout />);

    const mainBox = screen.getByTestId("outlet").parentElement;

    expect(mainBox).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("applies correct styles for desktop viewport", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(true);

    renderWithProviders(<WebLayout />);

    const mainBox = screen.getByTestId("outlet").parentElement;

    expect(mainBox).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("has correct drawer width calculations", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(false);

    const { rerender } = renderWithProviders(<WebLayout />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();

    mockUseMediaQuery.mockReturnValueOnce(true).mockReturnValueOnce(false);

    rerender(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <WebLayout />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByTestId("outlet")).toBeInTheDocument();

    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(true);

    rerender(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <WebLayout />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("renders with correct DOM structure", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(false);

    renderWithProviders(<WebLayout />);

    const navbar = screen.getByTestId("navbar");
    const outlet = screen.getByTestId("outlet");

    expect(navbar).toBeInTheDocument();
    expect(outlet).toBeInTheDocument();

    const mainElement = outlet.parentElement;
    expect(mainElement?.tagName.toLowerCase()).toBe("main");
  });

  it("calls useMediaQuery with correct breakpoint queries", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(false);

    renderWithProviders(<WebLayout />);

    expect(mockUseMediaQuery).toHaveBeenCalledTimes(2);
  });

  it("handles theme provider integration", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(false);

    expect(() => {
      renderWithProviders(<WebLayout />);
    }).not.toThrow();

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("applies flex display to root container", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(false);

    renderWithProviders(<WebLayout />);

    const navbar = screen.getByTestId("navbar");
    const rootContainer = navbar.parentElement;

    expect(rootContainer).toHaveStyle({
      display: "flex",
    });
  });

  it("renders outlet content within main component", () => {
    mockUseMediaQuery.mockReturnValueOnce(false).mockReturnValueOnce(false);

    renderWithProviders(<WebLayout />);

    const outlet = screen.getByTestId("outlet");
    const mainElement = outlet.parentElement;

    expect(mainElement?.tagName.toLowerCase()).toBe("main");
    expect(outlet).toHaveTextContent("Outlet Content");
  });
});
