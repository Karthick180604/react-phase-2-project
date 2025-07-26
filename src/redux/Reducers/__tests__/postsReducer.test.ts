//cleared tests
import { postReducer } from "../postsReducers";
import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
} from "../../ActionTypes/postsActionTypes";
import type {  Post } from "../../Actions/postsActions";
import { PostStateType } from "../postsReducers";

describe("postReducer", () => {
  const initialState: PostStateType = {
    posts: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    const action = { type: "UNKNOWN" } as any;
    const result = postReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it("should handle FETCH_POSTS_REQUEST", () => {
    const action = { type: FETCH_POSTS_REQUEST };
    const result = postReducer(initialState, action);
    expect(result).toEqual({ ...initialState, loading: true });
  });

  it("should handle FETCH_POSTS_SUCCESS (page 1)", () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: "Title",
        body: "Body",
        tags: ["tag1"],
        reactions: { likes: 1, dislikes: 0 },
        views: 100,
        userId: 1,
        username: "John",
        image: "url",
      },
    ];

    const action = {
      type: FETCH_POSTS_SUCCESS,
      payload: mockPosts,
      meta: { page: 1 },
    };

    const result = postReducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      posts: mockPosts,
      loading: false,
      error: null,
    });
  });

  it("should handle FETCH_POSTS_FAILURE", () => {
    const error = "Failed to fetch";
    const action = {
      type: FETCH_POSTS_FAILURE,
      payload: error,
    };
    const result = postReducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({ ...initialState, loading: false, error });
  });
});
