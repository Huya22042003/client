import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const PointSlice = createSlice({
    name: "point",
    initialState,
    reducers: {
        AddPoint: (state, action) => {
            state.push(action.payload);
            return state;
        },
        UpdatePoint: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutPoint: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeletePoint: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetPoint: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdPoint: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetPoint = (state) => state.point;
export const { AddPoint, UpdatePoint, DeletePoint, SetPoint, PutPoint, FindByIdPoint } = PointSlice.actions;
export default PointSlice.reducer;
