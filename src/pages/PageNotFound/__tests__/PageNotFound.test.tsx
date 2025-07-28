import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import PageNotFound from "../PageNotFound";

jest.mock("../PageNotFound.css", () => ({}));

jest.mock("../../../assets/PageNotFoundImage.png", () => "mocked-image-path");

const createMockStore = () => {
  const initialState = {};

  const rootReducer = (state = initialState, action: any) => {
    return state;
  };

  return createStore(rootReducer);
};

const renderWithProviders = (ui: React.ReactElement) => {
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
  );
};

describe("PageNotFound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    renderWithProviders(<PageNotFound />);

    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("renders the page not found image with correct attributes", () => {
    renderWithProviders(<PageNotFound />);

    const image = screen.getByAltText("Not Found");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "mocked-image-path");
    expect(image).toHaveClass("not-found-logo");
  });

  it("renders the correct heading", () => {
    renderWithProviders(<PageNotFound />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Page Not Found");
  });

  it("renders the error message", () => {
    renderWithProviders(<PageNotFound />);

    const errorMessage = screen.getByText(
      "We're sorry, the page you requested could not be found.",
    );

    expect(errorMessage).toBeInTheDocument();
  });

  it("renders a link to homepage with correct attributes", () => {
    renderWithProviders(<PageNotFound />);

    const homeLink = screen.getByRole("link", { name: /go back to homepage/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/home");
    expect(homeLink).toHaveClass("not-found-link");
  });

  it("renders the main container with correct class", () => {
    renderWithProviders(<PageNotFound />);

    const container = screen
      .getByText("Page Not Found")
      .closest(".not-found-container");

    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("not-found-container");
  });

  it("renders all text content correctly", () => {
    renderWithProviders(<PageNotFound />);

    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We're sorry, the page you requested could not be found.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Go back to Homepage")).toBeInTheDocument();
  });

  it("has correct DOM structure", () => {
    renderWithProviders(<PageNotFound />);

    const container = screen
      .getByText("Page Not Found")
      .closest(".not-found-container");
    const image = screen.getByAltText("Not Found");
    const heading = screen.getByRole("heading", { level: 1 });
    const errorMessage = screen.getByText(
      "We're sorry, the page you requested could not be found.",
    );
    const homeLink = screen.getByRole("link", { name: /go back to homepage/i });

    expect(container).toContainElement(image);
    expect(container).toContainElement(heading);
    expect(container).toContainElement(errorMessage);
    expect(container).toContainElement(homeLink);
  });

  it("link text is wrapped in paragraph tag", () => {
    renderWithProviders(<PageNotFound />);

    const homeLink = screen.getByRole("link", { name: /go back to homepage/i });
    const parentParagraph = homeLink.closest("p");

    expect(parentParagraph).toBeInTheDocument();
  });

  it("renders multiple paragraph elements", () => {
    renderWithProviders(<PageNotFound />);

    const paragraphs = screen.getAllByText(/.*/, { selector: "p" });

    expect(paragraphs).toHaveLength(2);
  });

  it("image appears before heading in DOM order", () => {
    renderWithProviders(<PageNotFound />);

    const container = screen
      .getByText("Page Not Found")
      .closest(".not-found-container");
    const children = Array.from(container?.children || []);

    const imageIndex = children.findIndex((child) => child.tagName === "IMG");
    const headingIndex = children.findIndex((child) => child.tagName === "H1");

    expect(imageIndex).toBeLessThan(headingIndex);
  });

  it("has accessible image alt text", () => {
    renderWithProviders(<PageNotFound />);

    const image = screen.getByAltText("Not Found");

    expect(image).toHaveAttribute("alt", "Not Found");
  });

  it("link is keyboard accessible", () => {
    renderWithProviders(<PageNotFound />);

    const homeLink = screen.getByRole("link", { name: /go back to homepage/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink.tagName).toBe("A");
  });
});
