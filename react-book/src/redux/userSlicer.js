import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  currentUser: null,
};

export const userSlicer = createSlice({
  name: "userSlicer",
  initialState,
  reducers: {
    setUserInfor: (state, action) => {
      state.currentUser = action.payload;
    },
    logOutUser: (state, action) => {
      state.currentUser = null;
    },
  },
});

// export actions
export const { setUserInfor, logOutUser } = userSlicer.actions;

// export this file
export default userSlicer.reducer;