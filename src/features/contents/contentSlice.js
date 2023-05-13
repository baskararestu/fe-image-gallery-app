import { createSlice } from "@reduxjs/toolkit";

export const contentSlice = createSlice({
  name: "content",
  initialState: {
    content: {
      id: "",
      caption: "",
      createAt: "",
      image: "",
    },
  },
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
    },
    resetContent: (state) => {
      state.content = {
        id: "",
        caption: "",
        createAt: "",
        image: "",
      };
    },
  },
});

export default contentSlice.reducer;
export const { setContent, resetContent } = contentSlice.actions;
