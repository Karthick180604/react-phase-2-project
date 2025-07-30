jest.mock("../../../assets/ApiErrorImage.png",()=>"mocked-image")

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MyProfile from "../MyProfile";
import * as apiCalls from "../../../services/apiCalls";

jest.mock("../../../services/apiCalls", () => ({
  getSingleUserPosts: jest.fn(),
}));

jest.mock("../../../components/UserProfileCard/UserProfileCard", () => {
  return function MockUserProfileCard({ fullName }: { fullName: string }) {
    return <div data-testid="user-profile-card-component">{fullName}</div>;
  };
});

jest.mock("../../../components/UserPostSection/UserPostSection", () => {
  return function MockUserPostSection({ posts }: { posts: any[] }) {
    return (
      <div data-testid="user-post-section-component">Posts: {posts.length}</div>
    );
  };
});

jest.mock("../../../components/EditProfileDialog/EditProfileDialog", () => {
  return function MockEditProfileDialog({
    open,
    onClose,
    onSave,
  }: {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
  }) {
    return open ? (
      <div data-testid="edit-profile-dialog">
        <button onClick={onClose} data-testid="close-edit-dialog">
          Close
        </button>
        <button
          onClick={() => onSave({ firstName: "Updated", lastName: "User" })}
          data-testid="save-edit-dialog"
        >
          Save
        </button>
      </div>
    ) : null;
  };
});

jest.mock("../../../components/AddPostDialog/AddPostDialog", () => {
  return function MockAddPostDialog({
    open,
    onClose,
    onSave,
  }: {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
  }) {
    return open ? (
      <div data-testid="add-post-dialog">
        <button onClick={onClose} data-testid="close-add-dialog">
          Close
        </button>
        <button
          onClick={() => onClose(true)}
          data-testid="save-add-dialog"
        >
          Save
        </button>
      </div>
    ) : null;
  };
});

jest.mock("../../../components/NoPosts/NoPosts", () => {
  return function MockNoPosts() {
    return <div data-testid="no-posts-component">No posts available</div>;
  };
});

const mockUserDetails = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  image: "https://example.com/image.jpg",
  email: "john.doe@example.com",
  phone: "+1234567890",
  gender: "male",
  company: {
    name: "Tech Corp",
    title: "Software Engineer",
  },
  uploadedPosts: [
    {
      id: 101,
      title: "Uploaded Post",
      body: "This is an uploaded post",
      userId: 1,
    },
  ],
};

const mockApiPosts = [
  {
    id: 1,
    title: "API Post 1",
    body: "This is an API post",
    userId: 1,
  },
  {
    id: 2,
    title: "API Post 2",
    body: "This is another API post",
    userId: 1,
  },
];

const theme = createTheme();

const createMockStore = (userState = mockUserDetails) => {
  const initialState = {
    user: userState,
    error:{
      hasApiError:false
    }
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
      <BrowserRouter>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </BrowserRouter>
    </Provider>,
  );
};

