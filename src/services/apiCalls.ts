import axios from "axios"

export const getAllUsers=()=>{
    return axios.get('https://dummyjson.com/users?limit=208')
}

export const getAllPosts = (limit = 10, skip = 0) => {
  return axios.get(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
};


export const getSingleUser=(id:number)=>{
    return axios.get(`https://dummyjson.com/users/${id}`)
}

export const getPostComments=(postId:number)=>{
    return axios.get(`https://dummyjson.com/comments/post/${postId}`)
}

export const getSearchedPosts=(searchText:string)=>{
    return axios.get(`https://dummyjson.com/posts/search?q=${searchText}`)
}

export const getAllPostTags=()=>{
    return axios.get("https://dummyjson.com/posts/tags")
}

export const getSearchedUsers=(searchText:string)=>{
    return axios.get(`https://dummyjson.com/users/search?q=${searchText}`)
}

export const getSingleUserPosts=(userId:number)=>{
    return axios.get(`https://dummyjson.com/posts/user/${userId}`);
}

export const getAllPostTagsArray=()=>{
    return axios.get('https://dummyjson.com/posts/tag-list')
}