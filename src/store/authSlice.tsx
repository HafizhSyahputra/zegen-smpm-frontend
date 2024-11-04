import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

interface AuthState {
	isLogin: boolean
	nekotssecca: string | null
	nekothserfer: string | null
}

// Define the initial state using that type
const initialState: AuthState = {
	isLogin:
		localStorage.getItem("nekotssecca") && localStorage.getItem("nekothserfer")
			? true
			: false,
	nekotssecca: localStorage.getItem("nekotssecca") ?? null,
	nekothserfer: localStorage.getItem("nekothserfer") ?? null,
}

export const authSlice = createSlice({
	name: "auth",
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		signInReducer: (
			state,
			action: PayloadAction<{
				token: string
				refresh_token: string
			}>
		) => {
			state.isLogin = true
			const nekot = action.payload.token ?? initialState.nekotssecca
			const nekothserfer =
				action.payload.refresh_token ?? initialState.nekothserfer
			state.nekotssecca = nekot
			state.nekothserfer = nekothserfer
			localStorage.setItem("nekotssecca", nekot)
			localStorage.setItem("nekothserfer", nekothserfer)
		},
		signOutReducer: (state) => {
			state.isLogin = false
			state.nekotssecca = null
			state.nekothserfer = null
			localStorage.removeItem("nekotssecca")
			localStorage.removeItem("nekothserfer")
		},
	},
})

export const { signInReducer, signOutReducer } = authSlice.actions

// getter
export const authGetter = (state: RootState) => state.auth

export default authSlice.reducer
