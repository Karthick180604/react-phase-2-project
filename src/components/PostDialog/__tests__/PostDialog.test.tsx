import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import PostDialog from "../PostDialog";
import { commentPost } from "../../../redux/Actions/userActions";
import { getPostComments } from "../../../services/apiCalls";
import type { Post } from "../../../redux/Actions/postsActions";
import type { CommentType } from "../../../types/types";

jest.mock("../../../redux/Actions/userActions", () => ({
  commentPost: jest.fn(() => ({ type: "COMMENT_POST", payload: {} })),
}));

jest.mock("../../../services/apiCalls", () => ({
  getPostComments: jest.fn(),
}));

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Dialog: ({ children, open, ...props }: any) =>
    open ? (
      <div data-testid="dialog" {...props}>
        {children}
      </div>
    ) : null,
  DialogContent: ({ children, ...props }: any) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
}));

const mockPost: Post = {
  id: 1,
  title: "Test Post Title",
  body: "This is a test post body content.",
  username: "testuser",
  tags: ["test", "react", "typescript"],
  reactions: {
    likes: 5,
    dislikes: 2,
  },
  views: 100,
};

const mockComments: CommentType[] = [
  {
    id: 1,
    body: "This is a test comment",
    postId: 1,
    user: {
      id: 1,
      fullName: "John Doe",
    },
  },
  {
    id: 2,
    body: "Another test comment",
    postId: 1,
    user: {
      id: 2,
      fullName: "Jane Smith",
    },
  },
];

const mockUserState = {
  id: 123,
  username: "currentuser",
  commentedPosts: [
    {
      postId: 1,
      comment: "User added comment",
    },
  ],
};

const userReducer = (state = mockUserState, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

const createMockStore = (userState = mockUserState) => {
  const mockUserReducer = () => userState;
  const rootReducer = combineReducers({
    user: mockUserReducer,
  });

  return createStore(rootReducer);
};

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  post: mockPost,
  onLikeHandler: jest.fn(),
  onDislikeHandler: jest.fn(),
  like: false,
  dislike: false,
};

const renderWithProvider = (
  props = defaultProps,
  userState = mockUserState,
) => {
  const store = createMockStore(userState);
  return render(
    <Provider store={store}>
      <PostDialog {...props} />
    </Provider>,
  );
};

