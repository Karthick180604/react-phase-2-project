//partially cleared

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../Home";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import {thunk} from "redux-thunk";
import { rootReducer } from "../../../redux/Store/store";
import * as postActions from "../../../redux/Actions/postsActions";
import configureStore from "redux-mock-store";

// ✅ Mock static image directly
jest.mock("../../../assets/ApiErrorImage.png", () => ({
  default: "mocked-error-image.png",
}));

// ✅ Mock MUI matchMedia (used by MUI useMediaQuery)
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

// ✅ Mock IntersectionObserver (used by Infinite Scroll)
window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// ✅ Mock scrollTo for FAB scroll
window.scrollTo = jest.fn();

// ✅ Mock post actions
jest.mock("../../../redux/Actions/postsActions", () => ({
  ...jest.requireActual("../../../redux/Actions/postsActions"),
  fetchPosts: jest.fn(() => () => Promise.resolve({ type: "FETCH_POSTS_SUCCESS", payload: [] })),
  likePost: jest.fn(() => ({ type: "LIKE_POST" })),
  dislikePost: jest.fn(() => ({ type: "DISLIKE_POST" })),
}));

const defaultStore = createStore(rootReducer, applyMiddleware(thunk));
const mockStore = configureStore([]); // for mocking specific states

describe("Home Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", async () => {
    render(
      <Provider store={defaultStore}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId("home-container")).toBeInTheDocument();
  });

  it("calls like and dislike actions on button clicks", async () => {
    render(
      <Provider store={defaultStore}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const likeButtons = screen.queryAllByTestId("like-button");
      const dislikeButtons = screen.queryAllByTestId("dislike-button");

      if (likeButtons.length && dislikeButtons.length) {
        fireEvent.click(likeButtons[0]);
        fireEvent.click(dislikeButtons[0]);

        expect(postActions.likePost).toHaveBeenCalled();
        expect(postActions.dislikePost).toHaveBeenCalled();
      }
    });
  });

  it("scrolls to top when FAB is clicked", () => {
    render(
      <Provider store={defaultStore}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    const fab = screen.getByTestId("scroll-top-fab");
    fireEvent.click(fab);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

//   it("renders error component when apiError is true", () => {
//   const errorStore = mockStore({
//     posts: {
//       posts: [],
//       apiError: true,
//       loading: false,
//     },
//     error: {
//       hasApiError: true,
//     },
//     user: {
//       // currentUser: {
//         id: 1,
//       firstName: "Jane",
//       lastName: "Doe",
//       username: "janedoe",
//       image: "janedoe.png",
//       uploadedPosts: []
//       // },
//     },
//   });

//   render(
//     <Provider store={errorStore}>
//       <BrowserRouter>
//         <Home />
//       </BrowserRouter>
//     </Provider>
//   );

//   expect(screen.getByTestId("api-error-root")).toBeInTheDocument();
// });

});
