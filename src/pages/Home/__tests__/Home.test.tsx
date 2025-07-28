import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../Home";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { ThemeProvider, createTheme } from "@mui/material/styles";

jest.mock("../../../assets/ApiErrorImage.png", () => ({
  default: "mocked-error-image.png",
}));

jest.mock("../../../components/PostCard/PostCard", () => {
  return function MockPostCard({
    post,
    onLikeHandler,
    onDislikeHandler,
    like,
    dislike,
    setSelectedPost,
  }: any) {
    return (
      <div data-testid={`post-card-${post.id}`}>
        <h3>{post.title}</h3>
        <button
          data-testid="like-button"
          onClick={() => onLikeHandler(post.id, like)}
        >
          {like ? "Unlike" : "Like"}
        </button>
        <button
          data-testid="dislike-button"
          onClick={() => onDislikeHandler(post.id, dislike)}
        >
          {dislike ? "Remove Dislike" : "Dislike"}
        </button>
        <button
          data-testid="select-post-button"
          onClick={() => setSelectedPost(post)}
        >
          Select Post
        </button>
      </div>
    );
  };
});

jest.mock("../../../components/PostSkeleton/PostSkeleton", () => {
  return function MockPostSkeleton() {
    return <div data-testid="post-skeleton">Loading...</div>;
  };
});

