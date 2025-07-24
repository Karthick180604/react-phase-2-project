import axios from 'axios';
import { setApiError } from '../redux/Actions/errorAction';
import { store } from '../redux/Store/store';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    store.dispatch(setApiError(true));
    return Promise.reject(error);
  }
);

export default api;
