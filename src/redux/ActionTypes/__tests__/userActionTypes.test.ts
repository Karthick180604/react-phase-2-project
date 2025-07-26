// cleared tests
import {
  SET_USER,
  LOGOUT_USER,
  LIKE_POST,
  COMMENT_POST,
  REMOVE_LIKE_POST,
  DISLIKE_POST,
  REMOVE_DISLIKE_POST,
  SET_USER_PROFILE_DETAILS,
  ADD_UPLOADED_POST,
} from "../userActionTypes"; // Adjust path as needed

describe("User Action Types", () => {
  it("should define SET_USER correctly", () => {
    expect(SET_USER).toBe("SET_USER");
  });

  it("should define LOGOUT_USER correctly", () => {
    expect(LOGOUT_USER).toBe("LOGOUT_USER");
  });

  it("should define LIKE_POST correctly", () => {
    expect(LIKE_POST).toBe("LIKE_POST");
  });

  it("should define COMMENT_POST correctly", () => {
    expect(COMMENT_POST).toBe("COMMENT_POST");
  });

  it("should define REMOVE_LIKE_POST correctly", () => {
    expect(REMOVE_LIKE_POST).toBe("REMOVE_LIKE_POST");
  });

  it("should define DISLIKE_POST correctly", () => {
    expect(DISLIKE_POST).toBe("DISLIKE_POST");
  });

  it("should define REMOVE_DISLIKE_POST correctly", () => {
    expect(REMOVE_DISLIKE_POST).toBe("REMOVE_DISLIKE_POST");
  });

  it("should define SET_USER_PROFILE_DETAILS correctly", () => {
    expect(SET_USER_PROFILE_DETAILS).toBe("SET_USER_PROFILE_DETAILS");
  });

  it("should define ADD_UPLOADED_POST correctly", () => {
    expect(ADD_UPLOADED_POST).toBe("ADD_UPLOADED_POST");
  });
});
