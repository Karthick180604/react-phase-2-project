import { render, screen } from "@testing-library/react";
import PostCardSmallSkeleton from "../PostCardSmallSkeleton";

describe("PostCardSmallSkeleton Component", () => {
  beforeEach(() => {
    render(<PostCardSmallSkeleton />);
  });

  it("renders the main skeleton card", () => {
    expect(screen.getByTestId("post-card-skeleton")).toBeInTheDocument();
  });

  it("renders the image skeleton box and image", () => {
    expect(
      screen.getByTestId("post-card-skeleton-image-box"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("post-card-skeleton-image")).toBeInTheDocument();
  });

  it("renders the content skeleton section", () => {
    expect(
      screen.getByTestId("post-card-skeleton-content"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("post-card-skeleton-title")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-skeleton-line1")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-skeleton-line2")).toBeInTheDocument();
  });
});
