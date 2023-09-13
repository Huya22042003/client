import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const TymsSlice = createSlice({
    name: "tyms",
    initialState,
    reducers: {
        AddTyms: (state, action) => {
            state.push(action.payload);
            return state;
        },
        UpdateTyms: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutTyms: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteTyms: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetTyms: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdTyms: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetTyms = (state) => state.tyms;
export const { AddTyms, UpdateTyms, DeleteTyms, SetTyms, PutTyms, FindByIdTyms } = TymsSlice.actions;
export default TymsSlice.reducer;
