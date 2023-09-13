import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const NotificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        AddNotification: (state, action) => {
            state.push(action.payload);
            return state;
        },
        UpdateNotification: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutNotification: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteNotification: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetNotification: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdNotification: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})
// export const countNotification = (state) => state.notification.length;

export const GetNotification = (state) => state.notification;
export const { AddNotification, UpdateNotification, DeleteNotification, SetNotification, PutNotification, FindByIdNotification } = NotificationSlice.actions;
export default NotificationSlice.reducer;
