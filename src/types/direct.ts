import {Timestamp} from "firebase/firestore"

export type ChatParams = {
    uid: string
}

export interface IUserDirect {
    uid: string
}

export interface IDirect extends Array<IUserDirect>{}

export interface IMessage {
    id: string
    meId: string
    value: string
    createdAt: Timestamp | null
}