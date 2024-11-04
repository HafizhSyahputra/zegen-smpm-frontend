import { configureStore } from "@reduxjs/toolkit"
import appSlice from "./appSlice"
import authSlice from "./authSlice"

export const store = configureStore({
	reducer: {
		auth: authSlice,
		app: appSlice,
	},
	devTools: import.meta.env.VITE_NODE_ENV !== "production",
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
