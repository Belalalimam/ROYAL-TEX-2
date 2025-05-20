import { orderActions } from "../slices/orderReducer";
import request from "../../utils/request";
import { toast } from "react-toastify";

export function getUserProfileLike(userId) {
    return async (dispatch) => {
        try{
            const {data} = await request.get(`/api/users/Profile/${userId}`); 
            dispatch(orderActions.setOrderItem(data))
            // console.log("🚀 ~ return ~ data:", data.likes)
        }catch(error){
            console.log(error)
            toast.error(error.response.data.message);
        }

    }
}