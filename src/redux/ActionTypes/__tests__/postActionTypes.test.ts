import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
} from "../postsActionTypes";

describe("Post Action Types", () => {
  it("should define FETCH_POSTS_REQUEST correctly", () => {
    expect(FETCH_POSTS_REQUEST).toBe("FETCH_PRODUCTS_REQUEST");
  });

  it("should define FETCH_POSTS_SUCCESS correctly", () => {
    expect(FETCH_POSTS_SUCCESS).toBe("FETCH_PRODUCTS_SUCCESS");
  });

  it("should define FETCH_POSTS_FAILURE correctly", () => {
    expect(FETCH_POSTS_FAILURE).toBe("FETCH_PRODUCTS_FAILURE");
  });
});
