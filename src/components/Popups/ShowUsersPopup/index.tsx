import {useAppSelector} from "../../../hooks/useAppSelector"
import {useEffect, useState} from "react"
import {collection, getDocs, getFirestore, orderBy, query} from "firebase/firestore"
import {useActions} from "../../../hooks/useActions"
import UserService from "../../../services/user-service"
import {IUser} from "../../../types/user"
import UserItem from "../../UserItem"

import './style.scss'

const ShowUsersPopup = () => {
    const db = getFirestore()
    const data = useAppSelector(state => state.popups.ShowUsersPopup.data)
    const me = useAppSelector(state => state.user.me)
    const [users, setUsers] = useState<IUser[]>([])
    const {setPopup} = useActions()

    const fetchUsers = () => {
        const collectionRef = collection(db, data.name === 'likes' ? `users/${data.uid}/media/${data.mediaId}/likes` : `users/${data.uid}/${data.name}`)
        const q = query(collectionRef, orderBy('createdAt', 'desc'))
        getDocs(q)
            .then(data => data.docs.map(doc => ({uid: doc.id, ...doc.data()})))
            .then(data => {
                data.forEach(({uid}) => {
                    UserService.getUser(uid)
                        .then(user => {
                            setUsers(users => [...users, user] as IUser[])
                        })
                })
            })
    }

    useEffect(() => {
        if (!data?.uid || !data?.name) return

        fetchUsers()

        return () => {
            setPopup({name: 'ShowUsersPopup', type: false, data: null})
            setUsers([])
        }

    }, [data?.name, data?.uid])

    return (
        <div className="show-users-popup">
            <div className="show-users-popup__container">
                {(!users?.length) && (
                    <div className="show-users-popup__no-users">
                        {data?.name === 'subscribers' && 'Подписчики отсутствуют'}
                        {data?.name === 'subscriptions' && 'Подписки отсутствуют'}
                        {data?.name === 'likes' && 'Лайки отсутствуют'}
                    </div>
                )}
                {users?.map(({uid}) => <UserItem key={uid} uid={uid}/>)}
            </div>
        </div>
    )
}

export default ShowUsersPopup