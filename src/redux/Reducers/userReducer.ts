import type { UserActionType } from "../Actions/userActions";
import { COMMENT_POST, DISLIKE_POST, LIKE_POST, LOGOUT_USER, REMOVE_DISLIKE_POST, REMOVE_LIKE_POST, SET_USER, SET_USER_PROFILE_DETAILS } from "../ActionTypes/userActionTypes";

export type CommentData = {
  postId: number;
  comment: string;
}

export type CompanyType={
  name:string;
  title:string;
}

export type UserStateType = {
    id:number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image:string;
  gender:string;
  phone:string;
  company: CompanyType;
  likedPostId: number[];
  dislikePostId:number[];
  commentedPosts: CommentData[];
}

const initialUserState:UserStateType={
    id:-1,
    username:"",
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    image:"",
    gender:"",
    phone:"",
    company:{
      name:"",
      title:"",
    },
    likedPostId:[],
    dislikePostId:[],
    commentedPosts:[],
    // uploadedPosts:[]
}

export const userReducer = (
  state = initialUserState,
  action: UserActionType
): UserStateType => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        id:action.payload.userId,
        username: action.payload.userName,
        email: action.payload.userEmail,
        password: action.payload.userPassword,
      };

    case LOGOUT_USER:
      return initialUserState;

    case LIKE_POST:{
      if(!state.likedPostId.includes(action.payload))
      {
        let filteredArray=[]
        if(state.dislikePostId.includes(action.payload))
        {
          filteredArray=state.dislikePostId.filter((data)=>{
            return data!==action.payload
          })
        }
        else
        {
          filteredArray=state.dislikePostId
        }
        return {
          ...state,
          likedPostId: [...state.likedPostId, action.payload],
          dislikePostId:filteredArray
        };
      }
      return state;
    }
    case REMOVE_LIKE_POST:{
      const filteredArray=state.likedPostId.filter((data)=>{
        return data!==action.payload
      })
      return {
        ...state,
        likedPostId:filteredArray
      }
    }

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
  case DISLIKE_POST:{
    if(!state.dislikePostId.includes(action.payload))
    {
      let filteredArray=[]
      if(state.likedPostId.includes(action.payload))
      {
        filteredArray=state.likedPostId.filter((data)=>{
          return data!==action.payload
        })
      }
      else
      {
        filteredArray=state.likedPostId
      }
      return{
        ...state,
        dislikePostId:[...state.dislikePostId, action.payload],
        likedPostId:filteredArray
      }
    }
    return state
  }
  case REMOVE_DISLIKE_POST:{
    const filteredArray=state.dislikePostId.filter((data)=>{
      return data!==action.payload
    })
    return{
      ...state,
      dislikePostId:filteredArray
    }
  }
  case SET_USER_PROFILE_DETAILS:
  return {
    ...state,
    firstName: action.payload.firstName,
    lastName: action.payload.lastName,
    image: action.payload.image,
    phone: action.payload.phone,
    gender: action.payload.gender,
    company: {
      name: action.payload.company.name,
      title: action.payload.company.title,
    },
  };

    default:
      return state;
  }
};

