import { useContext, useEffect } from "react"
import { UserContext } from "../context/userContext"
import {API_PATHS} from "../utils/apiPath";
import { Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const useUserAuth=()=>{
    const{user, updateUser,clearUser}=useContext(UserContext);
    const navigate = useNavigate();
    useEffect(()=>{
        if(user) return;
        let isMounted= true;
        const fetchUserInfo =async()=>{
            try{
                const response= await axiosInstance.get(API_PATHS.AUTH.GET)
                if(isMounted && response.data){
                    updateUser(response.data);
                }
            }catch(error){
                console.log("Failed to fetch user info:",error);
                if(isMounted){
                    clearUser();
                    navigate("/login");
                 }
            }
        }
        fetchUserInfo();
        return ()=>{
            isMounted = false;
        }

    },[updateUser,clearUser,navigate])
}