import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

let initialState = {
  favoritesBook: [],
};


export const favoritesSlicer = createSlice({
  name: "favoritesSlicer",
  initialState,
  reducers: {
    setBookFavorites: (state, action) => {
      state.favoritesBook = action.payload;
    },
    addBookToFavorites: (state, action) => {
      if (!state.favoritesBook.includes(action.payload)){
        console.log("test")
        state.favoritesBook.push(action.payload);
    }
    },
    removeBookFromFavorites: (state, action) => {
        state.favoritesBook = state.favoritesBook.filter(id => id !== action.payload)
    },
    clearFavorites: (state, action) => {
        state.favoritesBook = [];
    },
  },
});

// export actions
export const {setBookFavorites, addBookToFavorites, removeBookFromFavorites, clearFavorites } = favoritesSlicer.actions;

// export this file
export default favoritesSlicer.reducer;