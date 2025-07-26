//cleared test
import {
  setUser,
  logoutUser,
  likePost,
  removeLikePost,
  commentPost,
  dislikePost,
  removeDislikePost,
  setUserProfileDetails,
  addUploadedPostAction,
} from "../../Actions/userActions";
import {
  SET_USER,
  LOGOUT_USER,
  LIKE_POST,
  REMOVE_LIKE_POST,
  COMMENT_POST,
  DISLIKE_POST,
  REMOVE_DISLIKE_POST,
  SET_USER_PROFILE_DETAILS,
  ADD_UPLOADED_POST,
} from "../../ActionTypes/userActionTypes";

describe("User Actions", () => {
  it("should create setUser action", () => {
    const result = setUser(1, "John", "john@example.com", "password123");
    expect(result).toEqual({
      type: SET_USER,
      payload: {
        userId: 1,
        userName: "John",
        userEmail: "john@example.com",
        userPassword: "password123",
      },
    });
  });

  it("should create logoutUser action", () => {
    expect(logoutUser()).toEqual({ type: LOGOUT_USER });
  });

  it("should create likePost action", () => {
    expect(likePost(10)).toEqual({ type: LIKE_POST, payload: 10 });
  });

  it("should create removeLikePost action", () => {
    expect(removeLikePost(10)).toEqual({ type: REMOVE_LIKE_POST, payload: 10 });
  });

  it("should create commentPost action", () => {
    const result = commentPost(5, "Nice post!");
    expect(result).toEqual({
      type: COMMENT_POST,
      payload: {
        postId: 5,
        comment: "Nice post!",
      },
    });
  });

  it("should create dislikePost action", () => {
    expect(dislikePost(8)).toEqual({ type: DISLIKE_POST, payload: 8 });
  });

  it("should create removeDislikePost action", () => {
    expect(removeDislikePost(8)).toEqual({ type: REMOVE_DISLIKE_POST, payload: 8 });
  });

  it("should create setUserProfileDetails action", () => {
    const payload = {
      firstName: "John",
      lastName: "Doe",
      image: "image.jpg",
      phone: "1234567890",
      gender: "male",
      company: {
        name: "Acme Corp",
        department: "Engineering",
        title: "Software Engineer",
      },
    };

    expect(setUserProfileDetails(payload)).toEqual({
      type: SET_USER_PROFILE_DETAILS,
      payload,
    });
  });

  it("should create addUploadedPostAction", () => {
    const post = {
      id: 1,
      title: "New Post",
      body: "Post body",
      tags: ["tag1", "tag2"],
      reactions: {
        likes: 10,
        dislikes: 2,
      },
      views: 50,
    };

    expect(addUploadedPostAction(post)).toEqual({
      type: ADD_UPLOADED_POST,
      payload: post,
    });
  });
});
