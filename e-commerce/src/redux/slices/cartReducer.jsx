import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "carts",
    initialState: {
        item: []
    },
    reducers: {
        setCartItem(state, action) {
            state.item = action.payload;
        },
        updateCart(state, action) {
            const { productId, quantity, productPrice } = action.payload;
            const itemIndex = state.item.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex !== -1) {
                state.item.items[itemIndex].quantity = quantity;
                state.item.items[itemIndex].productPrice = productPrice;
                state.item.totalAmount = state.item.calculateTotal();
            }
        },
        clearCart: (state) => {
            state.item = null;
          }
    }
});
const cartReducer = cartSlice.reducer;
const cartActions = cartSlice.actions;

export { cartReducer, cartActions };
