import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import AddPostDialog from "../AddPostDialog";
import { getAllPostTagsArray } from "../../../services/apiCalls";

jest.mock("../../../services/apiCalls", () => ({
  getAllPostTagsArray: jest.fn(),
}));

const mockStore = configureMockStore([thunk]);

describe("AddPostDialog Component", () => {
  let store: ReturnType<typeof mockStore>;
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();

  const defaultStoreState = {
    user: {
      id: 1,
      uploadedPosts: [],
    },
  };

  beforeEach(() => {
    store = mockStore(defaultStoreState);

    (getAllPostTagsArray as jest.Mock).mockResolvedValue({
      data: ["tech", "news", "sports", "gaming"],
    });

    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      onClose: onCloseMock,
      onSave: onSaveMock,
    };

    return render(
      <Provider store={store}>
        <AddPostDialog {...defaultProps} {...props} />
      </Provider>,
    );
  };

  describe("Rendering", () => {
    it("renders dialog when open is true", async () => {
      renderComponent();

      expect(screen.getByTestId("add-post-dialog")).toBeInTheDocument();
      expect(screen.getByText("Add New Post")).toBeInTheDocument();
      expect(screen.getByTestId("add-post-title")).toBeInTheDocument();
      expect(screen.getByTestId("add-post-body")).toBeInTheDocument();
      expect(screen.getByTestId("add-post-tags")).toBeInTheDocument();
    });

    it("does not render dialog when open is false", () => {
      renderComponent({ open: false });

      expect(screen.queryByTestId("add-post-dialog")).not.toBeInTheDocument();
    });

    it("fetches and displays available tags when dialog opens", async () => {
      renderComponent();

      await waitFor(() => {
        expect(getAllPostTagsArray).toHaveBeenCalledTimes(1);
      });

      const tagInput = screen.getByRole("combobox");
      await userEvent.click(tagInput);

      await waitFor(() => {
        expect(screen.getByText("tech")).toBeInTheDocument();
        expect(screen.getByText("news")).toBeInTheDocument();
      });
    });
  });

  describe("Form Interactions", () => {
    it("updates title input correctly", async () => {
      renderComponent();

      const titleInput = screen
        .getByTestId("add-post-title")
        .querySelector("input") as HTMLInputElement;
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, "Test Title");

      expect(titleInput.value).toBe("Test Title");
    });

    it("updates body input correctly", async () => {
      renderComponent();

      const bodyInput = screen
        .getByTestId("add-post-body")
        .querySelector("textarea") as HTMLTextAreaElement;
      await userEvent.clear(bodyInput);
      await userEvent.type(bodyInput, "Test body content");

      expect(bodyInput.value).toBe("Test body content");
    });

    it("allows selecting multiple tags", async () => {
      renderComponent();

      await waitFor(() => {
        expect(getAllPostTagsArray).toHaveBeenCalled();
      });

      const tagInput = screen.getByRole("combobox");

      await userEvent.click(tagInput);
      await userEvent.type(tagInput, "tech");
      await waitFor(() => expect(screen.getByText("tech")).toBeInTheDocument());
      await userEvent.click(screen.getByText("tech"));

      await userEvent.click(tagInput);
      await userEvent.type(tagInput, "news");
      await waitFor(() => expect(screen.getByText("news")).toBeInTheDocument());
      await userEvent.click(screen.getByText("news"));

      expect(screen.getAllByRole("button", { name: /tech/i })).toHaveLength(1);
      expect(screen.getAllByRole("button", { name: /news/i })).toHaveLength(1);
    });
  });

  describe("Form Submission", () => {
    it("submits form with correct data when all fields are filled", async () => {
      renderComponent();

      await waitFor(() => {
        expect(getAllPostTagsArray).toHaveBeenCalled();
      });

      const titleInput = screen
        .getByTestId("add-post-title")
        .querySelector("input") as HTMLInputElement;
      const bodyInput = screen
        .getByTestId("add-post-body")
        .querySelector("textarea") as HTMLTextAreaElement;

      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, "My Awesome Post");

      await userEvent.clear(bodyInput);
      await userEvent.type(bodyInput, "This is the post content");

      const tagInput = screen.getByRole("combobox");
      await userEvent.click(tagInput);
      await userEvent.type(tagInput, "tech");
      await waitFor(() => expect(screen.getByText("tech")).toBeInTheDocument());
      await userEvent.click(screen.getByText("tech"));

      const submitBtn = screen.getByTestId("add-post-submit");
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(onSaveMock).toHaveBeenCalledWith({
          title: "My Awesome Post",
          body: "This is the post content",
          tags: ["tech"],
        });
      });

      const actions = store.getActions();
      expect(actions[0].type).toBe("ADD_UPLOADED_POST");
      expect(actions[0].payload).toMatchObject({
        title: "My Awesome Post",
        body: "This is the post content",
        tags: ["tech"],
        userId: 1,
      });
    });

    it("does not submit when title is empty", async () => {
      renderComponent();

      const bodyInput = screen
        .getByTestId("add-post-body")
        .querySelector("textarea") as HTMLTextAreaElement;
      await userEvent.type(bodyInput, "Body content");

      const submitBtn = screen.getByTestId("add-post-submit");
      await userEvent.click(submitBtn);

      expect(onSaveMock).not.toHaveBeenCalled();
    });

    it("does not submit when body is empty", async () => {
      renderComponent();

      const titleInput = screen
        .getByTestId("add-post-title")
        .querySelector("input") as HTMLInputElement;
      await userEvent.type(titleInput, "Title");

      const submitBtn = screen.getByTestId("add-post-submit");
      await userEvent.click(submitBtn);

      expect(onSaveMock).not.toHaveBeenCalled();
    });

    it("does not submit when both title and body are whitespace only", async () => {
      renderComponent();

      const titleInput = screen
        .getByTestId("add-post-title")
        .querySelector("input") as HTMLInputElement;
      const bodyInput = screen
        .getByTestId("add-post-body")
        .querySelector("textarea") as HTMLTextAreaElement;

      await userEvent.type(titleInput, "   ");
      await userEvent.type(bodyInput, "   ");

      const submitBtn = screen.getByTestId("add-post-submit");
      await userEvent.click(submitBtn);

      expect(onSaveMock).not.toHaveBeenCalled();
    });
  });

  describe("Dialog Actions", () => {
    it("closes dialog and resets form when cancel button is clicked", async () => {
      renderComponent();

      const titleInput = screen
        .getByTestId("add-post-title")
        .querySelector("input") as HTMLInputElement;
      await userEvent.type(titleInput, "Test Title");

      const cancelBtn = screen.getByTestId("add-post-cancel");
      await userEvent.click(cancelBtn);

      expect(onCloseMock).toHaveBeenCalled();
    });

    it("closes dialog and resets form after successful submission", async () => {
      renderComponent();

      await waitFor(() => {
        expect(getAllPostTagsArray).toHaveBeenCalled();
      });

      const titleInput = screen
        .getByTestId("add-post-title")
        .querySelector("input") as HTMLInputElement;
      const bodyInput = screen
        .getByTestId("add-post-body")
        .querySelector("textarea") as HTMLTextAreaElement;

      await userEvent.type(titleInput, "Test Title");
      await userEvent.type(bodyInput, "Test Body");

      const submitBtn = screen.getByTestId("add-post-submit");
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalled();
      });
    });
  });

  describe("Error Handling", () => {
    it("handles API error when fetching tags", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (getAllPostTagsArray as jest.Mock).mockRejectedValue(
        new Error("API Error"),
      );

      renderComponent();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to fetch tags",
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });

    it("still allows form submission even if tags fail to load", async () => {
      (getAllPostTagsArray as jest.Mock).mockRejectedValue(
        new Error("API Error"),
      );

      renderComponent();

      const titleInput = screen
        .getByTestId("add-post-title")
        .querySelector("input") as HTMLInputElement;
      const bodyInput = screen
        .getByTestId("add-post-body")
        .querySelector("textarea") as HTMLTextAreaElement;

      await userEvent.type(titleInput, "Test Title");
      await userEvent.type(bodyInput, "Test Body");

      const submitBtn = screen.getByTestId("add-post-submit");
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(onSaveMock).toHaveBeenCalledWith({
          title: "Test Title",
          body: "Test Body",
          tags: [],
        });
      });
    });
  });

  describe("Redux Integration", () => {
    it("generates correct post ID based on existing posts", async () => {
      const storeWithPosts = mockStore({
        user: {
          id: 1,
          uploadedPosts: [{ id: 1 }, { id: 2 }],
        },
      });

      render(
        <Provider store={storeWithPosts}>
          <AddPostDialog
            open={true}
            onClose={onCloseMock}
            onSave={onSaveMock}
          />
        </Provider>,
      );

      const titleInput = screen
        .getByTestId("add-post-title")
        .querySelector("input") as HTMLInputElement;
      const bodyInput = screen
        .getByTestId("add-post-body")
        .querySelector("textarea") as HTMLTextAreaElement;

      await userEvent.type(titleInput, "Test Title");
      await userEvent.type(bodyInput, "Test Body");

      const submitBtn = screen.getByTestId("add-post-submit");
      await userEvent.click(submitBtn);

      await waitFor(() => {
        const actions = storeWithPosts.getActions();
        expect(actions[0].payload.id).toBe(254);
      });
    });
  });
});
