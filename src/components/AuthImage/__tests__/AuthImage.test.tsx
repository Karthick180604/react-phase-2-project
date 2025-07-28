import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AuthImage from "../AuthImage";

jest.mock(
  "../../../assets/socialMediaPng.png",
  () => "test-social-media-image-stub",
);

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("AuthImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the image component", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });

  it("renders image with correct src attribute", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "test-social-media-image-stub");
  });

  it("renders image with correct alt text", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Connectify App Preview");
  });

  it("renders image with correct alt text using getByAltText", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByAltText("Connectify App Preview");
    expect(image).toBeInTheDocument();
  });

  it("applies correct styling to the image", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByRole("img");

    expect(image).toHaveStyle({
      width: "100%",
      height: "100%",
      "object-fit": "contain",
    });
  });

  it("renders as img element through MUI Box component", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByRole("img");
    expect(image.tagName).toBe("IMG");
  });

  it("component has accessible image", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("alt", "Connectify App Preview");
    expect(image).toBeVisible();
  });

  it("image loads with correct props", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("src", "test-social-media-image-stub");
    expect(image).toHaveAttribute("alt", "Connectify App Preview");
  });

  it("component renders without crashing", () => {
    expect(() => {
      renderWithProviders(<AuthImage />);
    }).not.toThrow();
  });

  it("matches expected structure", () => {
    const { container } = renderWithProviders(<AuthImage />);

    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(1);
  });

  it("has correct component composition", () => {
    renderWithProviders(<AuthImage />);

    const image = screen.getByRole("img");

    expect(image).toHaveStyle({
      width: "100%",
      height: "100%",
    });
  });

  it("image element is properly rendered by MUI Box", () => {
    renderWithProviders(<AuthImage />);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByAltText("Connectify App Preview")).toBeInTheDocument();
  });
});
