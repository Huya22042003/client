import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const ArticlesAlbumSlice = createSlice({
    name: "articlesAlbum",
    initialState,
    reducers: {
        AddArticlesAlbum: (state, action) => {
            state.push(action.payload);
            return state;
        },
        UpdateArticlesAlbum: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutArticlesAlbum: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteArticlesAlbum: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetArticlesAlbum: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdArticlesAlbum: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetArticlesAlbum = (state) => state.articlesAlbum;
export const { AddArticlesAlbum, UpdateArticlesAlbum, DeleteArticlesAlbum, SetArticlesAlbum, PutArticlesAlbum, FindByIdArticlesAlbum } = ArticlesAlbumSlice.actions;
export default ArticlesAlbumSlice.reducer;
