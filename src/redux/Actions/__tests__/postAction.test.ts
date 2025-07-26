//cleared test
import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
} from "../../ActionTypes/postsActionTypes";
import { fetchPosts } from "../postsActions";
import { getAllPosts, getSingleUser } from "../../../services/apiCalls"
import type { Post } from "../postsActions";
import type { UserType } from "../../../types/types";

jest.mock("../../../services/apiCalls");

const mockedGetAllPosts = getAllPosts as jest.Mock;
const mockedGetSingleUser = getSingleUser as jest.Mock;

describe("fetchPosts thunk", () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({
    posts: {
      data: [],
    },
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches FETCH_POSTS_SUCCESS on successful fetch", async () => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: "Post 1",
        body: "Body 1",
        tags: ["tag1"],
        reactions: { likes: 10, dislikes: 1 },
        views: 100,
        userId: 1,
      },
    ];

    const userResponse: UserType = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      image: "https://example.com/john.jpg",
      // any other fields needed by your UserType
    };

    mockedGetAllPosts.mockResolvedValue({
      data: { posts: samplePosts },
    });

    mockedGetSingleUser.mockResolvedValue({
      data: userResponse,
    });

    await fetchPosts(1, 10)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({ type: FETCH_POSTS_REQUEST });

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_POSTS_SUCCESS,
      payload: [
        {
          ...samplePosts[0],
          username: "John",
          image: "https://example.com/john.jpg",
        },
      ],
      meta: { page: 1 },
    });
  });

  it("dispatches FETCH_POSTS_FAILURE on API error", async () => {
    mockedGetAllPosts.mockRejectedValue(new Error("Network error"));

    await fetchPosts(1, 10)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({ type: FETCH_POSTS_REQUEST });

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_POSTS_FAILURE,
      payload: "Network error",
    });
  });
});
