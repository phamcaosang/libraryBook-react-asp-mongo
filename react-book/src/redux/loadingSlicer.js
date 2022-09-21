import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
};


export const loadingSlicer = createSlice({
  name: "loadingSlicer",
  initialState,
  reducers: {
    onLoading: (state, action) => {
        state.isLoading = true;
    },
    offLoading: (state, action) => {
        state.isLoading = false;
    }
  },
});

// export actions
export const { onLoading, offLoading} = loadingSlicer.actions;

// export this file
export default loadingSlicer.reducer;