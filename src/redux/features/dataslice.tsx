import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentDataItems: [],
  loading: true,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    getCurrentItems: (state, action) => {
      state.currentDataItems = action.payload;
    },

    setIsLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});



export const { getCurrentItems, setIsLoading } = dataSlice.actions;

export default dataSlice.reducer;