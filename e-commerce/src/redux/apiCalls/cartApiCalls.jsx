import { cartActions } from "../slices/cartReducer";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Get user cart items
export function getUserProfileCart() {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const { data } = await request.get(`/api/cart`, {
                headers: {
                    authorization: 'Bearer ' + state.auth.user.token
                }
            });
            dispatch(cartActions.setCartItem(data));
        } catch (error) {
            toast.error(`from cart ${error.response.data.message}`);
        }
    }
}

// Add cart item
// Add cart item
export function putCartForProduct(productId, quantity, productPrice) {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const { data } = await request.post(`/api/cart/${productId}`, {quantity, productPrice}, {
                headers: {
                    authorization: 'Bearer ' + state.auth.user.token
                }
            });
            dispatch(cartActions.setCartItem(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}



// Remove cart item
export function deleteCartForProduct(productId) {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const { data } = await request.delete(`/api/cart/${productId}`, {
                headers: {
                    authorization: 'Bearer ' + state.auth.user.token
                }
            });
            dispatch(cartActions.setCartItem(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}



// Checkout cart
export function checkoutCart(shippingAddress) {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const { data } = await request.post(`/api/checkout`, {shippingAddress},  {
                headers: {
                    authorization: 'Bearer ' + state.auth.user.token
                }
            });
            
            dispatch(cartActions.clearCart());
            
            toast.success("Checkout successful!");
            return { success: true, order: data };
        } catch (error) {
            toast.error(error.response?.data?.message || "Checkout failed. Please try again.");
            console.log(error);
            return { success: false, error: error.response?.data?.message || "Checkout failed" };
        }
    }
}


clearCart: (state) => {
    state.item = null;
    // or if you prefer: state.item = { items: [] };
}


