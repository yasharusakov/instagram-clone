import {FC, useEffect, useState, memo} from "react"
import {useAppSelector} from "../../hooks/useAppSelector"
import UserService from "../../services/user-service"
import {IUser} from "../../types/user"
import Story from "../Story"
import Subscribe from "../User/Subscribe"
import {Link} from "react-router-dom"
import {useActions} from "../../hooks/useActions"
import {Timestamp} from "firebase/firestore"
import moment from "moment"
import './style.scss'

interface UserItemProps {
    uid: string
    showDate?: boolean
}

const UserItem: FC<UserItemProps> = memo(({uid, showDate}) => {
    const me = useAppSelector(state => state.user.me)
    const [user, setUser] = useState<IUser>()
    const [createdAt, setCreatedAt] = useState<Timestamp | null>(null)
    const {setPopup} = useActions()

    useEffect(() => {
        if (!uid) return

        UserService.getUser(uid)
            .then(user => setUser(user))

    }, [uid])

    useEffect(() => {
        if (!showDate || !uid) return

        UserService.getSubscriber(me.uid, uid)
            .then(user => user && setCreatedAt(user.createdAt))

    }, [showDate, uid])

    return (
        <div className="user-item">
            <div className="user-item__container">
                <div className="user-item__story">
                    <Story options={{username: false}} uid={uid}/>
                </div>
                <Link
                    onClick={() => setPopup({name: 'ShowUsersPopup', type: false, data: null})}
                    to={`/${user?.username}`}
                    className="user-item__additional">
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