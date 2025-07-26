//cleared tests
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import EditProfileDialog from "../EditProfileDialog";

const mockStore = configureMockStore([thunk]);

describe("EditProfileDialog Component", () => {
  let store: ReturnType<typeof mockStore>;
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();

  const mockInitialData = {
    firstName: "John",
    lastName: "Doe",
    image: "https://example.com/image.jpg",
    phone: "123-456-7890",
    gender: "Male",
    company: {
      name: "Tech Corp",
      title: "Software Engineer",
    },
  };

  const emptyInitialData = {
    firstName: "",
    lastName: "",
    image: "",
    phone: "",
    gender: "",
    company: {
      name: "",
      title: "",
    },
  };

  beforeEach(() => {
    store = mockStore({
      user: {
        id: 1,
      },
    });

    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      onClose: onCloseMock,
      onSave: onSaveMock,
      initialData: mockInitialData,
    };

    return render(
      <Provider store={store}>
        <EditProfileDialog {...defaultProps} {...props} />
      </Provider>
    );
  };

  describe("Rendering", () => {
    it("renders dialog when open is true", () => {
      renderComponent();

      expect(screen.getByTestId("edit-profile-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-title")).toHaveTextContent("Edit Profile");
      expect(screen.getByTestId("firstName-input")).toBeInTheDocument();
      expect(screen.getByTestId("lastName-input")).toBeInTheDocument();
      expect(screen.getByTestId("image-input")).toBeInTheDocument();
      expect(screen.getByTestId("phone-input")).toBeInTheDocument();
      expect(screen.getByTestId("gender-input")).toBeInTheDocument();
      expect(screen.getByTestId("companyName-input")).toBeInTheDocument();
      expect(screen.getByTestId("companyTitle-input")).toBeInTheDocument();
    });

    it("does not render dialog when open is false", () => {
      renderComponent({ open: false });

      expect(screen.queryByTestId("edit-profile-dialog")).not.toBeInTheDocument();
    });

    it("displays initial data in form fields", () => {
      renderComponent();

      expect(screen.getByTestId("firstName-input")).toHaveValue("John");
      expect(screen.getByTestId("lastName-input")).toHaveValue("Doe");
      expect(screen.getByTestId("image-input")).toHaveValue("https://example.com/image.jpg");
      expect(screen.getByTestId("phone-input")).toHaveValue("123-456-7890");
      expect(screen.getByTestId("gender-input")).toHaveValue("Male");
      expect(screen.getByTestId("companyName-input")).toHaveValue("Tech Corp");
      expect(screen.getByTestId("companyTitle-input")).toHaveValue("Software Engineer");
    });
  });

  describe("Form Interactions", () => {
    it("updates firstName field correctly", async () => {
      renderComponent();
      
      const firstNameInput = screen.getByTestId("firstName-input");
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, "Jane");

      expect(firstNameInput).toHaveValue("Jane");
    });

    it("updates lastName field correctly", async () => {
      renderComponent();
      
      const lastNameInput = screen.getByTestId("lastName-input");
      await userEvent.clear(lastNameInput);
      await userEvent.type(lastNameInput, "Smith");

      expect(lastNameInput).toHaveValue("Smith");
    });

    it("updates image URL field correctly", async () => {
      renderComponent();
      
      const imageInput = screen.getByTestId("image-input");
      await userEvent.clear(imageInput);
      await userEvent.type(imageInput, "https://newimage.com/photo.jpg");

      expect(imageInput).toHaveValue("https://newimage.com/photo.jpg");
    });

    it("updates phone field correctly", async () => {
      renderComponent();
      
      const phoneInput = screen.getByTestId("phone-input");
      await userEvent.clear(phoneInput);
      await userEvent.type(phoneInput, "987-654-3210");

      expect(phoneInput).toHaveValue("987-654-3210");
    });

    it("updates gender field correctly", async () => {
      renderComponent();
      
      const genderInput = screen.getByTestId("gender-input");
      await userEvent.clear(genderInput);
      await userEvent.type(genderInput, "Female");

      expect(genderInput).toHaveValue("Female");
    });

    it("updates company name field correctly", async () => {
      renderComponent();
      
      const companyNameInput = screen.getByTestId("companyName-input");
      await userEvent.clear(companyNameInput);
      await userEvent.type(companyNameInput, "New Company Inc");

      expect(companyNameInput).toHaveValue("New Company Inc");
    });

    it("updates company title field correctly", async () => {
      renderComponent();
      
      const companyTitleInput = screen.getByTestId("companyTitle-input");
      await userEvent.clear(companyTitleInput);
      await userEvent.type(companyTitleInput, "Senior Developer");

      expect(companyTitleInput).toHaveValue("Senior Developer");
    });

    it("updates multiple fields correctly", async () => {
      renderComponent();
      
      const firstNameInput = screen.getByTestId("firstName-input");
      const lastNameInput = screen.getByTestId("lastName-input");
      const phoneInput = screen.getByTestId("phone-input");

      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, "Alice");
      
      await userEvent.clear(lastNameInput);
      await userEvent.type(lastNameInput, "Johnson");
      
      await userEvent.clear(phoneInput);
      await userEvent.type(phoneInput, "555-0123");

      expect(firstNameInput).toHaveValue("Alice");
      expect(lastNameInput).toHaveValue("Johnson");
      expect(phoneInput).toHaveValue("555-0123");
    });
  });

  describe("Form Validation", () => {
    it("enables save button when all fields are filled", () => {
      renderComponent();

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).not.toBeDisabled();
    });

    it("disables save button when firstName is empty", () => {
      renderComponent({ initialData: { ...mockInitialData, firstName: "" } });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("disables save button when lastName is empty", () => {
      renderComponent({ initialData: { ...mockInitialData, lastName: "" } });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("disables save button when image is empty", () => {
      renderComponent({ initialData: { ...mockInitialData, image: "" } });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("disables save button when phone is empty", () => {
      renderComponent({ initialData: { ...mockInitialData, phone: "" } });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("disables save button when gender is empty", () => {
      renderComponent({ initialData: { ...mockInitialData, gender: "" } });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("disables save button when company name is empty", () => {
      renderComponent({ 
        initialData: { 
          ...mockInitialData, 
          company: { ...mockInitialData.company, name: "" } 
        } 
      });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("disables save button when company title is empty", () => {
      renderComponent({ 
        initialData: { 
          ...mockInitialData, 
          company: { ...mockInitialData.company, title: "" } 
        } 
      });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("disables save button when all fields are empty", () => {
      renderComponent({ initialData: emptyInitialData });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("disables save button when fields contain only whitespace", () => {
      const whitespaceData = {
        firstName: "   ",
        lastName: "   ",
        image: "   ",
        phone: "   ",
        gender: "   ",
        company: {
          name: "   ",
          title: "   ",
        },
      };

      renderComponent({ initialData: whitespaceData });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });

    it("enables save button after filling empty field", async () => {
      renderComponent({ initialData: { ...mockInitialData, firstName: "" } });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();

      const firstNameInput = screen.getByTestId("firstName-input");
      await userEvent.type(firstNameInput, "NewName");

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });
  });

  describe("Form Submission", () => {
    it("dispatches Redux action and closes dialog on save", async () => {
      renderComponent();

      const saveButton = screen.getByTestId("save-button");
      await userEvent.click(saveButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions[0].type).toBe("SET_USER_PROFILE_DETAILS");
        expect(actions[0].payload).toEqual({
          firstName: "John",
          lastName: "Doe",
          image: "https://example.com/image.jpg",
          phone: "123-456-7890",
          gender: "Male",
          company: {
            name: "Tech Corp",
            title: "Software Engineer",
          },
        });
      });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("dispatches Redux action with updated data", async () => {
      renderComponent();

      // Update some fields
      const firstNameInput = screen.getByTestId("firstName-input");
      const companyNameInput = screen.getByTestId("companyName-input");

      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, "Updated");
      
      await userEvent.clear(companyNameInput);
      await userEvent.type(companyNameInput, "Updated Company");

      const saveButton = screen.getByTestId("save-button");
      await userEvent.click(saveButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions[0].payload).toEqual({
          firstName: "Updated",
          lastName: "Doe",
          image: "https://example.com/image.jpg",
          phone: "123-456-7890",
          gender: "Male",
          company: {
            name: "Updated Company",
            title: "Software Engineer",
          },
        });
      });
    });

    it("cannot submit when form is invalid", () => {
      renderComponent({ initialData: emptyInitialData });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();

      // Verify no actions were dispatched and dialog wasn't closed
      // (We don't need to actually click the disabled button)
      expect(store.getActions()).toHaveLength(0);
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  describe("Dialog Actions", () => {
    it("closes dialog when cancel button is clicked", async () => {
      renderComponent();

      const cancelButton = screen.getByTestId("cancel-button");
      await userEvent.click(cancelButton);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(store.getActions()).toHaveLength(0); // No Redux action should be dispatched
    });

    it("does not dispatch Redux action when dialog is cancelled", async () => {
      renderComponent();

      // Make some changes
      const firstNameInput = screen.getByTestId("firstName-input");
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, "Changed");

      // Cancel instead of save
      const cancelButton = screen.getByTestId("cancel-button");
      await userEvent.click(cancelButton);

      expect(store.getActions()).toHaveLength(0);
    });
  });

  describe("Company Fields Handling", () => {
    it("handles company name changes correctly", async () => {
      renderComponent();

      const companyNameInput = screen.getByTestId("companyName-input");
      await userEvent.clear(companyNameInput);
      await userEvent.type(companyNameInput, "New Tech Company");

      // Save to verify the company object is updated correctly
      const saveButton = screen.getByTestId("save-button");
      await userEvent.click(saveButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions[0].payload.company.name).toBe("New Tech Company");
        expect(actions[0].payload.company.title).toBe("Software Engineer"); // Should remain unchanged
      });
    });

    it("handles company title changes correctly", async () => {
      renderComponent();

      const companyTitleInput = screen.getByTestId("companyTitle-input");
      await userEvent.clear(companyTitleInput);
      await userEvent.type(companyTitleInput, "Lead Developer");

      // Save to verify the company object is updated correctly
      const saveButton = screen.getByTestId("save-button");
      await userEvent.click(saveButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions[0].payload.company.title).toBe("Lead Developer");
        expect(actions[0].payload.company.name).toBe("Tech Corp"); // Should remain unchanged
      });
    });

    it("handles both company fields changes correctly", async () => {
      renderComponent();

      const companyNameInput = screen.getByTestId("companyName-input");
      const companyTitleInput = screen.getByTestId("companyTitle-input");

      await userEvent.clear(companyNameInput);
      await userEvent.type(companyNameInput, "Startup Inc");
      
      await userEvent.clear(companyTitleInput);
      await userEvent.type(companyTitleInput, "CTO");

      // Save to verify both company fields are updated
      const saveButton = screen.getByTestId("save-button");
      await userEvent.click(saveButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions[0].payload.company).toEqual({
          name: "Startup Inc",
          title: "CTO",
        });
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined onSave prop gracefully", () => {
      // Component should work without onSave prop
      expect(() => {
        renderComponent({ onSave: undefined });
      }).not.toThrow();
    });

    it("maintains form state during multiple interactions", async () => {
      renderComponent();

      const firstNameInput = screen.getByTestId("firstName-input");
      const lastNameInput = screen.getByTestId("lastName-input");

      // Change first name
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, "Test");

      // Change last name
      await userEvent.clear(lastNameInput);
      await userEvent.type(lastNameInput, "User");

      // Change first name again
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, "Final");

      expect(firstNameInput).toHaveValue("Final");
      expect(lastNameInput).toHaveValue("User");
    });
  });
});