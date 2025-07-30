import { type Dispatch } from "redux";
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
} from "../ActionTypes/postsActionTypes";
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
  username?: string;
  image?: string;
  currentUser?: boolean
};

type FetchPostsRequest = {
  type: typeof FETCH_POSTS_REQUEST;
};

type FetchPostsSuccess = {
  type: typeof FETCH_POSTS_SUCCESS;
  payload: Post[];
  meta: { page: number };
};

type FetchPostsFailure = {
  type: typeof FETCH_POSTS_FAILURE;
  payload: string;
};

export type PostActionType =
  | FetchPostsRequest
  | FetchPostsSuccess
  | FetchPostsFailure;

export const fetchPosts =
  (page = 1, limit = 10) =>
  async (dispatch: Dispatch<PostActionType>) => {
    dispatch({ type: FETCH_POSTS_REQUEST });

    try {
      const skip = (page - 1) * limit;
      const response = await getAllPosts(limit, skip);
      const posts = response.data.posts;

      const postData:Post[]=[]
      for(const post of posts)
      {
        try {
          const userRes=await getSingleUser(post.userId)
          const user:UserType=userRes.data

          postData.push({
            ...post,
            username:user.firstName,
            image:user.image
          })
        } catch (error) {
          postData.push({
            ...post,
            username:"Failed to fetch user",
            image:"https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
          })
        }

      }

      dispatch({
        type: FETCH_POSTS_SUCCESS,
        payload: postData,
        meta: { page },
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_POSTS_FAILURE,
        payload: error.message || "Something went wrong",
      });
      
    }
  };
