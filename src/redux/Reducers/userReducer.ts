import type { UserActionType } from "../Actions/userActions";
import { COMMENT_POST, LIKE_POST, LOGOUT_USER, SET_USER } from "../ActionTypes/userActionTypes";

export type CommentData = {
  postId: number;
  comment: string;
}

export type UserStateType = {
    userId:number;
  userName: string;
  userEmail: string;
  userPassword: string;
  likedPostId: number[];
  commentedPosts: CommentData[];
}

const initialUserState:UserStateType={
    userId:-1,
    userName:"",
    userEmail:"",
    userPassword:"",
    likedPostId:[],
    commentedPosts:[]
}

export const userReducer = (
  state = initialUserState,
  action: UserActionType
): UserStateType => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        userId:action.payload.userId,
        userName: action.payload.userName,
        userEmail: action.payload.userEmail,
        userPassword: action.payload.userPassword,
      };

    case LOGOUT_USER:
      return initialUserState;

    case LIKE_POST:
      return {
        ...state,
        likedPostId: [...state.likedPostId, action.payload],
      };

    case COMMENT_POST:
  return {
    ...state,
    commentedPosts: [
      ...state.commentedPosts,
      {
        postId: action.payload.postId,
        comment: action.payload.comment,
      },
    ],
  };
    default:
      return state;
  }
};

