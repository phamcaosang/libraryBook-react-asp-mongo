import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  cartBook: [],
};


export const cartSlicer = createSlice({
  name: "cartSlicer",
  initialState,
  reducers: {
    addBookToCart: (state, action) => {
      if (!state.cartBook.includes(action.payload)){
        state.cartBook.push(action.payload);
      }
    },
    removeBookFromCart: (state, action) => {
      state.cartBook = state.cartBook.filter(id => id !== action.payload)
    },
    clearCart: (state, action) => {
        state.cartBook = [];
    },
  },
});

// export actions
export const { addBookToCart, removeBookFromCart, clearCart } = cartSlicer.actions;

// export this file
export default cartSlicer.reducer;