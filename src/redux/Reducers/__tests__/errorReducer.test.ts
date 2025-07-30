import errorReducer from "../errorReducer";
import { SET_API_ERROR } from "../../Actions/errorAction";

describe("errorReducer", () => {
  const initialState = { hasApiError: false };

  it("should return the initial state by default", () => {
    const newState = errorReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(newState).toEqual(initialState);
  });

  it("should handle SET_API_ERROR with true", () => {
    const action = { type: SET_API_ERROR, payload: true };
    const expectedState = { hasApiError: true };
    expect(errorReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle SET_API_ERROR with false", () => {
    const stateWithError = { hasApiError: true };
    const action = { type: SET_API_ERROR, payload: false };
    const expectedState = { hasApiError: false };
    expect(errorReducer(stateWithError, action)).toEqual(expectedState);
  });
});
