import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        AddUser: (state, action) => {
            state.push(0, action.payload);
            return state;
        },
        UpdateUser: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutUser: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteUser: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetUser: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdUser: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetUser = (state) => state.user;
export const { AddUser, UpdateUser, DeleteUser, SetUser, PutUser, FindByIdUser } = UserSlice.actions;
export default UserSlice.reducer;
