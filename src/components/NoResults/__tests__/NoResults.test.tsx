import React from "react";
import { render, screen } from "@testing-library/react";
import NoResults from "../NoResults";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

jest.mock("../../../assets/no-results.png", () => "mocked-image-path");

const mockStore = configureStore([]);

describe("NoResults Component", () => {
  const store = mockStore({});

  const message = "No posts found.";

  beforeEach(() => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <NoResults message={message} />
        </BrowserRouter>
      </Provider>,
    );
  });

  it("renders the container", () => {
    expect(screen.getByTestId("no-results-container")).toBeInTheDocument();
  });

  it("renders the image", () => {
    expect(screen.getByTestId("no-results-image")).toBeInTheDocument();
    expect(screen.getByAltText("No Results Found")).toBeInTheDocument();
  });

  it("displays the correct message", () => {
    const messageElement = screen.getByTestId("no-results-message");
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent(message);
  });
});
