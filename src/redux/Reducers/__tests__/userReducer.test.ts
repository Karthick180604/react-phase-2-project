//cleared tests
import { userReducer } from "../userReducer";
import {
  SET_USER,
  LOGOUT_USER,
  LIKE_POST,
  REMOVE_LIKE_POST,
  DISLIKE_POST,
  REMOVE_DISLIKE_POST,
  COMMENT_POST,
  SET_USER_PROFILE_DETAILS,
  ADD_UPLOADED_POST,
} from "../../ActionTypes/userActionTypes";
import type { UserStateType, UploadPostType, CommentData, CompanyType } from "../../Reducers/userReducer";

describe("userReducer", () => {
  const initialState: UserStateType = {
    id: -1,
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: "",
    gender: "",
    phone: "",
    company: { name: "", title: "" },
    likedPostId: [],
    dislikePostId: [],
    commentedPosts: [],
    uploadedPosts: [],
  };

  it("should return initial state", () => {
    const result = userReducer(undefined, { type: "UNKNOWN" } as any);
    expect(result).toEqual(initialState);
  });

  it("should handle SET_USER", () => {
    const action = {
      type: SET_USER,
      payload: {
        userId: 1,
        userName: "john",
        userEmail: "john@example.com",
        userPassword: "password",
      },
    };
    const result = userReducer(initialState, action);
    expect(result).toMatchObject({
      id: 1,
      username: "john",
      email: "john@example.com",
      password: "password",
    });
  });

  it("should handle LOGOUT_USER", () => {
    const modifiedState = { ...initialState, username: "john" };
    const result = userReducer(modifiedState, { type: LOGOUT_USER });
    expect(result).toEqual(initialState);
  });

  it("should handle LIKE_POST", () => {
    const action = { type: LIKE_POST, payload: 2 };
    const result = userReducer(initialState, action);
    expect(result.likedPostId).toContain(2);
    expect(result.dislikePostId).not.toContain(2);
  });

  it("should remove postId from dislikePostId when liking", () => {
    const modified = { ...initialState, dislikePostId: [2] };
    const result = userReducer(modified, { type: LIKE_POST, payload: 2 });
    expect(result.likedPostId).toContain(2);
    expect(result.dislikePostId).not.toContain(2);
  });

  it("should handle REMOVE_LIKE_POST", () => {
    const modified = { ...initialState, likedPostId: [1, 2] };
    const result = userReducer(modified, { type: REMOVE_LIKE_POST, payload: 2 });
    expect(result.likedPostId).toEqual([1]);
  });

  it("should handle DISLIKE_POST", () => {
    const action = { type: DISLIKE_POST, payload: 5 };
    const result = userReducer(initialState, action);
    expect(result.dislikePostId).toContain(5);
  });

  it("should remove postId from likedPostId when disliking", () => {
    const modified = { ...initialState, likedPostId: [5] };
    const result = userReducer(modified, { type: DISLIKE_POST, payload: 5 });
    expect(result.likedPostId).not.toContain(5);
    expect(result.dislikePostId).toContain(5);
  });

  it("should handle REMOVE_DISLIKE_POST", () => {
    const modified = { ...initialState, dislikePostId: [4, 5] };
    const result = userReducer(modified, { type: REMOVE_DISLIKE_POST, payload: 4 });
    expect(result.dislikePostId).toEqual([5]);
  });

  it("should handle COMMENT_POST", () => {
    const comment: CommentData = { postId: 1, comment: "Nice post!" };
    const action = { type: COMMENT_POST, payload: comment };
    const result = userReducer(initialState, action);
    expect(result.commentedPosts).toContainEqual(comment);
  });

  it("should handle SET_USER_PROFILE_DETAILS", () => {
    const payload = {
      firstName: "John",
      lastName: "Doe",
      image: "img.png",
      phone: "1234567890",
      gender: "male",
      company: { name: "OpenAI", title: "Engineer" },
    };
    const action = { type: SET_USER_PROFILE_DETAILS, payload };
    const result = userReducer(initialState, action);
    expect(result.firstName).toBe("John");
    expect(result.company.name).toBe("OpenAI");
  });

  it("should handle ADD_UPLOADED_POST", () => {
    const post: UploadPostType = {
      id: 1,
      title: "My Post",
      body: "Post content",
      tags: ["test"],
      reactions: { likes: 0, dislikes: 0 },
      views: 10,
      userId: 1,
    };
    const action = { type: ADD_UPLOADED_POST, payload: post };
    const result = userReducer(initialState, action);
    expect(result.uploadedPosts).toContainEqual(post);
  });
});
