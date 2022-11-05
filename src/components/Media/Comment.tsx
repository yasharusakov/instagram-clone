import {FC, memo, useEffect, useState} from "react"
import {IComment, IUser} from "../../types/user"
import {doc, getFirestore, onSnapshot} from "firebase/firestore"
import {Link} from 'react-router-dom'
import {useActions} from "../../hooks/useActions"
import moment from "moment"
import defaultAvatar from '../../resources/images/default-avatar.jpg'

const Comment: FC<IComment> = memo(({id, uid, value, createdAt}) => {
    const db = getFirestore()
    const [user, setUser] = useState<IUser>()
    const {setPopup} = useActions()

    useEffect(() => {
        if (!uid) return
        const docRef = doc(db, `users/${uid}`)
        const unsub = onSnapshot(docRef, (querySnapshot) => {
            setUser(querySnapshot.data() as IUser)
        })

        return () => {
            unsub()
        }
    }, [uid])

    const closePopup = () => {
        setPopup({name: 'CommentsPopup', type: false, data: null})
    }

    return (
        <div className="media__comment">
            <div className="media__comment__container">
                <Link onClick={closePopup} to={`/${user?.username}`} className="media__comment__user-avatar">
                    <img src={user?.avatar ? user.avatar : defaultAvatar} alt="Фото профиля"/>
                </Link>
                <div className="media__comment__row">
                    <div className="media__comment__data">
                        <Link onClick={closePopup} to={`/${user?.username}`} className="media__comment__username">
                            {user?.username}
                        </Link>
                        <span className="media__comment__value">
                            {value}
                        </span>
                    </div>
                    <div className="media__comment__additional">
                        <div className="media__control-panel__date-of-public">
                            {createdAt && moment(+createdAt!.seconds * 1000).fromNow()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Comment