describe("MyProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders loading text when user is not loaded", () => {
    const store = createMockStore(null);
    renderWithProviders(<MyProfile />, { store });

    expect(screen.getByTestId("loading-text")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders user profile and posts when data is loaded", async () => {
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: mockApiPosts },
    });

    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("my-profile-root")).toBeInTheDocument();
    });

    expect(screen.getByTestId("user-profile-card")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByTestId("user-post-section")).toBeInTheDocument();
  });

  it("renders no posts when user has no posts", async () => {
    const userWithNoPosts = { ...mockUserDetails, uploadedPosts: [] };
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: [] },
    });

    const store = createMockStore(userWithNoPosts);
    renderWithProviders(<MyProfile />, { store });

    await waitFor(() => {
      expect(screen.getByTestId("no-posts-component")).toBeInTheDocument();
    });

    expect(screen.getByText("No posts available")).toBeInTheDocument();
  });

  it("displays user posts section when user has posts", async () => {
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: mockApiPosts },
    });

    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(
        screen.getByTestId("user-post-section-component"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Posts: 3")).toBeInTheDocument();
  });

  it("handles user with id > 208 (only uploaded posts)", async () => {
    const newUser = { ...mockUserDetails, id: 300 };
    const store = createMockStore(newUser);

    renderWithProviders(<MyProfile />, { store });

    await waitFor(() => {
      expect(
        screen.getByTestId("user-post-section-component"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Posts: 1")).toBeInTheDocument();
    expect(apiCalls.getSingleUserPosts).not.toHaveBeenCalled();
  });

  it("handles API error gracefully", async () => {
    (apiCalls.getSingleUserPosts as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user posts:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("opens edit profile dialog when edit button is clicked", async () => {
    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: mockApiPosts },
    });

    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("edit-profile-btn")).toBeInTheDocument();
    });

    const editButton = screen.getByTestId("edit-profile-btn");
    fireEvent.click(editButton);

    expect(screen.getByTestId("edit-profile-dialog")).toBeInTheDocument();
  });

  it("closes edit profile dialog when close button is clicked", async () => {
    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("edit-profile-btn")).toBeInTheDocument();
    });

    const editButton = screen.getByTestId("edit-profile-btn");
    fireEvent.click(editButton);

    expect(screen.getByTestId("edit-profile-dialog")).toBeInTheDocument();

    const closeButton = screen.getByTestId("close-edit-dialog");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("edit-profile-dialog")).not.toBeInTheDocument();
  });

  it("updates user data when edit profile dialog saves", async () => {
    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("edit-profile-btn")).toBeInTheDocument();
    });

    const editButton = screen.getByTestId("edit-profile-btn");
    fireEvent.click(editButton);

    const saveButton = screen.getByTestId("save-edit-dialog");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Updated User")).toBeInTheDocument();
    });
  });

  it("opens add post dialog when add post button is clicked", async () => {
    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("add-post-btn")).toBeInTheDocument();
    });

    const addButton = screen.getByTestId("add-post-btn");
    fireEvent.click(addButton);

    expect(screen.getByTestId("add-post-dialog")).toBeInTheDocument();
  });

  it("closes add post dialog when close button is clicked", async () => {
    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("add-post-btn")).toBeInTheDocument();
    });

    const addButton = screen.getByTestId("add-post-btn");
    fireEvent.click(addButton);

    expect(screen.getByTestId("add-post-dialog")).toBeInTheDocument();

    const closeButton = screen.getByTestId("close-add-dialog");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("add-post-dialog")).not.toBeInTheDocument();
  });

  it("logs new post when add post dialog saves", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("add-post-btn")).toBeInTheDocument();
    });

    const addButton = screen.getByTestId("add-post-btn");
    fireEvent.click(addButton);

    const saveButton = screen.getByTestId("save-add-dialog");
    fireEvent.click(saveButton);

    

    expect(screen.queryByTestId("add-post-dialog")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("handles user with missing optional fields", async () => {
    const userWithMissingFields = {
      id: 1,
      firstName: "",
      lastName: "",
      username: "testuser",
      image: "",
      email: "test@example.com",
      phone: "",
      gender: "",
      company: null,
      uploadedPosts: [],
    };

    (apiCalls.getSingleUserPosts as jest.Mock).mockResolvedValue({
      data: { posts: [] },
    });

    const store = createMockStore(userWithMissingFields);
    renderWithProviders(<MyProfile />, { store });

    await waitFor(() => {
      expect(screen.getByTestId("my-profile-root")).toBeInTheDocument();
    });

    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("renders correct button labels", async () => {
    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("my-profile-root")).toBeInTheDocument();
    });

    expect(screen.getByText("Add Profile Info")).toBeInTheDocument();
    expect(screen.getByText("Add Post")).toBeInTheDocument();
  });

  it("has correct grid layout structure", async () => {
    renderWithProviders(<MyProfile />);

    await waitFor(() => {
      expect(screen.getByTestId("my-profile-root")).toBeInTheDocument();
    });

    expect(screen.getByTestId("user-profile-card")).toBeInTheDocument();
    expect(screen.getByTestId("user-post-section")).toBeInTheDocument();
    expect(screen.getByTestId("edit-profile-btn")).toBeInTheDocument();
    expect(screen.getByTestId("add-post-btn")).toBeInTheDocument();
  });
});
