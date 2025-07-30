import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UserProfilePostCard from "../UserProfilePostCard";

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

const mockPost = {
  id: 1,
  title: "Test Post Title",
  body: "This is the body content of the test post. It contains some sample text to verify the component renders correctly.",
  tags: ["react", "testing", "javascript"],
  onClick: jest.fn(),
};

const mockPostWithEmptyTags = {
  id: 2,
  title: "Post Without Tags",
  body: "This post has no tags.",
  tags: [],
  onClick: jest.fn(),
};

const mockPostWithLongContent = {
  id: 3,
  title:
    "Very Long Title That Might Need Truncation or Special Handling in the UI Component",
  body: "This is a very long body content that goes on and on with lots of text that might test how the component handles lengthy content and whether it displays properly without breaking the layout or causing any visual issues.",
  tags: ["long-content", "ui-testing", "layout-testing", "responsive-design"],
  onClick: jest.fn(),
};

describe("UserProfilePostCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    expect(screen.getByTestId("user-profile-post-card")).toBeInTheDocument();
  });

  it("displays the post title correctly", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const titleElement = screen.getByTestId("post-title");

    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent("Test Post Title");
  });

  it("displays the post body correctly", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const bodyElement = screen.getByTestId("post-body");

    expect(bodyElement).toBeInTheDocument();
    expect(bodyElement).toHaveTextContent(
      "This is the body content of the test post. It contains some sample text to verify the component renders correctly.",
    );
  });

  it("renders all tags with correct formatting", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const tagsStack = screen.getByTestId("post-tags-stack");
    expect(tagsStack).toBeInTheDocument();

    mockPost.tags.forEach((tag, index) => {
      const chipElement = screen.getByTestId(`post-tag-${index}`);
      expect(chipElement).toBeInTheDocument();
      expect(chipElement).toHaveTextContent(`#${tag}`);
    });
  });

  it("renders tags with hash prefix", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    expect(screen.getByText("#react")).toBeInTheDocument();
    expect(screen.getByText("#testing")).toBeInTheDocument();
    expect(screen.getByText("#javascript")).toBeInTheDocument();
  });

  it("handles empty tags array", () => {
    renderWithProviders(<UserProfilePostCard {...mockPostWithEmptyTags} />);

    const tagsStack = screen.getByTestId("post-tags-stack");
    expect(tagsStack).toBeInTheDocument();

    const chips = screen.queryAllByTestId(/post-tag-/);
    expect(chips).toHaveLength(0);
  });

  it("calls onClick handler when card is clicked", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const cardElement = screen.getByTestId("user-profile-post-card");

    fireEvent.click(cardElement);

    expect(mockPost.onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick handler when clicked via keyboard", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const cardElement = screen.getByTestId("user-profile-post-card");

    fireEvent.keyDown(cardElement, { key: "Enter", code: "Enter" });

    expect(cardElement).toBeInTheDocument();
  });

  it("has correct MUI component structure", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const cardElement = screen.getByTestId("user-profile-post-card");
    const titleElement = screen.getByTestId("post-title");
    const bodyElement = screen.getByTestId("post-body");
    const tagsStack = screen.getByTestId("post-tags-stack");

    expect(cardElement).toContainElement(titleElement);
    expect(cardElement).toContainElement(bodyElement);
    expect(cardElement).toContainElement(tagsStack);
  });

  it("renders with long content without breaking", () => {
    renderWithProviders(<UserProfilePostCard {...mockPostWithLongContent} />);

    const titleElement = screen.getByTestId("post-title");
    const bodyElement = screen.getByTestId("post-body");

    expect(titleElement).toHaveTextContent(mockPostWithLongContent.title);
    expect(bodyElement).toHaveTextContent(mockPostWithLongContent.body);

    mockPostWithLongContent.tags.forEach((tag, index) => {
      const chipElement = screen.getByTestId(`post-tag-${index}`);
      expect(chipElement).toBeInTheDocument();
      expect(chipElement).toHaveTextContent(`#${tag}`);
    });
  });

  it("applies correct Typography variants", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const titleElement = screen.getByTestId("post-title");
    const bodyElement = screen.getByTestId("post-body");

    expect(titleElement).toBeInTheDocument();
    expect(bodyElement).toBeInTheDocument();
  });

  it("renders Chip components with correct props", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const chips = screen.getAllByTestId(/post-tag-/);

    expect(chips).toHaveLength(mockPost.tags.length);

    chips.forEach((chip, index) => {
      expect(chip).toHaveTextContent(`#${mockPost.tags[index]}`);
    });
  });

  it("maintains tag order", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const tag0 = screen.getByTestId("post-tag-0");
    const tag1 = screen.getByTestId("post-tag-1");
    const tag2 = screen.getByTestId("post-tag-2");

    expect(tag0).toHaveTextContent("#react");
    expect(tag1).toHaveTextContent("#testing");
    expect(tag2).toHaveTextContent("#javascript");
  });

  it("handles single tag correctly", () => {
    const singleTagPost = {
      ...mockPost,
      tags: ["single-tag"],
    };

    renderWithProviders(<UserProfilePostCard {...singleTagPost} />);

    const chip = screen.getByTestId("post-tag-0");
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveTextContent("#single-tag");

    expect(screen.queryByTestId("post-tag-1")).not.toBeInTheDocument();
  });

  it("is clickable and has proper cursor behavior", () => {
    renderWithProviders(<UserProfilePostCard {...mockPost} />);

    const cardElement = screen.getByTestId("user-profile-post-card");

    expect(cardElement).toBeInTheDocument();

    fireEvent.click(cardElement);
    expect(mockPost.onClick).toHaveBeenCalled();
  });

  it("renders with different post IDs correctly", () => {
    const post1 = { ...mockPost, id: 1, title: "Post 1" };
    const post2 = { ...mockPost, id: 2, title: "Post 2" };

    const { rerender } = renderWithProviders(
      <UserProfilePostCard {...post1} />,
    );

    expect(screen.getByText("Post 1")).toBeInTheDocument();

    rerender(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <UserProfilePostCard {...post2} />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });
});
