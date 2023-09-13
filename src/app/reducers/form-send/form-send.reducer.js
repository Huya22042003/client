import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const FormSendSlice = createSlice({
    name: "formSend",
    initialState,
    reducers: {
        AddFormSend: (state, action) => {
            state.unshift(action.payload);
            return state;
        },
        UpdateFormSend: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
                return state;
            }
        },
        PutFormSend: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state[index] = action.payload
            } else {
                state.push(action.payload);
            }
            return state;
        },
        
        DeleteFormSend: (state, action) => {
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
                return state;
            }
        },
        SetFormSend: (state, action) => {
            state = action.payload;
            return state;
        },
        FindByIdFormSend: (state, action) => { 
            const index = state.findIndex((el) => el.id === action.payload.id);
            if (index > -1) {
                return state[index]
            }
        }
    }
})

export const GetFormSend = (state) => state.formSend;
export const { AddFormSend, UpdateFormSend, DeleteFormSend, SetFormSend, PutFormSend, FindByIdFormSend } = FormSendSlice.actions;
export default FormSendSlice.reducer;
