import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const ArticlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    AddArticles: (state, action) => {
      state.unshift(action.payload);
      return state;
    },
    UpdateArticles: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
        return state;
      }
    },
    PutArticles: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
      return state;
    },

    DeleteArticles: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
        return state;
      }
    },
    SetArticles: (state, action) => {
      state = action.payload;
      return state;
    },

    AddApproveArticles: (state, action) => {
      let data = action.payload;
      let dataConvert = {
        name: data.name,
        id: data.id,
        title: data.title,
        status: "2",
        browseDate: data.browseDate,
        createdDate: data.createdDate,
        stt: data.stt,
      };
      state.unshift(dataConvert);
      state.pop();
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
      return state;
    },

    FindByIdArticles: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        return state[index];
      }
    },
  },
});

export const GetArticles = (state) => state.articles;
export const {
  AddArticles,
  UpdateArticles,
  DeleteArticles,
  SetArticles,
  PutArticles,
  FindByIdArticles,
  AddApproveArticles,
} = ArticlesSlice.actions;
export default ArticlesSlice.reducer;