jest.mock("../../../components/PostDialog/PostDialog", () => {
  return function MockPostDialog({ open, onClose, post }: any) {
    if (!open) return null;
    return (
      <div data-testid="post-dialog">
        <h2>Post Dialog</h2>
        <p>Post: {post?.title}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock("../../../components/ApiError/ApiError", () => {
  return function MockApiError() {
    return <div data-testid="api-error-root">API Error Component</div>;
  };
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, "scrollY", {
  value: 0,
  writable: true,
});

const mockFetchPosts = jest.fn();
const mockLikePost = jest.fn();
const mockDislikePost = jest.fn();
const mockRemoveLikePost = jest.fn();
const mockRemoveDislikePost = jest.fn();

jest.mock("../../../redux/Actions/postsActions", () => ({
  fetchPosts: (...args: any[]) => mockFetchPosts(...args),
}));

jest.mock("../../../redux/Actions/userActions", () => ({
  likePost: (...args: any[]) => mockLikePost(...args),
  dislikePost: (...args: any[]) => mockDislikePost(...args),
  removeLikePost: (...args: any[]) => mockRemoveLikePost(...args),
  removeDislikePost: (...args: any[]) => mockRemoveDislikePost(...args),
}));

const initialPostsState = {
  posts: [],
  loading: false,
  error: null,
};

const initialUserState = {
  id: 1,
  firstName: "Jane",
  lastName: "Doe",
  username: "janedoe",
  image: "janedoe.png",
  uploadedPosts: [],
  likedPostId: [],
  dislikePostId: [],
};

const initialErrorState = {
  hasApiError: false,
};

const postsReducer = (state = initialPostsState, action: any) => {
  switch (action.type) {
    case "FETCH_POSTS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_POSTS_SUCCESS":
      return { ...state, loading: false, posts: action.payload };
    case "FETCH_POSTS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const userReducer = (state = initialUserState, action: any) => {
  switch (action.type) {
    case "LIKE_POST":
      return { ...state, likedPostId: [...state.likedPostId, action.payload] };
    case "REMOVE_LIKE_POST":
      return {
        ...state,
        likedPostId: state.likedPostId.filter((id) => id !== action.payload),
      };
    case "DISLIKE_POST":
      return {
        ...state,
        dislikePostId: [...state.dislikePostId, action.payload],
      };
    case "REMOVE_DISLIKE_POST":
      return {
        ...state,
        dislikePostId: state.dislikePostId.filter(
          (id) => id !== action.payload,
        ),
      };
    default:
      return state;
  }
};

const errorReducer = (state = initialErrorState, action: any) => {
  switch (action.type) {
    case "SET_API_ERROR":
      return { ...state, hasApiError: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  posts: postsReducer,
  user: userReducer,
  error: errorReducer,
});

const theme = createTheme();

const createMockStore = (initialState = {}) => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

const renderWithProviders = (
  component: React.ReactElement,
  initialState = {},
) => {
  const store = createMockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>{component}</BrowserRouter>
        </ThemeProvider>
      </Provider>,
    ),
    store,
  };
};

const mockPosts = [
  {
    id: 1,
    title: "Test Post 1",
    content: "This is test post 1",
    image: "post1.jpg",
    username: "user1",
    createdAt: "2023-01-01",
  },
  {
    id: 2,
    title: "Test Post 2",
    content: "This is test post 2",
    image: "post2.jpg",
    username: "user2",
    createdAt: "2023-01-02",
  },
];

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });

    mockFetchPosts.mockReturnValue(() =>
      Promise.resolve({
        type: "FETCH_POSTS_SUCCESS",
        payload: mockPosts,
      }),
    );

    mockLikePost.mockReturnValue({ type: "LIKE_POST", payload: 1 });
    mockDislikePost.mockReturnValue({ type: "DISLIKE_POST", payload: 1 });
    mockRemoveLikePost.mockReturnValue({
      type: "REMOVE_LIKE_POST",
      payload: 1,
    });
    mockRemoveDislikePost.mockReturnValue({
      type: "REMOVE_DISLIKE_POST",
      payload: 1,
    });
  });

  it("renders without crashing", async () => {
    renderWithProviders(<Home />);
    expect(screen.getByTestId("home-container")).toBeInTheDocument();
    expect(screen.getByText("Latest Posts")).toBeInTheDocument();
  });

  it("renders posts when available", async () => {
    const initialState = {
      posts: { ...initialPostsState, posts: mockPosts },
      user: initialUserState,
      error: initialErrorState,
    };

    renderWithProviders(<Home />, initialState);

    await waitFor(() => {
      expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });
  });

  it("calls fetchPosts on component mount", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(mockFetchPosts).toHaveBeenCalledWith(1, 10);
    });
  });

  it("calls like and dislike actions on button clicks", async () => {
    const initialState = {
      posts: { ...initialPostsState, posts: mockPosts },
      user: initialUserState,
      error: initialErrorState,
    };

    renderWithProviders(<Home />, initialState);

    await waitFor(() => {
      const likeButtons = screen.getAllByTestId("like-button");
      const dislikeButtons = screen.getAllByTestId("dislike-button");

      if (likeButtons.length > 0) {
        fireEvent.click(likeButtons[0]);
        expect(mockLikePost).toHaveBeenCalledWith(1);
      }

      if (dislikeButtons.length > 0) {
        fireEvent.click(dislikeButtons[0]);
        expect(mockDislikePost).toHaveBeenCalledWith(1);
      }
    });
  });

  it("scrolls to top when FAB is clicked", () => {
    renderWithProviders(<Home />);

    const fab = screen.getByTestId("scroll-top-fab");
    fireEvent.click(fab);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("shows loading skeletons when posts are loading", () => {
    const initialState = {
      posts: { ...initialPostsState, loading: true },
      user: initialUserState,
      error: initialErrorState,
    };

    renderWithProviders(<Home />, initialState);

    const skeletons = screen.getAllByTestId("post-skeleton");
    expect(skeletons).toHaveLength(3);
  });

  it("renders error component when apiError is true", () => {
    const initialState = {
      posts: initialPostsState,
      user: initialUserState,
      error: { hasApiError: true },
    };

    renderWithProviders(<Home />, initialState);

    expect(screen.getByTestId("api-error-root")).toBeInTheDocument();
    expect(screen.queryByTestId("home-container")).not.toBeInTheDocument();
  });

  it("opens and closes post dialog", async () => {
    const initialState = {
      posts: { ...initialPostsState, posts: mockPosts },
      user: initialUserState,
      error: initialErrorState,
    };

    renderWithProviders(<Home />, initialState);

    await waitFor(() => {
      const selectButton = screen.getAllByTestId("select-post-button")[0];
      fireEvent.click(selectButton);
    });

    expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
    expect(screen.getByText("Post: Test Post 1")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("post-dialog")).not.toBeInTheDocument();
  });

  it("handles scroll event for showing/hiding scroll-to-top button", () => {
    renderWithProviders(<Home />);

    Object.defineProperty(window, "scrollY", {
      value: 400,
      writable: true,
    });

    fireEvent.scroll(window);

    expect(screen.getByTestId("scroll-top-fab")).toBeInTheDocument();
  });

  it("renders user uploaded posts with user data", () => {
    const userUploadedPost = {
      id: 3,
      title: "User Post",
      content: "User content",
      createdAt: "2023-01-03",
    };

    const initialState = {
      posts: initialPostsState,
      user: {
        ...initialUserState,
        uploadedPosts: [userUploadedPost],
      },
      error: initialErrorState,
    };

    renderWithProviders(<Home />, initialState);

    expect(screen.getByTestId("post-card-3")).toBeInTheDocument();
    expect(screen.getByText("User Post")).toBeInTheDocument();
  });

  it("shows correct like/dislike button states", async () => {
    const initialState = {
      posts: { ...initialPostsState, posts: mockPosts },
      user: {
        ...initialUserState,
        likedPostId: [1],
        dislikePostId: [2],
      },
      error: initialErrorState,
    };

    renderWithProviders(<Home />, initialState);

    await waitFor(() => {
      const likeButtons = screen.getAllByTestId("like-button");
      const dislikeButtons = screen.getAllByTestId("dislike-button");

      expect(likeButtons[0]).toHaveTextContent("Unlike");

      expect(dislikeButtons[1]).toHaveTextContent("Remove Dislike");
    });
  });

  it("sets up intersection observer for infinite scroll", () => {
    const initialState = {
      posts: { ...initialPostsState, posts: mockPosts },
      user: initialUserState,
      error: initialErrorState,
    };

    renderWithProviders(<Home />, initialState);

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
});
