import {useEffect, useState} from "react"
import {useAppSelector} from "../../hooks/useAppSelector"
import {Link, useParams} from "react-router-dom"
import {ChatParams, IDirect} from "../../types/direct"
import {onSnapshot, getFirestore, collection, setDoc, doc} from "firebase/firestore"
import Chat from "../Chat"
import DirectItem from "./DirectItem"
import { v4 as uuidv4 } from 'uuid'
import DirectNothing from "./DirectNothing"

import './style.scss'

const Direct = () => {
    const db = getFirestore()
    const me = useAppSelector(state => state.user.me)
    const {uid} = useParams<ChatParams>()
    const [direct, setDirect] = useState<IDirect>([])

    const createDirect = () => {

        const docSnap = doc(db, 'users', me.uid, 'direct', uid!)

        return onSnapshot(docSnap, async (querySnapshot) => {
            try {
                if (!querySnapshot.exists()) {
                    const chatID = uuidv4()
                    await setDoc(doc(db, 'users', me.uid!, 'direct', uid!), {
                        uid: uid
                    })
                    await setDoc(doc(db, 'users', uid!, 'direct', me.uid!), {
                        uid: me.uid!
                    })
                    await setDoc(doc(db, 'direct', `${me.uid!}${uid!}`), {
                        chatID: chatID
                    })
                    await setDoc(doc(db, 'direct', `${uid!}${me.uid!}`), {
                        chatID: chatID
                    })
                }
            } catch(err) {
                console.log(err)
            }
        })

    }

    const fetchDirect = () => {
        const collectionRef = collection(db, `users/${me.uid}/direct`)
        return onSnapshot(collectionRef, (querySnapshot) => {
            if (!querySnapshot.empty) {
                setDirect(querySnapshot.docs.map(doc => ({...doc.data()})) as IDirect)
            }
        })
    }

    useEffect(() => {
        if (!me.uid) return
        const unsub = fetchDirect()
        return () => unsub()
    }, [me.uid])

    useEffect(() => {
        if (!me.uid || !uid) return
        const unsub = createDirect()
        return () => unsub()
    }, [me.uid, uid])

    return (
        <div className="direct">
            <div className="direct__container">
                {
                    uid && window.innerWidth <= 750 ? (
                        <div className="direct__chat">
                            {(me.uid && uid) ? <Chat meID={me.uid} userID={uid}/> : <DirectNothing/>}
                        </div>
                    ) : (
                        <>
                            <div className="direct__data">
                                <header className="direct__data__header">
                                    <Link to={`/${me.username}`} className="direct__data__header__username">
                                        {me.username}
                                    </Link>
                                </header>
                                <main className="direct__data__users">
                                    {direct.map(({uid}) => <DirectItem key={uid} meID={me.uid} userID={uid}/>)}
                                </main>
                            </div>
                            <div className="direct__chat">
                                {(me.uid && uid) ? <Chat meID={me.uid} userID={uid}/> : <DirectNothing/>}
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Direct