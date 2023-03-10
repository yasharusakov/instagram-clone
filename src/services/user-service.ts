import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc
} from "firebase/firestore"
import {
    IMedia,
    ISubscribers,
    ISubscribersPayloadAction,
    ISubscriptions,
    ISubscriptionsPayloadAction,
    IUser,
    IUserPayloadAction
} from "../types/user"

class UserService {

    fetchUserInRealTime(uid: string, name: 'me' | 'anotherUser', setUser: { (data: IUserPayloadAction): void }, setSubscribers: { (data: ISubscribersPayloadAction): void }, setSubscriptions: { (data: ISubscriptionsPayloadAction): void }) {
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

    async getUser(uid: string) {
        const db = getFirestore()
        try {
            const docRef = doc(db, `users/${uid}`)
            const user = await getDoc(docRef)
            return user.data() as IUser
        } catch (err) {
            console.log(err)
        }
    }

    async getSubscriber(meUid: string, uid: string) {
        const db = getFirestore()
        try {
            const docRef = doc(db, `users/${meUid}/subscribers/${uid}`)
            const user = await getDoc(docRef)
            return user.data() as IUser
        } catch (err) {
            console.log(err)
        }
    }

    async getUserMedia(uid: string, setData: { (data: IMedia[]): void }) {
        const db = getFirestore()
        try {
            const q = query(collection(db, 'users', uid, 'media'), orderBy('createdAt', 'desc'))

            return onSnapshot(q, (querySnapshot) => {
                setData(querySnapshot.docs.map<IMedia>(doc => ({id: doc.id, ...doc.data()} as IMedia)))
            })
        } catch (err) {
            console.log(err)
        }
    }

    async getUserUid(username: string) {
        const db = getFirestore()
        try {
            const docRef = doc(db, `usernames/${username}`)
            const docSnap = await getDoc(docRef)
            const docData = docSnap.data() as { uid: string }
            return docData.uid as string
        } catch (err) {
            console.log(err)
        }
    }

    async subscribeOnUser(uid: string, meUid: string) {
        const db = getFirestore()
        try {
            const payload = {createdAt: serverTimestamp()}
            await setDoc(doc(db, `users/${uid}/subscribers`, meUid), payload)
            await setDoc(doc(db, `users/${meUid}/subscriptions`, uid), payload)
        } catch (err) {
            console.log(err)
        }
    }

    async unsubscribeFromUser(uid: string, meUid: string) {
        const db = getFirestore()
        try {
            await deleteDoc(doc(db, `users/${uid}/subscribers`, meUid))
            await deleteDoc(doc(db, `users/${meUid}/subscriptions`, uid!))
        } catch (err) {
            console.log(err)
        }
    }

    listenSubscribe(uid: string, meUid: string, setSubscribe: (data: boolean) => void) {
        const db = getFirestore()
        try {
            const docRef = doc(db, `users/${uid}/subscribers/${meUid}`)
            const unsub = onSnapshot(docRef, (querySnapshot) => {
                if (querySnapshot.exists()) {
                    setSubscribe(true)
                } else {
                    setSubscribe(false)
                }
            })
            return unsub
        } catch (err) {
            console.log(err)
        }
    }
}

export default new UserService()