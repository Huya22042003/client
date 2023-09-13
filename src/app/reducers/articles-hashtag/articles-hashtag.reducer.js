import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const ArticlesHashtagSlice = createSlice({
    name: "articlesHashtag",
    initialState,
    reducers: {
        AddArticlesHashtag: (state, action) => {
            state.push(action.payload);
            return state;
        },
        UpdateArticlesHashtag: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutArticlesHashtag: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteArticlesHashtag: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetArticlesHashtag: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdArticlesHashtag: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetArticlesHashtag = (state) => state.articlesHashtag;
export const { AddArticlesHashtag, UpdateArticlesHashtag, DeleteArticlesHashtag, SetArticlesHashtag, PutArticlesHashtag, FindByIdArticlesHashtag } = ArticlesHashtagSlice.actions;
export default ArticlesHashtagSlice.reducer;
