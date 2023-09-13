import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const CountNotificationSlice = createSlice({
  name: "countNotification",
  initialState,
  reducers: {
    SetCountNotification: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});
// export const countNotification = (state) => state.notification.length;

export const GetCountNotification = (state) => state.countNotification;
export const { SetCountNotification } = CountNotificationSlice.actions;
export default CountNotificationSlice.reducer;
