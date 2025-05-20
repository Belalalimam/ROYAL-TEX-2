import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        item: []
    },
    reducers: {
        setOrderItem(state, action) {
            state.item = action.payload;
        },
        clearOrder: (state) => {
            state.item = null;
          }
    }
});
const orderReducer = orderSlice.reducer;
const orderActions = orderSlice.actions;

export { orderReducer, orderActions };
