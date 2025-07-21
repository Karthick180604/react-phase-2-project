import { COMMENT_POST, LIKE_POST, LOGOUT_USER, SET_USER } from "../ActionTypes/userActionTypes";

interface SetUserAction {
  type: typeof SET_USER;
  payload: {
    userId:number;
    userName: string;
    userEmail: string;
    userPassword: string;
  };
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

interface LikePostAction {
  type: typeof LIKE_POST;
  payload: number;
}

interface CommentPostAction {
  type: typeof COMMENT_POST;
  payload: {
    postId: number;
    comment: string;
  };
}

export const setUser = (userId:number, userName: string, userEmail: string, userPassword: string) => ({
  type: SET_USER,
  payload: {userId, userName, userEmail, userPassword },
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const likePost = (postId: number) => ({
  type: LIKE_POST,
  payload: postId,
});

export const commentPost = (postId: number, comment: string) => ({
  type: COMMENT_POST,
  payload: { postId, comment },
});


export type UserActionType =
  | SetUserAction
  | LogoutUserAction
  | LikePostAction
  | CommentPostAction;
