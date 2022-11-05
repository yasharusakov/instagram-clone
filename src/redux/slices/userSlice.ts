import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit"
import {IUserState, IUserPayloadAction, ISubscribersPayloadAction, ISubscriptionsPayloadAction} from "../../types/user"

const initialState: IUserState = {
	me: {
		email: '',
		username: '',
		password: '',
		fullName: '',
		avatar: '',
		link: '',
		biography: '',
		uid: '',
		subscribers: [],
		subscriptions: [],
		createdAt: null
	},
	anotherUser: {
		email: '',
		username: '',
		password: '',
		fullName: '',
		avatar: '',
		link: '',
		biography: '',
		uid: '',
		subscribers: [],
		subscriptions: [],
		createdAt: null
	}
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state: Draft<IUserState>, action: PayloadAction<IUserPayloadAction>) {
			const name = action.payload.name
			const data = action.payload.data
			state[name].email = data.email
			state[name].username = data.username
			state[name].password = data.password
			state[name].fullName = data.fullName
			state[name].avatar = data.avatar
			state[name].biography = data.biography
			state[name].uid = data.uid
			state[name].link = data.link
		},
		setSubscribers(state: Draft<IUserState>, action: PayloadAction<ISubscribersPayloadAction>) {
			state[action.payload.name].subscribers = action.payload.data
		},
		setSubscriptions(state: Draft<IUserState>, action: PayloadAction<ISubscriptionsPayloadAction>) {
			state[action.payload.name].subscriptions = action.payload.data
		}
	}
})

export default userSlice.reducer

export const {
	setUser,
	setSubscribers,
	setSubscriptions
} = userSlice.actions