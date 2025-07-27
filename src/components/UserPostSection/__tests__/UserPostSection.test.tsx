//cleared tests
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UserPostSection from "../UserPostSection";
import type { Post } from "../../../redux/Actions/postsActions";
import {
  dislikePost,
  likePost,
  removeDislikePost,
  removeLikePost,
} from "../../../redux/Actions/userActions";

// Mock the components
jest.mock("../../UserProfilePostCard/UserProfilePostCard", () => {
  return function MockUserProfilePostCard({ 
    id, 
    title, 
    body, 
    tags, 
    onClick 
  }: {
    id: number;
    title: string;
    body: string;
    tags: string[];
    onClick: () => void;
  }) {
    return (
      <div 
        data-testid={`post-card-${id}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <h3>{title}</h3>
        <p>{body}</p>
        <div data-testid={`tags-${id}`}>
          {tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>
    );
  };
});

jest.mock("../../PostDialog/PostDialog", () => {
  return function MockPostDialog({ 
    open, 
    onClose, 
    post, 
    onLikeHandler, 
    onDislikeHandler,
    like,
    dislike
  }: {
    open: boolean;
    onClose: () => void;
    post: any;
    onLikeHandler: (postId: number, like: boolean) => void;
    onDislikeHandler: (postId: number, dislike: boolean) => void;
    like: boolean;
    dislike: boolean;
  }) {
    if (!open) return null;
    
    return (
      <div data-testid="post-dialog">
        <button onClick={onClose} data-testid="close-dialog">
          Close
        </button>
        {post && (
          <div>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button
              onClick={() => onLikeHandler(post.id, like)}
              data-testid="like-button"
            >
              {like ? "Unlike" : "Like"}
            </button>
            <button
              onClick={() => onDislikeHandler(post.id, dislike)}
              data-testid="dislike-button"
            >
              {dislike ? "Remove Dislike" : "Dislike"}
            </button>
          </div>
        )}
      </div>
    );
  };
});

// Mock Redux actions
jest.mock("../../../redux/Actions/userActions", () => ({
  likePost: jest.fn((postId) => ({ type: 'LIKE_POST', payload: postId })),
  removeLikePost: jest.fn((postId) => ({ type: 'REMOVE_LIKE_POST', payload: postId })),
  dislikePost: jest.fn((postId) => ({ type: 'DISLIKE_POST', payload: postId })),
  removeDislikePost: jest.fn((postId) => ({ type: 'REMOVE_DISLIKE_POST', payload: postId })),
}));

// Create mock reducer
const mockUserReducer = (
  state = { likedPostId: [], dislikePostId: [] },
  action: any
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const mockRootReducer = (state: any = {}, action: any) => ({
  user: mockUserReducer(state.user, action),
});

// Create mock store
const createMockStore = (initialState = {}) => {
  const defaultState = {
    user: {
      likedPostId: [],
      dislikePostId: [],
      ...initialState.user,
    },
  };

  return createStore(mockRootReducer, defaultState);
};

// Create MUI theme for testing
const theme = createTheme();

// Test wrapper component
const TestWrapper: React.FC<{ 
  children: React.ReactNode; 
  store?: any;
}> = ({ children, store }) => {
  const mockStore = store || createMockStore();
  
  return (
    <Provider store={mockStore}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </Provider>
  );
};

// Mock data
const mockPosts: Post[] = [
  {
    id: 1,
    title: "First Post",
    body: "This is the first post content",
    tags: ["react", "testing"],
  },
  {
    id: 2,
    title: "Second Post",
    body: "This is the second post content",
    tags: ["javascript", "jest"],
  },
  {
    id: 3,
    title: "Third Post",
    body: "This is the third post content",
    tags: ["typescript"],
  },
];

describe("UserPostSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the Posts title", () => {
      render(
        <TestWrapper>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      expect(screen.getByText("Posts")).toBeInTheDocument();
    });

    it("renders all posts when posts array is provided", () => {
      render(
        <TestWrapper>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-3")).toBeInTheDocument();
    });

    it("renders empty section when no posts are provided", () => {
      render(
        <TestWrapper>
          <UserPostSection posts={[]} />
        </TestWrapper>
      );

      expect(screen.getByText("Posts")).toBeInTheDocument();
      expect(screen.queryByTestId(/post-card/)).not.toBeInTheDocument();
    });

    it("renders post content correctly", () => {
      render(
        <TestWrapper>
          <UserPostSection posts={[mockPosts[0]]} />
        </TestWrapper>
      );

      expect(screen.getByText("First Post")).toBeInTheDocument();
      expect(screen.getByText("This is the first post content")).toBeInTheDocument();
      expect(screen.getByText("react")).toBeInTheDocument();
      expect(screen.getByText("testing")).toBeInTheDocument();
    });
  });

  describe("Post Dialog Interaction", () => {
    it("opens dialog when post card is clicked", async () => {
      render(
        <TestWrapper>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      const postCard = screen.getByTestId("post-card-1");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
      });

      // Check if dialog shows the post content (title will appear in both card and dialog)
      const dialogElement = screen.getByTestId("post-dialog");
      expect(dialogElement).toContainElement(screen.getAllByText("First Post")[1]); // Get the one in dialog
    });

    it("closes dialog when close button is clicked", async () => {
      render(
        <TestWrapper>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      // Open dialog
      const postCard = screen.getByTestId("post-card-1");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
      });

      // Close dialog
      const closeButton = screen.getByTestId("close-dialog");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("post-dialog")).not.toBeInTheDocument();
      });
    });

    it("opens dialog with correct post data", async () => {
      render(
        <TestWrapper>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      const postCard = screen.getByTestId("post-card-2");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
      });

      // Check dialog content by querying within the dialog
      const dialogElement = screen.getByTestId("post-dialog");
      expect(dialogElement).toBeInTheDocument();
      
      // Use within to query inside the dialog specifically
      const { getByText } = within(dialogElement);
      expect(getByText("Second Post")).toBeInTheDocument();
      expect(getByText("This is the second post content")).toBeInTheDocument();
    });
  });

  describe("Like/Dislike Functionality", () => {
    it("dispatches likePost action when like button is clicked and post is not liked", async () => {
      const mockStore = createMockStore({
        user: {
          likedPostId: [],
          dislikePostId: [],
        },
      });

      render(
        <TestWrapper store={mockStore}>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      // Open dialog
      const postCard = screen.getByTestId("post-card-1");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
      });

      // Click like button
      const likeButton = screen.getByTestId("like-button");
      fireEvent.click(likeButton);

      expect(likePost).toHaveBeenCalledWith(1);
    });

    it("dispatches removeLikePost action when like button is clicked and post is already liked", async () => {
      const mockStore = createMockStore({
        user: {
          likedPostId: [1],
          dislikePostId: [],
        },
      });

      render(
        <TestWrapper store={mockStore}>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      // Open dialog
      const postCard = screen.getByTestId("post-card-1");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
      });

      // Click like button (to unlike)
      const likeButton = screen.getByTestId("like-button");
      fireEvent.click(likeButton);

      expect(removeLikePost).toHaveBeenCalledWith(1);
    });

    it("dispatches dislikePost action when dislike button is clicked and post is not disliked", async () => {
      const mockStore = createMockStore({
        user: {
          likedPostId: [],
          dislikePostId: [],
        },
      });

      render(
        <TestWrapper store={mockStore}>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      // Open dialog
      const postCard = screen.getByTestId("post-card-1");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
      });

      // Click dislike button
      const dislikeButton = screen.getByTestId("dislike-button");
      fireEvent.click(dislikeButton);

      expect(dislikePost).toHaveBeenCalledWith(1);
    });

    it("dispatches removeDislikePost action when dislike button is clicked and post is already disliked", async () => {
      const mockStore = createMockStore({
        user: {
          likedPostId: [],
          dislikePostId: [1],
        },
      });

      render(
        <TestWrapper store={mockStore}>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      // Open dialog
      const postCard = screen.getByTestId("post-card-1");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
      });

      // Click dislike button (to remove dislike)
      const dislikeButton = screen.getByTestId("dislike-button");
      fireEvent.click(dislikeButton);

      expect(removeDislikePost).toHaveBeenCalledWith(1);
    });
  });

  describe("Like/Dislike State Display", () => {
    it("shows correct like state in dialog", async () => {
      const mockStore = createMockStore({
        user: {
          likedPostId: [1],
          dislikePostId: [],
        },
      });

      render(
        <TestWrapper store={mockStore}>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      // Open dialog
      const postCard = screen.getByTestId("post-card-1");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
        expect(screen.getByText("Unlike")).toBeInTheDocument();
      });
    });

    it("shows correct dislike state in dialog", async () => {
      const mockStore = createMockStore({
        user: {
          likedPostId: [],
          dislikePostId: [1],
        },
      });

      render(
        <TestWrapper store={mockStore}>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      // Open dialog
      const postCard = screen.getByTestId("post-card-1");
      fireEvent.click(postCard);

      await waitFor(() => {
        expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
        expect(screen.getByText("Remove Dislike")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles null selectedPost gracefully", () => {
      render(
        <TestWrapper>
          <UserPostSection posts={mockPosts} />
        </TestWrapper>
      );

      // Dialog should not be visible initially
      expect(screen.queryByTestId("post-dialog")).not.toBeInTheDocument();
    });

    it("handles posts with empty tags array", () => {
      const postsWithEmptyTags: Post[] = [
        {
          id: 1,
          title: "Post without tags",
          body: "This post has no tags",
          tags: [],
        },
      ];

      render(
        <TestWrapper>
          <UserPostSection posts={postsWithEmptyTags} />
        </TestWrapper>
      );

      expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      expect(screen.getByText("Post without tags")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("renders post cards with proper accessibility attributes", () => {
      render(
        <TestWrapper>
          <UserPostSection posts={[mockPosts[0]]} />
        </TestWrapper>
      );

      const postCard = screen.getByTestId("post-card-1");
      expect(postCard).toHaveAttribute("role", "button");
      expect(postCard).toHaveAttribute("tabIndex", "0");
    });
  });
});