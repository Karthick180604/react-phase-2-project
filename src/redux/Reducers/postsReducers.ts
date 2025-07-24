import type { Post, PostActionType } from "../Actions/postsActions";
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
} from "../ActionTypes/postsActionTypes";

export type PostStateType = {
  posts: Post[];
  loading: boolean;
  error: string | null;
};

const initialState: PostStateType = {
  posts: [],
  loading: false,
  error: null,
};

export const postReducer = (
  state = initialState,
  action: PostActionType
): PostStateType => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts:
          "meta" in action && action.meta.page === 1
            ? action.payload
            : [...state.posts, ...action.payload],
        error: null,
      };

    case FETCH_POSTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
