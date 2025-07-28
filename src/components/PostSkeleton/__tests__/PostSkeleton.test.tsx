import React from "react";
import { render, screen } from "@testing-library/react";
import PostCardSkeleton from "../PostSkeleton";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../../../redux/Store/store";

const renderWithRedux = (component: React.ReactNode) => {
  const store = createStore(rootReducer);
  return render(<Provider store={store}>{component}</Provider>);
};

describe("PostCardSkeleton", () => {
  beforeEach(() => {
    renderWithRedux(<PostCardSkeleton />);
  });

  it("renders main container", () => {
    expect(screen.getByTestId("post-card-skeleton")).toBeInTheDocument();
  });

  it("renders media skeleton", () => {
    expect(screen.getByTestId("skeleton-image")).toBeInTheDocument();
  });

  it("renders action skeletons with icons", () => {
    expect(screen.getByTestId("skeleton-actions")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-icon-0")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-icon-1")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-icon-2")).toBeInTheDocument();
  });

  it("renders views skeleton", () => {
    expect(screen.getByTestId("skeleton-views")).toBeInTheDocument();
  });

  it("renders content section", () => {
    expect(screen.getByTestId("skeleton-content-section")).toBeInTheDocument();
  });

  it("renders avatar skeleton", () => {
    expect(screen.getByTestId("skeleton-avatar")).toBeInTheDocument();
  });

  it("renders tag skeletons", () => {
    expect(screen.getByTestId("skeleton-tags")).toBeInTheDocument();
  });
});
