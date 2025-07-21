import type { formType, UserType } from "../types/types";
import { getAllUsers } from "./apiCalls";

export const findUser=async(formData:formType):Promise<UserType | unknown>=>{
    try {
      const response=await getAllUsers();
      const findUser=response.data.users.find((user:UserType)=>{
        return user.email===formData.email
      })
      const isExist=!!findUser
      console.log(findUser)
      return findUser
    } catch (error) {
      return error
    }
  }