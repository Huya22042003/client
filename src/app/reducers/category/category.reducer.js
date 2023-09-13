import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const CategorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        AddCategory: (state, action) => {
            state.unshift(action.payload);
            return state;
        },
        UpdateCategory: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutCategory: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteCategory: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetCategory: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdCategory: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetCategory = (state) => state.category;
export const { AddCategory, UpdateCategory, DeleteCategory, SetCategory, PutCategory, FindByIdCategory } = CategorySlice.actions;
export default CategorySlice.reducer;
