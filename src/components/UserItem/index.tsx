import {FC, useEffect, useState, memo} from "react"
import {useAppSelector} from "../../hooks/useAppSelector"
import {fetchUser} from "../../utils/userFunctions"
import {IUser} from "../../types/user"
import Story from "../Story"
import Subscribe from "../User/Subscribe"
import {Link} from "react-router-dom"
import {doc, getDoc, getFirestore} from "firebase/firestore"
import {useActions} from "../../hooks/useActions"
import moment from "moment"

import './style.scss'

interface UserItemProps {
    uid: string
    showDate?: boolean
}

const UserItem: FC<UserItemProps> = memo(({uid, showDate}) => {
    const db = getFirestore()
    const me = useAppSelector(state => state.user.me)
    const [user, setUser] = useState<IUser>()
    const [createdAt, setCreatedAt] = useState<any>()
    const {setPopup} = useActions()

    useEffect(() => {
        if (!uid) return
        fetchUser(uid, setUser)
    }, [uid])

    useEffect(() => {
        if (!showDate || !uid) return

        const docRef = doc(db, `users/${me.uid}/subscribers/${uid}`)
        getDoc(docRef)
            .then(data => {
                setCreatedAt(data.data()!.createdAt)
            })

    }, [showDate, uid])

    return (
        <div className="user-item">
            <div className="user-item__container">
                <div className="user-item__story">
                    <Story options={{username: false}} uid={uid}/>
                </div>
                <Link onClick={() => setPopup({name: 'ShowUsersPopup', type: false, data: null})} to={`/${user?.username}`} className="user-item__additional">
                    <div className="user-item__username">{user?.username}</div>
                    {
                        (showDate && createdAt?.seconds) ? (
                            <div className="user-item__createdAt">
                                подписался(-ась) на ваши обновления {moment(createdAt!.seconds * 1000).fromNow()}
                            </div>
                        ) : (
                            <div className="user-item__fullname">{user?.fullName}</div>
                        )
                    }
                </Link>
                {
                    user?.uid !== me.uid && (
                        <div className="user-item__subscribe">
                            <Subscribe uid={uid} meUid={me.uid}/>
                        </div>
                    )
                }
            </div>
        </div>
    )
})

export default UserItem