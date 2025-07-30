import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostCardSmall from "../PostCardSmall";

describe("PostCardSmall Component", () => {
  const mockOnReadMore = jest.fn();

  const defaultProps = {
    id: 1,
    title: "Test Post Title",
    body: "This is a test post body content that should be displayed in the card.",
    onReadMore: mockOnReadMore,
  };

  const renderComponent = (props = {}) => {
    return render(<PostCardSmall {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all basic elements correctly", () => {
      renderComponent();

      expect(screen.getByTestId("postcard-small")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-image")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-content")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-title")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-body")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-readmore")).toBeInTheDocument();
    });

    it("displays correct image URL based on id", () => {
      renderComponent({ id: 42 });

      const imageElement = screen.getByTestId("postcard-image");
      expect(imageElement).toHaveStyle(
        "background-image: url(https://picsum.photos/id/42/600/400)",
      );
    });

    it("displays image URL with different id", () => {
      renderComponent({ id: 999 });

      const imageElement = screen.getByTestId("postcard-image");
      expect(imageElement).toHaveStyle(
        "background-image: url(https://picsum.photos/id/999/600/400)",
      );
    });

    it("displays 'Read more' text correctly", () => {
      renderComponent();

      const readMoreElement = screen.getByTestId("postcard-readmore");
      expect(readMoreElement).toHaveTextContent("Read more");
    });
  });

  describe("Title Truncation Logic", () => {
    it("displays full title when length is exactly 60 characters", () => {
      const exactTitle = "A".repeat(60);
      renderComponent({ title: exactTitle });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent(exactTitle);
      expect(titleElement.textContent).not.toContain("...");
    });

    it("displays full title when length is less than 60 characters", () => {
      const shortTitle = "Short title";
      renderComponent({ title: shortTitle });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent(shortTitle);
      expect(titleElement.textContent).not.toContain("...");
    });

    it("truncates title when length is greater than 60 characters", () => {
      const longTitle = "A".repeat(65);
      const expectedTruncated = "A".repeat(60) + "...";
      renderComponent({ title: longTitle });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent(expectedTruncated);
      expect(titleElement.textContent).toHaveLength(63);
    });

    it("truncates title at exactly 61 characters", () => {
      const title61Chars = "A".repeat(61);
      const expectedTruncated = "A".repeat(60) + "...";
      renderComponent({ title: title61Chars });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent(expectedTruncated);
    });

    it("handles empty title", () => {
      renderComponent({ title: "" });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent("");
    });

    it("handles single character title", () => {
      renderComponent({ title: "A" });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent("A");
    });
  });

  describe("Body Truncation Logic", () => {
    it("displays full body when length is exactly 100 characters followed by space", () => {
      const exactBody = "A".repeat(100);
      renderComponent({ body: exactBody });

      const bodyElement = screen.getByTestId("postcard-body");
      expect(bodyElement.textContent).toContain(exactBody + " Read more");
      expect(bodyElement.textContent).not.toContain("...");
    });

    it("displays full body when length is less than 100 characters", () => {
      const shortBody = "Short body content";
      renderComponent({ body: shortBody });

      const bodyElement = screen.getByTestId("postcard-body");
      expect(bodyElement.textContent).toContain(shortBody + " Read more");
      expect(bodyElement.textContent).not.toContain("...");
    });

    it("truncates body when length is greater than 100 characters", () => {
      const longBody = "A".repeat(105);
      const expectedTruncated = "A".repeat(100);
      renderComponent({ body: longBody });

      const bodyElement = screen.getByTestId("postcard-body");
      expect(bodyElement.textContent).toContain(
        expectedTruncated + "... Read more",
      );
      expect(bodyElement.textContent).not.toContain("A".repeat(105));
    });

    it("truncates body at exactly 101 characters", () => {
      const body101Chars = "A".repeat(101);
      const expectedTruncated = "A".repeat(100);
      renderComponent({ body: body101Chars });

      const bodyElement = screen.getByTestId("postcard-body");
      expect(bodyElement.textContent).toContain(
        expectedTruncated + "... Read more",
      );
    });

    it("handles empty body", () => {
      renderComponent({ body: "" });

      const bodyElement = screen.getByTestId("postcard-body");
      expect(bodyElement.textContent).toContain(" Read more");
    });

    it("handles single character body", () => {
      renderComponent({ body: "A" });

      const bodyElement = screen.getByTestId("postcard-body");
      expect(bodyElement.textContent).toContain("A Read more");
    });
  });

  describe("Read More Functionality", () => {
    it("calls onReadMore when read more is clicked", async () => {
      renderComponent();

      const readMoreElement = screen.getByTestId("postcard-readmore");
      await userEvent.click(readMoreElement);

      expect(mockOnReadMore).toHaveBeenCalledTimes(1);
    });

    it("calls onReadMore multiple times when clicked multiple times", async () => {
      renderComponent();

      const readMoreElement = screen.getByTestId("postcard-readmore");
      await userEvent.click(readMoreElement);
      await userEvent.click(readMoreElement);
      await userEvent.click(readMoreElement);

      expect(mockOnReadMore).toHaveBeenCalledTimes(3);
    });

    it("has proper cursor pointer styling", () => {
      renderComponent();

      const readMoreElement = screen.getByTestId("postcard-readmore");
      expect(readMoreElement).toHaveStyle("cursor: pointer");
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("handles id of 0", () => {
      renderComponent({ id: 0 });

      const imageElement = screen.getByTestId("postcard-image");
      expect(imageElement).toHaveStyle(
        "background-image: url(https://picsum.photos/id/0/600/400)",
      );
    });

    it("handles negative id", () => {
      renderComponent({ id: -5 });

      const imageElement = screen.getByTestId("postcard-image");
      expect(imageElement).toHaveStyle(
        "background-image: url(https://picsum.photos/id/-5/600/400)",
      );
    });

    it("handles very large id", () => {
      renderComponent({ id: 999999 });

      const imageElement = screen.getByTestId("postcard-image");
      expect(imageElement).toHaveStyle(
        "background-image: url(https://picsum.photos/id/999999/600/400)",
      );
    });

    it("handles special characters in title", () => {
      const specialTitle = "Title with special chars: @#$%^&*()";
      renderComponent({ title: specialTitle });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent(specialTitle);
    });

    it("handles special characters in body", () => {
      const specialBody = "Body with special chars: @#$%^&*()";
      renderComponent({ body: specialBody });

      const bodyElement = screen.getByTestId("postcard-body");
      expect(bodyElement.textContent).toContain(specialBody);
    });

    it("handles unicode characters in title", () => {
      const unicodeTitle = "Title with unicode: 你好世界 🌍 émojis";
      renderComponent({ title: unicodeTitle });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent(unicodeTitle);
    });

    it("handles unicode characters in body", () => {
      const unicodeBody = "Body with unicode: 你好世界 🌍 émojis";
      renderComponent({ body: unicodeBody });

      const bodyElement = screen.getByTestId("postcard-body");
      expect(bodyElement.textContent).toContain(unicodeBody);
    });

    it("handles newlines and whitespace in title", () => {
      const titleWithNewlines = "Title\nwith\nnewlines\tand\ttabs   and spaces";
      renderComponent({ title: titleWithNewlines });

      const titleElement = screen.getByTestId("postcard-title");
      expect(titleElement).toHaveTextContent(
        "Title with newlines and tabs and spaces",
      );
    });
  });

  describe("Combined Truncation Scenarios", () => {
    it("handles both title and body needing truncation", () => {
      const longTitle = "A".repeat(70);
      const longBody = "B".repeat(110);
      renderComponent({ title: longTitle, body: longBody });

      const titleElement = screen.getByTestId("postcard-title");
      const bodyElement = screen.getByTestId("postcard-body");

      expect(titleElement.textContent).toBe("A".repeat(60) + "...");
      expect(bodyElement.textContent).toContain(
        "B".repeat(100) + "... Read more",
      );
    });

    it("handles long title with short body", () => {
      const longTitle = "A".repeat(70);
      const shortBody = "Short";
      renderComponent({ title: longTitle, body: shortBody });

      const titleElement = screen.getByTestId("postcard-title");
      const bodyElement = screen.getByTestId("postcard-body");

      expect(titleElement.textContent).toBe("A".repeat(60) + "...");
      expect(bodyElement.textContent).toContain("Short Read more");
    });

    it("handles short title with long body", () => {
      const shortTitle = "Short";
      const longBody = "B".repeat(110);
      renderComponent({ title: shortTitle, body: longBody });

      const titleElement = screen.getByTestId("postcard-title");
      const bodyElement = screen.getByTestId("postcard-body");

      expect(titleElement.textContent).toBe("Short");
      expect(bodyElement.textContent).toContain(
        "B".repeat(100) + "... Read more",
      );
    });
  });

  describe("Component Structure and Styling", () => {
    it("has correct data-testid attributes", () => {
      renderComponent();

      expect(screen.getByTestId("postcard-small")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-image")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-content")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-title")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-body")).toBeInTheDocument();
      expect(screen.getByTestId("postcard-readmore")).toBeInTheDocument();
    });

    it("applies correct styling to read more element", () => {
      renderComponent();

      const readMoreElement = screen.getByTestId("postcard-readmore");
      expect(readMoreElement).toHaveStyle({
        color: "#1976d2",
        cursor: "pointer",
        fontWeight: "500",
      });
    });

    it("renders as a span component for read more", () => {
      renderComponent();

      const readMoreElement = screen.getByTestId("postcard-readmore");
      expect(readMoreElement.tagName).toBe("SPAN");
    });
  });

  describe("Accessibility", () => {
    it("has clickable read more element", async () => {
      renderComponent();

      const readMoreElement = screen.getByTestId("postcard-readmore");
      expect(readMoreElement).toBeInTheDocument();

      await userEvent.click(readMoreElement);
      expect(mockOnReadMore).toHaveBeenCalled();
    });

    it("maintains text hierarchy with proper Typography variants", () => {
      renderComponent();

      const titleElement = screen.getByTestId("postcard-title");
      const bodyElement = screen.getByTestId("postcard-body");

      expect(
        titleElement.closest('[class*="MuiTypography"]'),
      ).toBeInTheDocument();
      expect(
        bodyElement.closest('[class*="MuiTypography"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("handles all required props correctly", () => {
      const customProps = {
        id: 123,
        title: "Custom Title",
        body: "Custom Body Content",
        onReadMore: jest.fn(),
      };

      renderComponent(customProps);

      expect(screen.getByTestId("postcard-title")).toHaveTextContent(
        "Custom Title",
      );
      expect(screen.getByTestId("postcard-body")).toHaveTextContent(
        "Custom Body Content",
      );

      const imageElement = screen.getByTestId("postcard-image");
      expect(imageElement).toHaveStyle(
        "background-image: url(https://picsum.photos/id/123/600/400)",
      );
    });

    it("handles prop updates correctly", () => {
      const { rerender } = renderComponent({ title: "Original Title" });

      expect(screen.getByTestId("postcard-title")).toHaveTextContent(
        "Original Title",
      );

      rerender(<PostCardSmall {...defaultProps} title="Updated Title" />);

      expect(screen.getByTestId("postcard-title")).toHaveTextContent(
        "Updated Title",
      );
    });
  });
});
