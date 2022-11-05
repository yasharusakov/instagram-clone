import {serverTimestamp, Timestamp} from "firebase/firestore"

export interface IUser {
	email: string
	username: string
	password: string
	fullName: string
	avatar: string
	biography: string
	link: string
	uid: string
	createdAt: Timestamp | null,
	subscribers?: ISubscribers
	subscriptions?: ISubscriptions
	stories?: []
}

export interface ISubscribers extends Array<string>{}

export interface ISubscriptions extends Array<string>{}

export interface IUserState {
	me: IUser
	anotherUser: IUser
}

export interface IUserPayloadAction {
	data: IUser
	name: 'me' | 'anotherUser'
}

export interface ISubscribersPayloadAction {
	data: ISubscribers
	name: 'me' | 'anotherUser'
}

export interface ISubscriptionsPayloadAction {
	data: ISubscriptions
	name: 'me' | 'anotherUser'
}

export type UserParams = {
	username: string
}

export interface IMedia {
	uid: string
	id: string
	createdAt: Timestamp | null
	signature: string
	url: string
}

export interface IComment {
	uid: string
	id: string
	createdAt: Timestamp | null
	value: string
}

export interface IStory {
	uid: string
	id: string
	url: string
	createdAt: Timestamp | null
}

export type EditProfileParams = {
	activeButton: 'edit' | 'password_change' | 'manage_access' | 'emails_settings' |
		'push_web_settings' | 'contact_history' | 'privacy_and_security' |
		'login_activity' | 'emails_sent' | 'help'
}