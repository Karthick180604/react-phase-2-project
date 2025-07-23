import { type Dispatch } from "redux";
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
} from "../ActionTypes/postsActionTypes";
import { getAllPosts, getSingleUser } from "../../services/apiCalls";
import type { UserType } from "../../types/types";
import type { RootState } from "../Store/store";

// Post type
export type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
  userName?: string;
  userImage?: string;
};

// Action Types
type FetchPostsRequest = {
  type: typeof FETCH_POSTS_REQUEST;
};

type FetchPostsSuccess = {
  type: typeof FETCH_POSTS_SUCCESS;
  payload: Post[];
  meta: { page: number }; // ✅ added meta for pagination
};

type FetchPostsFailure = {
  type: typeof FETCH_POSTS_FAILURE;
  payload: string;
};

export type PostActionType =
  | FetchPostsRequest
  | FetchPostsSuccess
  | FetchPostsFailure;

// Thunk Action
export const fetchPosts = (page = 1, limit = 10) => async (
  dispatch: Dispatch<PostActionType>,
  getState: () => RootState
) => {
  dispatch({ type: FETCH_POSTS_REQUEST });

  try {
    const skip = (page - 1) * limit;
    const response = await getAllPosts(limit, skip);
    const posts = response.data.posts;

    const postData: Post[] = await Promise.all(
      posts.map(async (post: Post) => {
        const userRes = await getSingleUser(post.userId);
        const user: UserType = userRes.data;
        return {
          ...post,
          userName: user.firstName,
          userImage: user.image,
        };
      })
    );

    dispatch({
      type: FETCH_POSTS_SUCCESS,
      payload: postData,
      meta: { page }, // ✅ pass page info
    });
  } catch (error: any) {
    dispatch({
      type: FETCH_POSTS_FAILURE,
      payload: error.message || "Something went wrong",
    });
  }
};
