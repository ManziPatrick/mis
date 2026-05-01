import { useMutation, useQuery } from "@tanstack/react-query"
import API from "../api/ApiCall"

export const useNotificationQuery = ()=>{
    return useQuery({
        queryKey: ['notifications'],
        queryFn: async()=>{
            const response = await API.get("/notification")
            return response.data
        }
    })
}

export const useGetOneNotificationQuery = (id:string)=>{
    return useQuery({
        queryKey: ['single-notification'],
        queryFn: async()=>{
            const response = await API.get(`/notification/${id}`)
        }
        
    })
}

export const useReadNotification = ()=>{
    return useMutation({
        mutationKey: ['read-single-notification'],
        mutationFn: async(id: string)=>{
            const response = await API.put(`/notification/${id}/status`)
            return response.data
        }
    })
}
export const useReadAllNotification = ()=>{
    return useMutation({
        mutationKey: ['read-all-notification'],
        mutationFn: async(id: string)=>{
            const response = await API.put(`/notification/status/all`)
            return response.data
        }
    })
}
