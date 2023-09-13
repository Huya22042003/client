import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const HistorySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        AddHistory: (state, action) => {
            state.push(action.payload);
            return state;
        },
        UpdateHistory: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutHistory: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteHistory: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetHistory: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdHistory: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetHistory = (state) => state.history;
export const { AddHistory, UpdateHistory, DeleteHistory, SetHistory, PutHistory, FindByIdHistory } = HistorySlice.actions;
export default HistorySlice.reducer;
