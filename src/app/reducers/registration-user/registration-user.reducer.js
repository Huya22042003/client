import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const RegistrationUserSlice = createSlice({
  name: "registrationUser",
  initialState,
  reducers: {
    AddRegistrationUser: (state, action) => {
      state.push(action.payload);
      return state;
    },
    UpdateRegistrationUser: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
        return state;
      }
    },
    PutRegistrationUser: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
      return state;
    },

    DeleteRegistrationUser: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
        return state;
      }
    },
    SetRegistrationUser: (state, action) => {
      state = action.payload;
      return state;
    },
    FindByIdRegistrationUser: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        return state[index];
      }
    },
  },
});

export const GetRegistrationUser = (state) => state.registrationUser;
export const {
  AddRegistrationUser,
  UpdateRegistrationUser,
  DeleteRegistrationUser,
  SetRegistrationUser,
  PutRegistrationUser,
  FindByIdRegistrationUser,
} = RegistrationUserSlice.actions;
export default RegistrationUserSlice.reducer;
