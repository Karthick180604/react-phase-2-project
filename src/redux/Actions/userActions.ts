import { COMMENT_POST, DISLIKE_POST, LIKE_POST, LOGOUT_USER, REMOVE_DISLIKE_POST, REMOVE_LIKE_POST, SET_USER, SET_USER_PROFILE_DETAILS } from "../ActionTypes/userActionTypes";
import type { CompanyType } from "../Reducers/userReducer";

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

interface RemoveLikePostAction {
  type: typeof REMOVE_LIKE_POST;
  payload: number;
}


interface CommentPostAction {
  type: typeof COMMENT_POST;
  payload: {
    postId: number;
    comment: string;
  };
}

interface DislikePostAction {
  type: typeof DISLIKE_POST;
  payload: number;
}

interface RemoveDislikePostAction {
  type: typeof REMOVE_DISLIKE_POST;
  payload: number;
}

interface SetUserProfileDetailsAction {
  type: typeof SET_USER_PROFILE_DETAILS;
  payload: {
    firstName: string;
    lastName: string;
    image: string;
    phone: string;
    gender: string;
    company: CompanyType;
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

export const removeLikePost=(postId: number)=>({
  type:REMOVE_LIKE_POST,
  payload:postId
})

export const commentPost = (postId: number, comment: string) => ({
  type: COMMENT_POST,
  payload: { postId, comment },
});

export const dislikePost=(postId: number)=>({
  type:DISLIKE_POST,
  payload:postId
})

export const removeDislikePost=(postId: number)=>({
  type:REMOVE_DISLIKE_POST,
  payload:postId
})

export const setUserProfileDetails = (payload: {
  firstName: string;
  lastName: string;
  image: string;
  phone: string;
  gender: string;
  company: CompanyType;
}) => ({
  type: SET_USER_PROFILE_DETAILS,
  payload,
});


export type UserActionType =
  | SetUserAction
  | LogoutUserAction
  | LikePostAction
  | CommentPostAction
  | RemoveLikePostAction
  | DislikePostAction
  | RemoveDislikePostAction
  | SetUserProfileDetailsAction