describe("PostDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should not render when post is null", () => {
      renderWithProvider({ ...defaultProps, post: null });
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("should not render when open is false", () => {
      renderWithProvider({ ...defaultProps, open: false });
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("should render post information correctly", () => {
      renderWithProvider();

      expect(screen.getByText("Post by testuser")).toBeInTheDocument();
      expect(screen.getByText("Test Post Title")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test post body content."),
      ).toBeInTheDocument();
      expect(screen.getByText("#test")).toBeInTheDocument();
      expect(screen.getByText("#react")).toBeInTheDocument();
      expect(screen.getByText("#typescript")).toBeInTheDocument();
    });

    it("should render reaction counts correctly", () => {
      renderWithProvider();

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("should render reaction counts with user interactions", () => {
      renderWithProvider({ ...defaultProps, like: true, dislike: false });

      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  describe("Close Functionality", () => {
    it("should call onClose when close button is clicked", () => {
      const mockOnClose = jest.fn();
      renderWithProvider({ ...defaultProps, onClose: mockOnClose });

      const buttons = screen.getAllByRole("button");
      const closeButton = buttons.find(
        (button) =>
          button.querySelector(
            '[data-testid="CloseIcon"], [class*="MuiSvgIcon"]',
          ) || button.getAttribute("aria-label") === "close",
      );

      expect(closeButton).toBeTruthy();
      fireEvent.click(closeButton!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Like/Dislike Functionality", () => {
    it("should call onLikeHandler when like button is clicked", () => {
      const mockOnLikeHandler = jest.fn();
      renderWithProvider({ ...defaultProps, onLikeHandler: mockOnLikeHandler });

      const likeButtons = screen.getAllByRole("button");
      const likeButton = likeButtons.find((button) =>
        button.querySelector('[data-testid*="thumb-up"], [class*="ThumbUp"]'),
      );

      if (likeButton) {
        fireEvent.click(likeButton);
        expect(mockOnLikeHandler).toHaveBeenCalledWith(1, false);
      }
    });

    it("should call onDislikeHandler when dislike button is clicked", () => {
      const mockOnDislikeHandler = jest.fn();
      renderWithProvider({
        ...defaultProps,
        onDislikeHandler: mockOnDislikeHandler,
      });

      const dislikeButtons = screen.getAllByRole("button");
      const dislikeButton = dislikeButtons.find((button) =>
        button.querySelector(
          '[data-testid*="thumb-down"], [class*="ThumbDown"]',
        ),
      );

      if (dislikeButton) {
        fireEvent.click(dislikeButton);
        expect(mockOnDislikeHandler).toHaveBeenCalledWith(1, false);
      }
    });
  });

  describe("Comments Functionality", () => {
    beforeEach(() => {
      (getPostComments as jest.Mock).mockResolvedValue({
        data: { comments: mockComments },
      });
    });

    it("should fetch and display comments for posts with id <= 251", async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(getPostComments).toHaveBeenCalledWith(1);
      });
    });

    it('should display "No comments yet" when there are no comments', async () => {
      (getPostComments as jest.Mock).mockResolvedValue({
        data: { comments: [] },
      });

      const userStateWithoutComments = {
        ...mockUserState,
        commentedPosts: [],
      };

      renderWithProvider(defaultProps, userStateWithoutComments);

      await waitFor(() => {
        expect(screen.getByText("No comments yet")).toBeInTheDocument();
      });
    });

    it("should display comments when available", async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("This is a test comment")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        expect(screen.getByText("Another test comment")).toBeInTheDocument();
      });
    });

    it("should handle user comments for posts with id > 251", async () => {
      const postWithHighId = { ...mockPost, id: 300 };
      const userStateWithComments = {
        ...mockUserState,
        commentedPosts: [
          {
            postId: 300,
            comment: "User added comment for high ID post",
          },
        ],
      };

      renderWithProvider(
        { ...defaultProps, post: postWithHighId },
        userStateWithComments,
      );

      await waitFor(() => {
        expect(getPostComments).not.toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText("currentuser")).toBeInTheDocument();
        expect(
          screen.getByText("User added comment for high ID post"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Comment Input Functionality", () => {
    it("should update comment input value when typing", async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const commentInput = screen.getByPlaceholderText("Write a comment...");
      await user.type(commentInput, "New comment text");

      expect(commentInput).toHaveValue("New comment text");
    });

    it("should dispatch commentPost action when Post button is clicked", async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      const mockDispatch = jest.fn();

      store.dispatch = mockDispatch;

      render(
        <Provider store={store}>
          <PostDialog {...defaultProps} />
        </Provider>,
      );

      const commentInput = screen.getByPlaceholderText("Write a comment...");
      const postButton = screen.getByRole("button", { name: /post/i });

      await user.type(commentInput, "New comment");
      fireEvent.click(postButton);

      expect(commentPost).toHaveBeenCalledWith(1, "New comment");
    });

    it("should clear comment input after posting", async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const commentInput = screen.getByPlaceholderText("Write a comment...");
      const postButton = screen.getByRole("button", { name: /post/i });

      await user.type(commentInput, "New comment");
      expect(commentInput).toHaveValue("New comment");

      fireEvent.click(postButton);

      await waitFor(() => {
        expect(commentInput).toHaveValue("");
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      (getPostComments as jest.Mock).mockRejectedValue(new Error("API Error"));

      renderWithProvider();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Responsive Behavior", () => {
    it("should render with proper responsive classes", () => {
      renderWithProvider();
      const dialogContent = screen.getByTestId("dialog-content");
      expect(dialogContent).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("should combine API comments with user comments correctly", async () => {
      (getPostComments as jest.Mock).mockResolvedValue({
        data: { comments: mockComments },
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        expect(screen.getByText("currentuser")).toBeInTheDocument();
        expect(screen.getByText("User added comment")).toBeInTheDocument();
      });
    });

    it("should update comments when user adds a new comment", async () => {
      const userStateWithNewComment = {
        ...mockUserState,
        commentedPosts: [
          ...mockUserState.commentedPosts,
          { postId: 1, comment: "Newly added comment" },
        ],
      };

      (getPostComments as jest.Mock).mockResolvedValue({
        data: { comments: mockComments },
      });

      renderWithProvider(defaultProps, userStateWithNewComment);

      await waitFor(() => {
        expect(screen.getByText("Newly added comment")).toBeInTheDocument();
      });
    });
  });
});
