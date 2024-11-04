import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface IErrorValidationMessage {
  [key: string]: string[] | any;
}

interface IErrorValidation {
  [key: string]: IErrorValidationMessage | any;
}

// Define a type for the slice state
interface AppState {
  errorValidation?: IErrorValidation | any;
  sidebarCollapsed: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  errorValidation: {},
  sidebarCollapsed: false,
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setErrorValidation: (state, action: PayloadAction<IErrorValidation>) => {
      state.errorValidation = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setErrorValidation, toggleSidebarCollapsed } = appSlice.actions;

// getter
export const appGetter = (state: RootState) => state.app;

export default appSlice.reducer;
