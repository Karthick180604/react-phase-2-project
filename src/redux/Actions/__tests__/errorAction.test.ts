import { setApiError, SET_API_ERROR } from "../errorAction";

describe("setApiError action", () => {
  it("should create an action to set API error to true", () => {
    const expectedAction = {
      type: SET_API_ERROR,
      payload: true,
    };

    expect(setApiError(true)).toEqual(expectedAction);
  });

  it("should create an action to set API error to false", () => {
    const expectedAction = {
      type: SET_API_ERROR,
      payload: false,
    };

    expect(setApiError(false)).toEqual(expectedAction);
  });
});
