import { type Dispatch } from "redux";
import { FETCH_POSTS_FAILURE, FETCH_POSTS_REQUEST, FETCH_POSTS_SUCCESS } from "../ActionTypes/postsActionTypes";
import { getAllPosts, getSingleUser } from "../../services/apiCalls";
import type { UserType } from "../../types/types";
import type { RootState } from "../Store/store";



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
  userName?:string;
};

// Action Type Definitions
type FetchPostsRequest = {
  type: typeof FETCH_POSTS_REQUEST;
};

type FetchPostsSuccess = {
  type: typeof FETCH_POSTS_SUCCESS;
  payload: Post[];
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

export const fetchPosts = () => async (dispatch: Dispatch<PostActionType>, getState: () => RootState) => {
  dispatch({ type: FETCH_POSTS_REQUEST });

  try {
    const response = await getAllPosts();
    const posts = response.data.posts;

    // Fetch usernames in parallel and attach to posts
    const { likedPostId } = getState().user;
    console.log("mounting the fetch post")
    const postData: Post[] = await Promise.all(
      posts.map(async (post: Post) => {
        const response = await getSingleUser(post.userId);
        const user:UserType=response.data
        return {
          ...post,
          userName: user.firstName,
        };
      })
    );
    
    dispatch({
      type: FETCH_POSTS_SUCCESS,
      payload: postData,
    });
  } catch (error: any) {
    dispatch({
      type: FETCH_POSTS_FAILURE,
      payload: error.message || "Something went wrong",
    });
  }
};