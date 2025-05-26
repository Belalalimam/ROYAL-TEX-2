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

export const updateCartQuantity = (itemId, quantity) => {
  return async (dispatch, getState) => {
    try {
      const { auth } = getState();
      
      // Make sure quantity is a number and greater than 0
      const validQuantity = parseInt(quantity);
      if (!validQuantity || validQuantity < 1) {
        throw new Error("Quantity must be a positive number");
      }

      const response = await request.put(`/api/cart/${itemId}`, {
        quantity: validQuantity
      }, {
        headers: {
          Authorization: "Bearer " + auth.user.token,
        },
      });
      
      dispatch(cartActions.updateCart(response.data));
      return response.data;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  };
};

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
export function checkoutCart(shippingAddress, navigate) { 
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const { data } = await request.post(`/api/checkout`, shippingAddress,  {
                headers: {
                    authorization: 'Bearer ' + state.auth.user.token
                }
            });
            
            dispatch(cartActions.clearCart());
            
            toast.success("Checkout successful!");
            if (navigate) {
                navigate('/profile/:id'); // or whatever your profile route is
            }
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


