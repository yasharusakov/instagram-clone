import {configureStore} from "@reduxjs/toolkit"
import userSlice from "../slices/userSlice"
import popupsSlice from "../slices/popupsSlice"

const store = configureStore({
	reducer: {user: userSlice, popups: popupsSlice},
	middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
	devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export { store }