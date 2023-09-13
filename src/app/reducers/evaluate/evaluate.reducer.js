import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const EvaluateSlice = createSlice({
    name: "evaluate",
    initialState,
    reducers: {
        AddEvaluate: (state, action) => {
            state.push(action.payload);
            return state;
        },
        UpdateEvaluate: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutEvaluate: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteEvaluate: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetEvaluate: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdEvaluate: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetEvaluate = (state) => state.evaluate;
export const { AddEvaluate, UpdateEvaluate, DeleteEvaluate, SetEvaluate, PutEvaluate, FindByIdEvaluate } = EvaluateSlice.actions;
export default EvaluateSlice.reducer;
