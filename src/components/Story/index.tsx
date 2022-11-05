import {FC, useEffect, useState} from "react"
import {collection, doc, getFirestore, onSnapshot, orderBy, query} from "firebase/firestore"
import {useAppSelector} from "../../hooks/useAppSelector"
import {useActions} from "../../hooks/useActions"
import {IUser} from "../../types/user"
import defaultAvatar from "../../resources/images/default-avatar.jpg"

import './style.scss'

interface StoryProps {
    uid: string
    options?: {username?: boolean, className?: boolean}
}

const Story: FC<StoryProps> = ({uid, options}) => {
    const db = getFirestore()
    const me = useAppSelector(state => state.user.me)
    const {setPopup} = useActions()
    const [user, setUser] = useState<IUser>()
    const [storiesId, setStoriesId] = useState<string[]>([])
    const [watched, setWatched] = useState<boolean>(false)

    const fetchUser = () => {
        const docRef = doc(db, `users/${uid}`)
        return onSnapshot(docRef, (querySnapshot) => {
            setUser(querySnapshot.data() as IUser)
        })
    }

    const checkStories = () => {
        const collectionRef = collection(db, `users/${uid}/stories`)
        const q = query(collectionRef, orderBy('createdAt'))

        return onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) {
                if (storiesId.length > 0) {
                    setStoriesId([])
                }
            } else {
                setStoriesId(querySnapshot.docs.map(item => item.data().id))
            }
        })
    }

    useEffect(() => {
        if (!uid) return

        const unsub = fetchUser()
        const unsub2 = checkStories()

        return () => {
            unsub()
            unsub2()
        }
    }, [uid])

    useEffect(() => {
        if (storiesId.length <= 0) return

        try {
            storiesId.forEach(id => {
                const docRef = doc(db, `users/${uid}/stories/${id}/watched/${me?.uid}`)

                onSnapshot(docRef, querySnapshot => {
                    if (querySnapshot.exists()) {
                        setWatched(true)
                    } else {
                        setWatched(false)
                    }
                })
            })
        } catch(err) {
            console.log(err)
        }

    }, [storiesId])

    return (
        <div className="story">
            <div className="story__container">
                <div style={storiesId.length ? {border: watched ? '1px solid grey' : '1px solid red'} : {}} className={options?.className ? "story__border user-page" : "story__border"}>
                    <div onClick={() => {
                        if (storiesId.length) {
                            setPopup({name: 'ShowUsersPopup', type: false, data: null})
                            setPopup({name: 'StoriesPopup', type: true, data: {user: user, openStories: true}})
                        } else {
                            if (user?.uid === me?.uid) {
                                setPopup({name: 'ShowUsersPopup', type: false, data: null})
                                setPopup({name: 'StoriesPopup', type: true, data: {user: user, openStories: false}})
                            }
                        }
                    }} className="story__picture">
                        <img src={user?.avatar ? user?.avatar : defaultAvatar} alt="Фото профиля" />
                        {(!storiesId.length && (user?.uid === me?.uid)) && (
                            <svg aria-label="Значок &quot; Плюс&quot;" color="#0095f6" fill="#0095f6" height="16" role="img" viewBox="0 0 24 24" width="16">
                                <path d="M12.001.504a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm5 12.5h-4v4a1 1 0 0 1-2 0v-4h-4a1 1 0 1 1 0-2h4v-4a1 1 0 1 1 2 0v4h4a1 1 0 0 1 0 2Z"></path>
                            </svg>
                        )}
                    </div>
                </div>
                {options?.username && (
                    <div className="story__username">
                        {uid === me?.uid ? "Ваша история" : user?.username}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Story