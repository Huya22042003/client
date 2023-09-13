import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const HashtagSlice = createSlice({
    name: "hashtag",
    initialState,
    reducers: {
        AddHashtag: (state, action) => {
            state.push(action.payload);
            return state;
        },
        UpdateHashtag: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutHashtag: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteHashtag: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetHashtag: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdHashtag: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetHashtag = (state) => state.hashtag;
export const { AddHashtag, UpdateHashtag, DeleteHashtag, SetHashtag, PutHashtag, FindByIdHashtag } = HashtagSlice.actions;
export default HashtagSlice.reducer;
