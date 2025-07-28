import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import UserProfile from "../UserProfile";
import * as apiCalls from "../../../services/apiCalls";

jest.mock("../../../services/apiCalls", () => ({
  getSingleUser: jest.fn(),
  getSingleUserPosts: jest.fn(),
}));

jest.mock("../../../components/UserPostSection/UserPostSection", () => {
  return function MockUserPostSection({ posts }: { posts: any[] }) {
    return <div data-testid="user-post-section">Posts: {posts.length}</div>;
  };
});

jest.mock("../../../components/UserProfileCard/UserProfileCard", () => {
  return function MockUserProfileCard({ fullName }: { fullName: string }) {
    return <div data-testid="user-profile-card">{fullName}</div>;
  };
});

jest.mock("../../../components/NoPosts/NoPosts", () => {
  return function MockNoPosts() {
    return <div data-testid="no-posts-message">No posts available</div>;
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => mockNavigate,
}));

const mockUser = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  image: "https://example.com/image.jpg",
  email: "john.doe@example.com",
  phone: "+1234567890",
  gender: "male",
  company: {
    name: "Tech Corp",
    title: "Software Engineer",
  },
};

const mockPosts = [
  {
    id: 1,
    title: "Test Post 1",
    body: "This is a test post",
    userId: 1,
  },
  {
    id: 2,
    title: "Test Post 2",
    body: "This is another test post",
    userId: 1,
  },
];

const createMockStore = (userState = {}) => {
  const initialState = {
    user: {
      id: null,
      uploadedPosts: [],
      ...userState,
    },
  };

  const rootReducer = (state = initialState, action: any) => {
    return state;
  };

  return createStore(rootReducer);
};

const renderWithProviders = (
  ui: React.ReactElement,
  { store = createMockStore() } = {},
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
  );
};

describe("UserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders loading spinner while fetching user data", () => {
    (apiCalls.getSingleUser as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );
    (apiCalls.getSingleUserPosts as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithProviders(<UserProfile />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders user profile and posts when data is loaded", async () => {
    (apiCalls.getSingleUser as jest.Mock).mockResolvedValue({
      data: mockUser,
    });
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: mockPosts },
    });

    renderWithProviders(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("user-profile-page")).toBeInTheDocument();
    });

    expect(screen.getByTestId("user-profile-card")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByTestId("user-post-section")).toBeInTheDocument();
    expect(screen.getByText("Posts: 2")).toBeInTheDocument();
  });

  it("renders no posts message when user has no posts", async () => {
    (apiCalls.getSingleUser as jest.Mock).mockResolvedValue({
      data: mockUser,
    });
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: [] },
    });

    renderWithProviders(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("user-profile-page")).toBeInTheDocument();
    });

    expect(screen.getByTestId("no-posts-message")).toBeInTheDocument();
    expect(screen.getByText("No posts available")).toBeInTheDocument();
  });

  it("merges uploaded posts for current user", async () => {
    const uploadedPosts = [
      {
        id: 3,
        title: "Uploaded Post",
        body: "This is an uploaded post",
        userId: 1,
      },
    ];

    const store = createMockStore({
      id: 1,
      uploadedPosts,
    });

    (apiCalls.getSingleUser as jest.Mock).mockResolvedValue({
      data: mockUser,
    });
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: mockPosts },
    });

    renderWithProviders(<UserProfile />, { store });

    await waitFor(() => {
      expect(screen.getByTestId("user-profile-page")).toBeInTheDocument();
    });

    expect(screen.getByText("Posts: 3")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    (apiCalls.getSingleUser as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );
    (apiCalls.getSingleUserPosts as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<UserProfile />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders back button and navigates when clicked", async () => {
    (apiCalls.getSingleUser as jest.Mock).mockResolvedValue({
      data: mockUser,
    });
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: mockPosts },
    });

    renderWithProviders(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("user-profile-page")).toBeInTheDocument();
    });

    const backButton = screen.getByTestId("back-button");
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute("aria-label", "go-back");

    backButton.click();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("renders correct grid layout structure", async () => {
    (apiCalls.getSingleUser as jest.Mock).mockResolvedValue({
      data: mockUser,
    });
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: mockPosts },
    });

    renderWithProviders(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("user-profile-page")).toBeInTheDocument();
    });

    expect(screen.getByTestId("back-button-box")).toBeInTheDocument();
    expect(screen.getByTestId("user-profile-card-section")).toBeInTheDocument();
    expect(screen.getByTestId("user-posts-section")).toBeInTheDocument();
  });

  it("calls API with correct user ID", async () => {
    (apiCalls.getSingleUser as jest.Mock).mockResolvedValue({
      data: mockUser,
    });
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: mockPosts },
    });

    renderWithProviders(<UserProfile />);

    await waitFor(() => {
      expect(apiCalls.getSingleUser).toHaveBeenCalledWith(1);
      expect(apiCalls.getSingleUserPosts).toHaveBeenCalledWith(1);
    });
  });
});
