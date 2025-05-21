import { orderActions } from "../slices/orderReducer";
import request from "../../utils/request";
import { toast } from "react-toastify";

export function getUserProfileOrder() {
    return async (dispatch, getState) => {
        try{
            const state = getState();
            const {data} = await request.get(`/api/checkout/user/orders`, {
                headers: {
                    authorization: 'Bearer ' + state.auth.user.token
                }
            }); 
            dispatch(orderActions.setOrderItem(data.orders));
            // toast.success("Order placed successfully!");
        }catch(error){
            toast.error(error.response.data.message);
        }

    }
}