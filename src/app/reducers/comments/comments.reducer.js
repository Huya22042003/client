import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const CommentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    AddComments: (state, action) => {
      let data = action.payload;
      let obj = {
        content: data.comment.content,
        createdDate: data.comment.createdDate,
        id: data.comment.id,
        reply: data.comment.reply,
        userID: data.user.id,
        userName: data.user.name,
        userImg: data.user.img,
        listReply: [],
      };
      state.push(obj);
      return state;
    },

    AddReply: (state, action) => {
      const { comment, user } = action.payload;
      const reply = {
        content: comment.content,
        createdDate: comment.createdDate,
        id: comment.id,
        reply: comment.reply,
        userID: user.id,
        userName: user.name,
        userImg: user.img,
      };
      const commentIndex = state.findIndex((item) => item.id === comment.reply);
      if (commentIndex !== -1) {
        state[commentIndex].listReply.push(reply);
      }
      return state;
    },

    UpdateComments: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
        return state;
      }
    },
    PutComments: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
      return state;
    },

    DeleteComments: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
        return state;
      }
    },
    SetComments: (state, action) => {
      state = action.payload;
      return state;
    },
    FindByIdComments: (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        return state[index];
      }
    },
  },
});

export const GetComments = (state) => state.comments;
export const {
  AddComments,
  AddReply,
  UpdateComments,
  DeleteComments,
  SetComments,
  PutComments,
  FindByIdComments,
} = CommentsSlice.actions;
export default CommentsSlice.reducer;
