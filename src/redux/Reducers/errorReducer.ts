import { SET_API_ERROR } from "../Actions/errorAction";

const initialState = {
  hasApiError: false,
};

export default function errorReducer(state = initialState, action: any) {
  switch (action.type) {
    case SET_API_ERROR:
      return { ...state, hasApiError: action.payload };
    default:
      return state;
  }
}
