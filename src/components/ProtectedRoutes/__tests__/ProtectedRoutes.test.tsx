import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ProtectedRoutes from "../ProtectedRoutes";

const mockStore = configureStore([]);

describe("ProtectedRoutes", () => {
  test("renders children when authenticated", () => {
    const store = mockStore({
      user: {
        email: "test@example.com",
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoutes>
            <div>Protected Content</div>
          </ProtectedRoutes>
        </MemoryRouter>
      </Provider>,
    );

    expect(getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirects to / when not authenticated", () => {
    const store = mockStore({
      user: {
        email: "",
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/home"]}>
          <ProtectedRoutes>
            <div>Protected Content</div>
          </ProtectedRoutes>
        </MemoryRouter>
      </Provider>,
    );

    expect(container.innerHTML).not.toContain("Protected Content");
  });
});
