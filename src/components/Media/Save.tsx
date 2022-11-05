import {FC, memo, useEffect, useState} from "react";
import {deleteDoc, doc, getFirestore, onSnapshot, serverTimestamp, setDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";

interface SaveProps {
    UID: string | undefined
    mediaID: string | undefined
}

const Save: FC<SaveProps> = memo(({UID, mediaID}) => {
    const db = getFirestore()
    const auth = getAuth()
    const [saved, setSaved] = useState<boolean>(false)

    const fetchSaved = () => {
        const docRef = doc(db, `users/${auth.currentUser?.uid}/saved/${mediaID}`)

        const unsub = onSnapshot(docRef, (querySnapshot) => {
            setSaved(querySnapshot.exists())
        })

        return unsub
    }

    const savePost = async () => {
        if (!mediaID || !auth.currentUser?.uid) return

        const docRef = doc(db, `users/${auth.currentUser?.uid}/saved/${mediaID}`)

        if (saved) {
            await deleteDoc(docRef)
        } else {
            await setDoc(docRef, {
                createdAt: serverTimestamp(),
                id: mediaID,
                uid: UID
            })
        }
    }

    useEffect(() => {
        if (!auth.currentUser?.uid || !mediaID) return
        const unsub = fetchSaved()
        return () => {
            unsub()
        }
    }, [auth.currentUser?.uid, mediaID])

    return (
        <div className="media__control-panel__save">
            {
                saved ? (
                    <svg onClick={savePost} aria-label="Удалить" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <path d="M20 22a.999.999 0 01-.687-.273L12 14.815l-7.313 6.912A1 1 0 013 21V3a1 1 0 011-1h16a1 1 0 011 1v18a1 1 0 01-1 1z"></path>
                    </svg>
                ) : (
                    <svg onClick={savePost} aria-label="Сохранить" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                    </svg>
                )
            }
        </div>
    )
})

export default Save