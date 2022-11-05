import {collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc} from "firebase/firestore"
import {
    IMedia,
    ISubscribers,
    ISubscribersPayloadAction,
    ISubscriptions,
    ISubscriptionsPayloadAction,
    IUser,
    IUserPayloadAction
} from "../types/user"

export const fetchUserInRealTime = (uid: string, name: 'me' | 'anotherUser', setUser: {(data: IUserPayloadAction): void}, setSubscribers: {(data: ISubscribersPayloadAction): void}, setSubscriptions: {(data: ISubscriptionsPayloadAction): void}) => {
    const db = getFirestore()
    const unsubscribeFromUser = onSnapshot(doc(db, 'users', uid), (doc) => {
        setUser({data: doc.data() as IUser, name: name})
    })
    const unsubscribeFromSubscribers = onSnapshot(collection(db, 'users', uid, 'subscribers'), (querySnapshot) => {
        setSubscribers({data: querySnapshot.docs.map(doc => doc.id) as ISubscribers, name: name})
    })
    const unsubscribeFromSubscriptions = onSnapshot(collection(db, 'users', uid, 'subscriptions'), (querySnapshot) => {
        setSubscriptions({data: querySnapshot.docs.map(doc => doc.id) as ISubscriptions, name: name})
    })

    return [unsubscribeFromUser, unsubscribeFromSubscribers, unsubscribeFromSubscriptions]
}

export const fetchUser = (uid: string, setData: {(data: IUser): void}) => {
    const db = getFirestore()
    const docRef = doc(db, `users/${uid}`)
    getDoc(docRef)
        .then(user => setData(user.data() as IUser))
}

export const fetchMedia = (uid: string, setData: {(data: IMedia[]): void}) => {
    const db = getFirestore()
    const q = query(collection(db, 'users', uid, 'media'), orderBy('createdAt', 'desc'))

    return onSnapshot(q, (querySnapshot) => {
        setData(querySnapshot.docs.map<IMedia>(doc => ({id: doc.id, ...doc.data()} as IMedia)))
    })
}

export const getUserUid = async (username: string, setData: {(uid: string): void}) => {
    const db = getFirestore()
    const docRef = doc(db, `usernames/${username}`)
    const docSnap = await getDoc(docRef)
    const docData = docSnap.data() as {uid: string}
    setData(docData.uid)
}

export const subscribeOnUser = async (uid: string, meUid: string) => {
    const db = getFirestore()
    const payload = {createdAt: serverTimestamp()}
    await setDoc(doc(db, `users/${uid}/subscribers`, meUid), payload)
    await setDoc(doc(db, `users/${meUid}/subscriptions`, uid), payload)
}

export const unsubscribeFromUser = async (uid: string, meUid: string) => {
    const db = getFirestore()
    await deleteDoc(doc(db, `users/${uid}/subscribers`, meUid))
    await deleteDoc(doc(db, `users/${meUid}/subscriptions`, uid!))
}