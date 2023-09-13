import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const RegistrationPeriodSlice = createSlice({
  name: "registrationPeriod",
  initialState,
  reducers: {
    AddRegistrationPeriod: (state, action) => {
      state.unshift(action.payload);
      return state;
    },
    // UpdateRegistrationPeriod: (state, action) => {
    //   const index = state.findIndex((el) => el.id === action.payload.id);
    //   if (index > -1) {
    //     state[index] = action.payload;
    //     return state;
    //   }
    // },
    PutRegistrationPeriod: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
      return state;
    },

    DeleteRegistrationPeriod: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
        return state;
      }
    },
    SetRegistrationPeriod: (state, action) => {
      state = action.payload;
      return state;
    },
    FindByIdRegistrationPeriod: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        return state[index];
      }
    },
  },
});

export const GetRegistrationPeriod = (state) => state.registrationPeriod;
export const {
  AddRegistrationPeriod,
  // UpdateRegistrationPeriod,
  DeleteRegistrationPeriod,
  SetRegistrationPeriod,
  PutRegistrationPeriod,
  FindByIdRegistrationPeriod,
} = RegistrationPeriodSlice.actions;
export default RegistrationPeriodSlice.reducer;
