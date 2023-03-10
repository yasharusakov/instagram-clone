import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {doc, getFirestore, serverTimestamp, setDoc} from "firebase/firestore"

class AuthService {
    async signIn(email: string, password: string) {
        try {
            const auth = getAuth()
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.log(err)
        }
    }

    async signUp(username: string, fullName: string, email: string, password: string) {
        try {
            const db = getFirestore()
            const auth = getAuth()
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async () => {
                    await Promise.all([
                        setDoc(doc(db, 'usernames', username), {
                            uid: auth.currentUser?.uid
                        }),
                        setDoc(doc(db, 'users', auth.currentUser?.uid!), {
                            email: email,
                            username: username,
                            fullName: fullName,
                            password: password,
                            uid: auth.currentUser?.uid,
                            avatar: '',
                            biography: '',
                            link: '',
                            createdAt: serverTimestamp()
                        }),
                        setDoc(doc(db, 'users', auth.currentUser?.uid!, 'subscribers', ''), {}),
                        setDoc(doc(db, 'users', auth.currentUser?.uid!, 'subscriptions', ''), {})
                    ])
                })
        } catch (err) {
            console.log(err)
        }
    }
}

export default new AuthService()