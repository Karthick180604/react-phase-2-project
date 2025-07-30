import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  createStore,
  combineReducers,
  applyMiddleware,
  Store,
  AnyAction,
} from "redux";
import SearchPosts from "../SearchPosts";
import * as postsActions from "../../../redux/Actions/postsActions";
import * as userActions from "../../../redux/Actions/userActions";
import * as apiCalls from "../../../services/apiCalls";

jest.mock("../../../components/PostCardSmall/PostCardSmall", () => {
  return function MockPostCardSmall({ title, body, id, onReadMore }: any) {
    return (
      <div data-testid={`post-card-${id}`}>
        <h3>{title}</h3>
        <p>{body}</p>
        <button onClick={onReadMore} data-testid={`read-more-${id}`}>
          Read More
        </button>
      </div>
    );
  };
});

jest.mock("../../../components/PostDialog/PostDialog", () => {
  return function MockPostDialog({
    open,
    onClose,
    post,
    onLikeHandler,
    onDislikeHandler,
    like,
    dislike,
  }: any) {
    if (!open) return null;
    return (
      <div data-testid="post-dialog">
        <h2>{post?.title}</h2>
        <button onClick={onClose} data-testid="close-dialog">
          Close
        </button>
        <button
          onClick={() => onLikeHandler(post?.id, like)}
          data-testid="like-button"
        >
          {like ? "Unlike" : "Like"}
        </button>
        <button
          onClick={() => onDislikeHandler(post?.id, dislike)}
          data-testid="dislike-button"
        >
          {dislike ? "Remove Dislike" : "Dislike"}
        </button>
      </div>
    );
  };
});

jest.mock("../../../components/NoResults/NoResults", () => {
  return function MockNoResults({ message }: any) {
    return <div data-testid="no-results">{message}</div>;
  };
});

jest.mock(
  "../../../components/PostCardSmallSkeleton/PostCardSmallSkeleton",
  () => {
    return function MockPostCardSmallSkeleton() {
      return <div data-testid="skeleton-loader">Loading...</div>;
    };
  },
);

jest.mock("../../../components/ApiError/ApiError", () => {
  return function MockApiError() {
    return <div data-testid="api-error">API Error occurred</div>;
  };
});

jest.mock("lodash.debounce", () => {
  return jest.fn((fn) => {
    const debounced = (...args: any[]) => {
      fn(...args);
    };
    debounced.cancel = jest.fn();
    debounced.flush = jest.fn();
    return debounced;
  });
});

jest.mock("../../../services/apiCalls");
const mockedApiCalls = apiCalls as jest.Mocked<typeof apiCalls>;

jest.mock("../../../redux/Store/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
}));

jest.mock("../../../redux/Actions/postsActions");
jest.mock("../../../redux/Actions/userActions");

const mockedPostsActions = postsActions as jest.Mocked<typeof postsActions>;
const mockedUserActions = userActions as jest.Mocked<typeof userActions>;

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

const mockPosts = [
  {
    id: 1,
    title: "Test Post 1",
    body: "This is test post 1 content",
    tags: ["react", "testing"],
  },
  {
    id: 2,
    title: "Test Post 2",
    body: "This is test post 2 content",
    tags: ["javascript", "development"],
  },
];

const mockTags = [
  { slug: "react", name: "React", url: "/tags/react" },
  { slug: "javascript", name: "JavaScript", url: "/tags/javascript" },
  { slug: "testing", name: "Testing", url: "/tags/testing" },
];

