import axios from "axios"

export const getAllUsers=()=>{
    return axios.get('https://dummyjson.com/users?limit=208')
}

export const getAllPosts=()=>{
    return axios.get("https://dummyjson.com/posts?limit=251")
}

export const getSingleUser=(id:number)=>{
    return axios.get(`https://dummyjson.com/users/${id}`)
}

export const getPostComments=(postId:number)=>{
    return axios.get(`https://dummyjson.com/comments/post/${postId}`)
}