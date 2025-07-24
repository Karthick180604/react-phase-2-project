import api from "./axiosInterceptor";

export const getAllUsers = () => {
  return api.get('/users?limit=208');
};

export const getSingleUser = (id: number) => {
  return api.get(`/users/${id}`);
};

export const getSearchedUsers = (searchText: string) => {
  return api.get(`/users/search?q=${searchText}`);
};

export const getAllPosts = (limit = 10, skip = 0) => {
  return api.get(`/posts?limit=${limit}&skip=${skip}`);
};

export const getSingleUserPosts = (userId: number) => {
  return api.get(`/posts/user/${userId}`);
};

export const getPostComments = (postId: number) => {
  return api.get(`/comments/post/${postId}`);
};

export const getSearchedPosts = (searchText: string) => {
  return api.get(`/posts/search?q=${searchText}`);
};

export const getAllPostTags = () => {
  return api.get('/posts/tags');
};

export const getAllPostTagsArray = () => {
  return api.get('/posts/tag-list');
};
