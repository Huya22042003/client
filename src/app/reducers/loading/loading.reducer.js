import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

export const LoaddingSlice = createSlice({
  name: "loadding",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.status = true;
    },
    finishLoading: (state) => {
      state.status = false;
    },
  },
});

export const GetRegistrationUser = (state) => state.loadding;
export const { startLoading, finishLoading } = LoaddingSlice.actions;
export const SelectLoading = (state) => state.loading.status;
export default LoaddingSlice.reducer;
