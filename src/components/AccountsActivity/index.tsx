import {useAppSelector} from "../../hooks/useAppSelector"
import {useEffect, useState} from "react"
import {getFirestore, doc, getDoc, collection, getDocs} from "firebase/firestore"
import UserItem from "../UserItem"

import './style.scss'

const AccountsActivity = () => {
    const db = getFirestore()
    const me = useAppSelector(state => state.user.me)
    const [data, setData] = useState<any[]>([])
    const [subscribers, setSubscribers] = useState<any[]>([])

    const removeDuplicates = (arr: any[]) => {
        const obj: {[key: string]: string} = {}
        arr.forEach((item) => {
            if (obj[item.uid]) return
            obj[item.uid] = item
        })
        return Object.values(obj)
    }

    const fetchData = () => {
        me.subscribers?.forEach(async uid => {
            const docRef = doc(db, `users/${me.uid}/subscribers/${uid}`)
            const docSnap = await getDoc(docRef)
            const docData = {...docSnap.data(), uid: docSnap.id}
            setData(data => removeDuplicates([...data, docData]))
        })
    }

    const fetchUsers = () => {
        const filteredData = data.sort((a, b) => (new Date(+b.createdAt!.seconds * 1000) as any) - (new Date(+a.createdAt!.seconds * 1000) as any))
        filteredData.forEach(async (item) => {
            const docRef = doc(db, `users/${item.uid}`)
            const docRef2 = collection(db, `users/${item.uid}/subscribers`)

            const docSnap = await getDoc(docRef)
            const docSnap2 = await getDocs(docRef2)

            const docData = {...docSnap.data(), subscribers: docSnap2.docs.map(item => item.id), subscribedAt: item.createdAt}

            setSubscribers(subscribers => removeDuplicates([...subscribers, docData]))
        })
    }

    useEffect(() => {
        if (!data.length) return

        fetchUsers()
    }, [data.length])

    useEffect(() => {
        if (!me.subscribers?.length) {
            if (data.length || subscribers.length) {
                setData([])
                setSubscribers([])
            }
        }

        fetchData()
    }, [me.subscribers?.length])

    return (
        <div className="activity">
            <div className="activity__container">
                {!subscribers?.length && <div className="activity__no-activity">В данный момент нету активности</div>}
                {subscribers?.map(item => <UserItem key={item.uid} uid={item.uid} showDate={true}/>)}
            </div>
        </div>
    )
}

export default AccountsActivity