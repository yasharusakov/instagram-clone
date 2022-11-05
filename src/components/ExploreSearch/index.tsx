import {useState, useTransition, useEffect, FC} from "react"
import {IUser} from "../../types/user"
import {collection, getFirestore, onSnapshot} from "firebase/firestore"
import {Link} from "react-router-dom"
import defaultAvatar from '../../resources/images/default-avatar.jpg'
import DefaultLoader from "../Loaders/DefaultLoader"

import './style.scss'

interface ExploreSearchProps {
    inputValue?: string
    header?: boolean
}

const ExploreSearch: FC<ExploreSearchProps> = ({inputValue, header}) => {
    const db = getFirestore()
    const [isPending, startTransition] = useTransition()
    const [value, setValue] = useState<string>('')
    const [allUsers, setAllUsers] = useState<IUser[]>([])
    const [users, setUsers] = useState<IUser[]>([])

    const getAllUsers = () => {
        const collectionRef = collection(db, 'users')
        return onSnapshot(collectionRef, (querySnapshot) => {
            setAllUsers(querySnapshot.docs.map(user => user.data()) as IUser[])
        })
    }

    const filterUsersByValue = (value: string): IUser[] => {
        const v = value?.toLowerCase()
        const equal = allUsers.filter(({username}) => username === v)
        const letters = allUsers.filter(({username}) => {
            if (v === username) return false
            if (v.split('').some(item => username.includes(item))) return true
        })

        return [...equal, ...letters].sort((a, b) => (b.username.includes(v) as any) - (a.username.includes(v) as any))
    }

    useEffect(() => {
        if (!value) setUsers([])
        startTransition(() => {
            setUsers(filterUsersByValue(value))
        })
        return () => {
            setUsers([])
        }
    }, [value])

    useEffect(() => {
        if (!inputValue) setUsers([])
        startTransition(() => {
            setUsers(filterUsersByValue(inputValue!))
        })
        return () => {
            setUsers([])
        }
    }, [inputValue])

    useEffect(() => {
        const unsub = getAllUsers()
        return () => unsub()
    }, [])

    return (
        <div className="explore-search">
            <div style={header ? {padding: 0}: {}} className="explore-search__container">
                <div className="explore-search__search-panel">
                    {isPending && <DefaultLoader/>}
                    {!header && (
                        <input
                            className="explore-search__search-panel__input"
                            value={value}
                            placeholder="Поиск"
                            onChange={(e) => setValue(e.target.value.toLowerCase().replace(/\s/g, ''))}
                            type="text"
                        />
                    )}
                </div>
                <div style={header ? {border: 0, height: '100%', marginTop: 0}: {}} className="explore-search__users">
                    {(!users.length) && (
                        <div className="explore-search__no-explore-search">
                            Введите имя пользователя
                        </div>
                    )}
                    {users.map(user => {
                        return (
                            <Link key={user.uid} to={`/${user.username}`} className="explore-search__user">
                                <div className="explore-search__user__avatar">
                                    <img src={user.avatar ? user.avatar : defaultAvatar} alt="Фото профиля"/>
                                </div>
                                <div className="explore-search__user__data">
                                    <div className="explore-search__user__data__username">{user.username}</div>
                                    {user.fullName && <div className="explore-search__user__data__full-name">{user.fullName}</div>}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ExploreSearch