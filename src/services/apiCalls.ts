import axios from "axios"

export const getAllUsers=()=>{
    return axios.get('https://dummyjson.com/users?limit=208')
}