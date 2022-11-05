import {useParams, useNavigate} from "react-router-dom"
import {useEffect, useState, FC} from "react"
import {IMedia, IUser} from "../../types/user"
import {doc, getFirestore, onSnapshot, deleteDoc, updateDoc} from "firebase/firestore"
import {getStorage, ref, deleteObject} from "firebase/storage"
import {Link} from 'react-router-dom'
import {useActions} from "../../hooks/useActions"
import {getAuth} from "firebase/auth"
import Comments from './Comments'
import Save from "./Save"
import AddAComment from "./AddAComment"
import Like from "./Like"
import defaultAvatar from '../../resources/images/default-avatar.jpg'
import Likes from "./Likes"
import moment from "moment"

import {getUserUid} from "../../utils/userFunctions"

import './style.scss'

type UserMediaParams = {
    username: string
    id: string
}

interface MediaProps {
    mediaData?: {uid: string, id: string}
}

const Media: FC<MediaProps> = ({mediaData}) => {
    const db = getFirestore()
    const auth = getAuth()
    const storage = getStorage()
    const {setPopup} = useActions()
    const navigate = useNavigate()
    const {username, id} = useParams<UserMediaParams>()
    const [uid, setUid] = useState<string>('')
    const [user, setUser] = useState<IUser>()
    const [media, setMedia] = useState<IMedia>()

    const mediaID = id ? id : mediaData?.id

    useEffect(() => {
        if (mediaData) {
            setUid(mediaData.uid)
            return
        }

        if (!username) return

        (async () => await getUserUid(username, setUid))()
    }, [username])

    const fetchUser = () => {
        const docRef = doc(db, `users/${uid}`)
        return onSnapshot(docRef, (querySnapshot) => {
            setUser(querySnapshot.data() as IUser)
        })
    }

    const fetchMedia = () => {
        const docRef = doc(db, `users/${uid}/media/${mediaID}`)

        return onSnapshot(docRef, (querySnapshot) => {
            setMedia(querySnapshot.data() as IMedia)
        })
    }

    const deleteMedia = async () => {
        const docRef = doc(db, `users/${uid}/media/${mediaID}`)
        const mediaRef = ref(storage, `users/${uid}/media/${mediaID}`)

        await deleteDoc(docRef)
            .then(() => deleteObject(mediaRef))
            .then(() => {
                setPopup({name: 'AdditionalMedia', type: false, data: null})
                navigate(`/${user?.username}`)
            })
    }

    const redirectToMedia = () => {
        navigate(`/${user?.username}/p/${mediaID}`)
        setPopup({name: 'AdditionalMedia', type: false, data: null})
    }

    const editSignature = async (signature: string) => {
        const docRef = doc(db, `users/${uid}/media/${mediaID}`)
        await updateDoc(docRef, {
            signature: signature
        })
    }

    useEffect(() => {
        if (!uid) return

        const unsubFromMedia = fetchMedia()
        const unsubFromUser = fetchUser()

        return () => {
            unsubFromMedia()
            unsubFromUser()
        }
    }, [uid])

    const callback = () => {
        setPopup({
                name: 'AdditionalMedia',
                type: true,
                data: {
                    amI: uid === auth?.currentUser!.uid,
                    deleteMedia: deleteMedia,
                    redirectToMedia: redirectToMedia,
                    editSignature: editSignature,
                    signatureValueDefault: media?.signature
                }
            }
        )
    }

    return (
        <div className={mediaData ? 'media mediaData' : 'media'}>
            <div className="media__container">
                <header className="media__header media__header_1">
                    <div className="media__header__container">
                        <div className="media__header__data">
                            <Link to={`/${user?.username}`} className="media__header__user-avatar">
                                <img src={user?.avatar ? user.avatar : defaultAvatar} alt="Фото профиля"/>
                            </Link>
                            <Link to={`/${user?.username}`} className="media__header__username">
                                {user?.username}
                            </Link>
                        </div>
                        <div onClick={callback} className="media__header__additional">
                            <svg aria-label="Дополнительно" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                <circle cx="12" cy="12" r="1.5"></circle>
                                <circle cx="6" cy="12" r="1.5"></circle>
                                <circle cx="18" cy="12" r="1.5"></circle>
                            </svg>
                        </div>
                    </div>
                </header>
                <main className="media__main">
                    <div className="media__media">
                        {
                            media?.url && (
                                media?.url.includes('.mp4') || media?.url.includes('.mkv') || media?.url.includes('.mov') || media?.url.includes('.MOV') ? (
                                    <video
                                        src={media.url}
                                        autoPlay={true}
                                        loop={true}
                                        controls
                                        preload="auto"
                                        playsInline
                                        muted
                                    />
                                ) : (
                                    <img
                                        src={media.url}
                                        alt="Фотография"
                                    />
                                )
                            )
                        }
                    </div>
                    <div style={mediaData ? {flex: '1 1 auto'} : {}} className="media__additional">
                        <header style={mediaData ? {display: 'none'} : {}} className="media__header media__header_2">
                            <div className="media__header__container">
                                <div className="media__header__data">
                                    <Link to={`/${user?.username}`} className="media__header__user-avatar">
                                        <img src={user?.avatar ? user.avatar : defaultAvatar} alt="Фото профиля"/>
                                    </Link>
                                    <Link to={`/${user?.username}`} className="media__header__username">
                                        {user?.username}
                                    </Link>
                                </div>
                                <div onClick={callback} className="media__header__additional">
                                    <svg aria-label="Дополнительно" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                        <circle cx="12" cy="12" r="1.5"></circle>
                                        <circle cx="6" cy="12" r="1.5"></circle>
                                        <circle cx="18" cy="12" r="1.5"></circle>
                                    </svg>
                                </div>
                            </div>
                        </header>
                        {!mediaData && (
                            <div className="media__comments">
                                <div className="media__comments__container">
                                    {media?.signature && (
                                        <div style={{marginTop: 0, marginBottom: 20}} className="media__comment">
                                            <div className="media__comment__container">
                                                <Link to={`/${user?.username}`} className="media__comment__user-avatar">
                                                    <img src={user?.avatar ? user.avatar : defaultAvatar} alt="Фото профиля"/>
                                                </Link>
                                                <div className="media__comment__row">
                                                    <div className="media__comment__data">
                                                        <Link to={`/${user?.username}`} className="media__comment__username">
                                                            {user?.username}
                                                        </Link>
                                                        <span className="media__comment__value">
                                                        {media?.signature}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <Comments UID={uid} mediaID={mediaID} />
                                </div>
                            </div>
                        )}
                        <div className="media__control-panel">
                            <div className="media__control-panel__container">
                                <div className="media__control-panel__media">
                                    <Like UID={uid} mediaID={mediaID}/>
                                    <svg onClick={() => setPopup({name: 'CommentsPopup', type: true, data: {UID: uid, mediaID: mediaID, user: user, signature: media?.signature}})} aria-label="Комментировать" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                        <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                                    </svg>
                                    <svg aria-label="Поделиться публикацией" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                                        <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                                    </svg>
                                </div>
                                <Save UID={uid} mediaID={mediaID}/>
                            </div>
                            <Likes UID={uid} mediaID={mediaID}/>
                            <div className="media__control-panel__date-of-public">{media?.createdAt && moment(+media!.createdAt!.seconds * 1000).fromNow()}</div>
                        </div>
                        {!mediaData && <AddAComment UID={uid} mediaID={mediaID}/>}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Media