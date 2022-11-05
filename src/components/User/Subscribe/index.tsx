import {FC, memo, useEffect, useState} from "react"
import {subscribeOnUser, unsubscribeFromUser} from "../../../utils/userFunctions"
import {doc, getFirestore, onSnapshot} from "firebase/firestore"

import './style.scss'

interface SubscribeProps {
    uid: string | undefined
    meUid: string | undefined
}

const Subscribe: FC<SubscribeProps> = memo(({uid, meUid}) => {
    const db = getFirestore()
    const [subscribe, setSubscribe] = useState<boolean>(false)

    useEffect(() => {
        if (!uid || !meUid) return

        const docRef = doc(db, `users/${uid}/subscribers/${meUid}`)
        const unsub = onSnapshot(docRef, (querySnapshot) => {
            if (querySnapshot.exists()) {
                setSubscribe(true)
            } else {
                setSubscribe(false)
            }
        })

        return () => unsub()
    }, [uid, meUid])

    return (
        <div className="subscribe">
            {
                (subscribe && (uid !== meUid)) ? (
                    <button onClick={() => unsubscribeFromUser(uid!, meUid!)} className="subscribe__button subscribe__button_1">Подписки</button>
                ) : (
                    <button onClick={() => subscribeOnUser(uid!, meUid!)} className="subscribe__button subscribe__button_2">Подписаться</button>
                )
            }
        </div>
    )
})

export default Subscribe