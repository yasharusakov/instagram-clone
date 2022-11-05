import {useState, useEffect, memo} from "react"
import {onSnapshot, doc, getFirestore} from "firebase/firestore"
import {NavLink} from "react-router-dom"
import {IUser} from "../../types/user"
import defaultAvatar from '../../resources/images/default-avatar.jpg'

const DirectItem = memo(({meID, userID}: {meID: string | undefined, userID: string | undefined}) => {
    const db = getFirestore()
    const [user, setUser] = useState<IUser>()

    useEffect(() => {
        if (!meID && !userID) return

        const unsub = onSnapshot(doc(db, 'users', userID!), (doc) => {
            setUser(doc.data() as IUser)
        })

        return () => unsub()
    }, [meID, userID])

    const isActiveLink = ({isActive}: {isActive: boolean}) => isActive ? 'direct__data__users__user active': 'direct__data__users__user'

    return (
        <NavLink key={userID} to={`/direct/t/${userID}`} className={isActiveLink}>
            <div className="direct__data__users__user__user-avatar">
                <img src={user?.avatar ? user.avatar : defaultAvatar} alt="Фото профиля"/>
            </div>
            <div className="direct__data__users__user__additional">
                <div className="direct__data__users__user__additional__username">{user?.username}</div>
            </div>
        </NavLink>
    )
})

export default DirectItem