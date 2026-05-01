import { useMutation, useQuery } from "@tanstack/react-query"
import API from "../api/ApiCall"
import { NewUser } from "../types/type.types"

 export const useSelectAllUsers = ()=>{
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await API.get('/user')
            return response.data
        }
    })
 }

 export const useSelectRoles = ()=>{
    return useQuery ({
        queryKey: ["roles"],
        queryFn: async ()=>{
            const response = await API.get('/user/roles')
            return response.data
        }
    })
 }

const createUser = async({firstName,lastName,email,role_id,phoneNumber}:NewUser)=>{
    const phone = `+25${phoneNumber}`
    const response =  await API.post("/user",{firstName,lastName,email,role_id,phoneNumber:phone})
    return response.data
 }
 export const userCreateUserMutation = ()=>{
    return useMutation({
        mutationKey: ['create-user'],
        mutationFn: createUser
    })
 }

 const disableUser = async(id:string)=>{
    const response = await API.put(`/user/disable-user/${id}`)
    return response.data
 }
 export const userDisableUserMutation = ()=>{
    return useMutation({
        mutationKey:['disable-user'],
        mutationFn: disableUser

    })
 }

 interface loginType {
    email: string,
    password: string
 }
 export const useLogin =()=>{
    return useMutation({
        mutationKey: ['login'],
        mutationFn: async({email,password}:loginType)=>{
            try {
                const response = await API.post("/auth/login", { email, password });
                return response.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || "Invalid email or password");
            }
        }
    })
 }

 export const useForgotPassword =()=>{
    return useMutation({
        mutationKey: ['forgot-password'],
        mutationFn: async({email}:{email:string})=>{
            try {
                const response = await API.post("/auth/forgot-password", { email });
                return response.data;
            }catch(error:any){
                throw new Error(error.response?.data?.message || error.response?.data?.error || "An error occurred");
            }
        }
    })
 }

 export const useRestPassword = () =>{
    return useMutation({
        mutationKey: ['reset-password'],
        mutationFn: async({newPassword,token}:{newPassword:string,token:string})=>{
            try {
                const response = await API.post(`/auth/reset-password/${token}`, { newPassword });
                return response.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || error.response?.data?.error || "An error occurred");
            }
        }
    })
 }

 export const useResendOtp =()=>{
    return useMutation({
        mutationKey: ['resend-otp'],
        mutationFn: async({userId}:{userId:string})=>{
            try {
                const response = await API.post("/auth/resend-otp", { userId });
                return response.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || error.response?.data?.error || "An error occurred");
            }
        }
    })
 }