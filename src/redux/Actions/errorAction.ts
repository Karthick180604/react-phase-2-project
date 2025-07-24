export const SET_API_ERROR = 'SET_API_ERROR';

export const setApiError = (hasError: boolean) => ({
  type: SET_API_ERROR,
  payload: hasError,
});