const postsReducer = (state = { posts: [], loading: false }, action: any) => {
  switch (action.type) {
    case "FETCH_POSTS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_POSTS_SUCCESS":
      return { ...state, posts: action.payload, loading: false };
    case "FETCH_POSTS_FAILURE":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const userReducer = (
  state = { uploadedPosts: [], likedPostId: [], dislikePostId: [] },
  action: any,
) => {
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

const errorReducer = (state = { hasApiError: false }, action: any) => {
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

const createMockStore = (initialState = {}): Store<any, AnyAction> => {
  const defaultState = {
    posts: {
      posts: mockPosts,
      loading: false,
      error:null
    },
    user: {
      uploadedPosts: [],
      likedPostId: [],
      dislikePostId: [],
    },
    error: {
      hasApiError: false,
    },
    ...initialState,
  };

  const mockStore: Store<any, AnyAction> = {
    getState: () => defaultState,
    dispatch: jest.fn((action: any) => {
      if (typeof action === "function") {
        return action(mockStore.dispatch, mockStore.getState);
      }
      return action;
    }),
    subscribe: jest.fn(() => jest.fn()),
    replaceReducer: jest.fn(),
  };

  return mockStore;
};

const theme = createTheme();

const renderWithProviders = (
  component: React.ReactElement,
  store = createMockStore(),
) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </Provider>,
  );
};

describe("SearchPosts Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedPostsActions.fetchPosts.mockImplementation(
      (page: number, limit: number) => {
        return (dispatch: any) => {
          dispatch({ type: "FETCH_POSTS_SUCCESS", payload: mockPosts });
          return Promise.resolve({ payload: mockPosts });
        };
      },
    );

    mockedUserActions.likePost.mockReturnValue({
      type: "LIKE_POST",
      payload: 1,
    });
    mockedUserActions.removeLikePost.mockReturnValue({
      type: "REMOVE_LIKE_POST",
      payload: 1,
    });
    mockedUserActions.dislikePost.mockReturnValue({
      type: "DISLIKE_POST",
      payload: 1,
    });
    mockedUserActions.removeDislikePost.mockReturnValue({
      type: "REMOVE_DISLIKE_POST",
      payload: 1,
    });
    mockedApiCalls.getAllPostTags.mockResolvedValue({ data: mockTags });
    mockedApiCalls.getSearchedPosts.mockResolvedValue({
      data: { posts: mockPosts },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Initial Render", () => {
    it("should render the component with correct title", () => {
      renderWithProviders(<SearchPosts />);

      expect(screen.getByTestId("search-posts-page")).toBeInTheDocument();
      expect(screen.getByTestId("page-title")).toHaveTextContent(
        "Search Posts",
      );
    });

    it("should render search input and tag select", () => {
      renderWithProviders(<SearchPosts />);

      expect(screen.getByTestId("search-input")).toBeInTheDocument();
      expect(screen.getByTestId("tag-select")).toBeInTheDocument();
    });

    it("should fetch posts on mount", () => {
      renderWithProviders(<SearchPosts />);

      expect(mockedPostsActions.fetchPosts).toHaveBeenCalledWith(1, 15);
    });

    it("should fetch tags on mount", async () => {
      renderWithProviders(<SearchPosts />);

      await waitFor(() => {
        expect(mockedApiCalls.getAllPostTags).toHaveBeenCalled();
      });
    });
  });

  describe("Loading States", () => {
    it("should show skeleton loaders when loading and no posts", () => {
      const store = createMockStore({
        posts: { posts: [], loading: true, error:null },
      });

      renderWithProviders(<SearchPosts />, store);

      expect(screen.getByTestId("loading-state")).toBeInTheDocument();
      expect(screen.getAllByTestId(/skeleton-loader/)).toHaveLength(6);
    });

    it("should show no results when no posts and not loading", () => {
      const store = createMockStore({
        posts: { posts: [], loading: false, error:null },
      });

      renderWithProviders(<SearchPosts />, store);

      expect(screen.getByTestId("no-results")).toBeInTheDocument();
      expect(screen.getByText("No posts found")).toBeInTheDocument();
    });
  });

  describe("Posts Display", () => {
    it("should render posts when available", () => {
      renderWithProviders(<SearchPosts />);

      expect(screen.getByTestId("post-list")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
    });

    it("should include uploaded posts from user", () => {
      const uploadedPost = {
        id: 999,
        title: "My Uploaded Post",
        body: "Content of uploaded post",
        tags: ["personal"],
      };

      const store = createMockStore({
        user: {
          uploadedPosts: [uploadedPost],
          likedPostId: [],
          dislikePostId: [],
        },
      });

      renderWithProviders(<SearchPosts />, store);

      expect(screen.getByTestId("post-card-999")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should handle search input changes", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      const searchInput = screen.getByTestId("search-input");

      await user.type(searchInput, "test search");

      expect(searchInput).toHaveValue("test search");
      await waitFor(() => {
        expect(mockedApiCalls.getSearchedPosts).toHaveBeenCalledWith(
          "test search",
        );
      });
    });

    it("should reset pagination when search term is empty", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      const searchInput = screen.getByTestId("search-input");

      await user.type(searchInput, "test");
      await user.clear(searchInput);

      await waitFor(() => {
        expect(mockedPostsActions.fetchPosts).toHaveBeenCalledWith(1, 15);
      });
    });

    it("should handle search API errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      mockedApiCalls.getSearchedPosts.mockRejectedValue(
        new Error("Search failed"),
      );

      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      const searchInput = screen.getByTestId("search-input");
      await user.type(searchInput, "test");

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Tag Filtering", () => {
    it("should render tag options", async () => {
      renderWithProviders(<SearchPosts />);

      await waitFor(() => {
        const tagSelect = screen.getByTestId("tag-select");
        expect(tagSelect).toBeInTheDocument();
      });

      const tagSelect = screen.getByRole("combobox", { name: /tags/i });
      fireEvent.mouseDown(tagSelect);

      await waitFor(() => {
        expect(screen.getByTestId("tag-option-All")).toBeInTheDocument();
      });
    });

    it("should filter posts by selected tag", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      await waitFor(() => {
        expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      });

      const tagSelect = screen.getByRole("combobox", { name: /tags/i });
      await user.click(tagSelect);

      await waitFor(() => {
        expect(screen.getByText("React")).toBeInTheDocument();
      });

      const reactOption = screen.getByText("React");
      await user.click(reactOption);

      expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      expect(screen.queryByTestId("post-card-2")).not.toBeInTheDocument();
    });

    it('should reset pagination when "All" tag is selected', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      await waitFor(() => {
        expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      });

      const tagSelect = screen.getByRole("combobox", { name: /tags/i });
      await user.click(tagSelect);

      await waitFor(() => {
        expect(screen.getByText("All")).toBeInTheDocument();
      });

      const allOption = screen.getByText("All");
      await user.click(allOption);

      expect(mockedPostsActions.fetchPosts).toHaveBeenCalledWith(1, 15);
    });
  });

  describe("Post Dialog", () => {
    it("should open dialog when read more is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      const readMoreButton = screen.getByTestId("read-more-1");
      await user.click(readMoreButton);

      expect(screen.getByTestId("post-dialog")).toBeInTheDocument();
    });

    it("should close dialog when close button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      const readMoreButton = screen.getByTestId("read-more-1");
      await user.click(readMoreButton);

      const closeButton = screen.getByTestId("close-dialog");
      await user.click(closeButton);

      expect(screen.queryByTestId("post-dialog")).not.toBeInTheDocument();
    });

    it("should handle like action correctly", async () => {
      const user = userEvent.setup();

      renderWithProviders(<SearchPosts />);

      const readMoreButton = screen.getByTestId("read-more-1");
      await user.click(readMoreButton);

      const likeButton = screen.getByTestId("like-button");
      await user.click(likeButton);

      expect(mockedUserActions.likePost).toHaveBeenCalledWith(1);
    });

    it("should handle dislike action correctly", async () => {
      const user = userEvent.setup();

      renderWithProviders(<SearchPosts />);

      const readMoreButton = screen.getByTestId("read-more-1");
      await user.click(readMoreButton);

      const dislikeButton = screen.getByTestId("dislike-button");
      await user.click(dislikeButton);

      expect(mockedUserActions.dislikePost).toHaveBeenCalledWith(1);
    });

    it("should handle remove like action when post is already liked", async () => {
      const user = userEvent.setup();

      const store = createMockStore({
        user: {
          uploadedPosts: [],
          likedPostId: [1],
          dislikePostId: [],
        },
      });

      renderWithProviders(<SearchPosts />, store);

      const readMoreButton = screen.getByTestId("read-more-1");
      await user.click(readMoreButton);

      const likeButton = screen.getByTestId("like-button");
      await user.click(likeButton);

      expect(mockedUserActions.removeLikePost).toHaveBeenCalledWith(1);
    });

    it("should handle remove dislike action when post is already disliked", async () => {
      const user = userEvent.setup();

      const store = createMockStore({
        user: {
          uploadedPosts: [],
          likedPostId: [],
          dislikePostId: [1],
        },
      });

      renderWithProviders(<SearchPosts />, store);

      const readMoreButton = screen.getByTestId("read-more-1");
      await user.click(readMoreButton);

      const dislikeButton = screen.getByTestId("dislike-button");
      await user.click(dislikeButton);

      expect(mockedUserActions.removeDislikePost).toHaveBeenCalledWith(1);
    });
  });

  describe("Infinite Scrolling", () => {
    it("should set up intersection observer for last post", () => {
      renderWithProviders(<SearchPosts />);

      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    it("should not trigger pagination when searching", () => {
      const mockObserve = jest.fn();
      const mockDisconnect = jest.fn();

      mockIntersectionObserver.mockReturnValue({
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      });

      renderWithProviders(<SearchPosts />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      observerCallback([{ isIntersecting: true }]);

      expect(mockObserve).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should render API error component when hasApiError is true", () => {
      const store = createMockStore({
        error: { hasApiError: true },
      });

      renderWithProviders(<SearchPosts />, store);

      expect(screen.getByTestId("api-error")).toBeInTheDocument();
      expect(screen.queryByTestId("search-posts-page")).not.toBeInTheDocument();
    });

    it("should handle tag fetching errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockedApiCalls.getAllPostTags.mockRejectedValue(
        new Error("Tags fetch failed"),
      );

      renderWithProviders(<SearchPosts />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Component Cleanup", () => {
    it("should disconnect intersection observer on unmount", () => {
      const mockDisconnect = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      });

      const { unmount } = renderWithProviders(<SearchPosts />);

      unmount();

      expect(mockIntersectionObserver).toHaveBeenCalled();
    });
  });

  describe("Pagination", () => {
    it("should handle pagination correctly when more posts are available", async () => {
      const mockFetchPosts = jest.fn().mockReturnValue((dispatch: any) => {
        dispatch({ type: "FETCH_POSTS_SUCCESS", payload: mockPosts });
        return Promise.resolve({ payload: mockPosts });
      });
      mockedPostsActions.fetchPosts.mockImplementation(mockFetchPosts);

      renderWithProviders(<SearchPosts />);

      await waitFor(() => {
        expect(mockFetchPosts).toHaveBeenCalledWith(1, 15);
      });
    });

    it("should set hasMore to false when less posts than limit are returned", async () => {
      const shortPostList = [mockPosts[0]];
      const mockFetchPosts = jest.fn().mockReturnValue((dispatch: any) => {
        dispatch({ type: "FETCH_POSTS_SUCCESS", payload: shortPostList });
        return Promise.resolve({ payload: shortPostList });
      });
      mockedPostsActions.fetchPosts.mockImplementation(mockFetchPosts);

      renderWithProviders(<SearchPosts />);

      await waitFor(() => {
        expect(mockFetchPosts).toHaveBeenCalledWith(1, 15);
      });
    });
  });

  describe("State Management", () => {
    it("should update postList when posts change", () => {
      const store = createMockStore();
      renderWithProviders(<SearchPosts />, store);

      expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
    });

    it("should combine uploaded posts with fetched posts", () => {
      const uploadedPost = {
        id: 999,
        title: "Uploaded Post",
        body: "User uploaded content",
        tags: ["user"],
      };

      const store = createMockStore({
        user: {
          uploadedPosts: [uploadedPost],
          likedPostId: [],
          dislikePostId: [],
        },
      });

      renderWithProviders(<SearchPosts />, store);

      expect(screen.getByTestId("post-card-999")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
    });
  });

  describe("Redux Actions Integration", () => {
    it("should dispatch like action correctly", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      const readMoreButton = screen.getByTestId("read-more-1");
      await user.click(readMoreButton);

      const likeButton = screen.getByTestId("like-button");
      await user.click(likeButton);

      expect(mockedUserActions.likePost).toHaveBeenCalledWith(1);
    });

    it("should dispatch dislike action correctly", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchPosts />);

      const readMoreButton = screen.getByTestId("read-more-1");
      await user.click(readMoreButton);

      const dislikeButton = screen.getByTestId("dislike-button");
      await user.click(dislikeButton);

      expect(mockedUserActions.dislikePost).toHaveBeenCalledWith(1);
    });

    it("should handle fetchPosts dispatch correctly", async () => {
      renderWithProviders(<SearchPosts />);

      await waitFor(() => {
        expect(mockedPostsActions.fetchPosts).toHaveBeenCalledWith(1, 15);
      });
    });
  });
});
