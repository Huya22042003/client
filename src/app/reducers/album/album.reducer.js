import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const AlbumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    AddAlbum: (state, action) => {
      state.push(action.payload);
      return state;
    },
    UpdateAlbum: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
        return state;
      }
    },
    PutAlbum: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
      return state;
    },

    DeleteAlbum: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
        return state;
      }
    },
    SetAlbum: (state, action) => {
      state = action.payload;
      return state;
    },
    FindByIdAlbum: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        return state[index];
      }
    },
  },
});

export const GetAlbum = (state) => state.album;
export const {
  AddAlbum,
  UpdateAlbum,
  DeleteAlbum,
  SetAlbum,
  PutAlbum,
  FindByIdAlbum,
} = AlbumSlice.actions;
export default AlbumSlice.reducer;
