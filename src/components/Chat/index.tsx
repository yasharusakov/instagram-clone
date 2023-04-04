import {
    FC,
    FormEvent,
    memo,
    useEffect,
    useRef,
    useState,
    ChangeEvent,
} from 'react'
import {
    onSnapshot,
    doc,
    getFirestore,
    setDoc,
    query,
    collection,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore'
import {IUser} from '../../types/user'
import {Link} from 'react-router-dom'
import defaultAvatar from '../../resources/images/default-avatar.jpg'
import {IMessage} from '../../types/direct'
import {v4 as uuidv4} from 'uuid'

interface IChatProps {
    meID: string
    userID: string
}

const Chat: FC<IChatProps> = memo(({meID, userID}) => {
    const db = getFirestore()
    const [user, setUser] = useState<IUser>()
    const [message, setMessage] = useState<string>('')
    const [chatID, setChatID] = useState<string>('')
    const [messages, setMessages] = useState<IMessage[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const messagesRef = useRef<null | HTMLDivElement>(null)

    const getChatID = () => {
        const docRef = doc(db, 'direct', `${meID}${userID}`)

        return onSnapshot(docRef, (querySnapshot) => {
            try {
                if (querySnapshot.exists()) {
                    setChatID(querySnapshot.data().chatID)
                }
            } catch (err) {
                console.log(err)
            }
        })
    }

    useEffect(() => {
        if (!meID || !userID) return

        const unsub = getChatID()

        const unsub2 = onSnapshot(doc(db, `users/${userID}`), (doc) => {
            setUser(doc.data() as IUser)
        })

        return () => {
            unsub()
            unsub2()
        }
    }, [meID, userID])

    useEffect(() => {
        if (!chatID) return

        const q = query(
            collection(db, `chats/${chatID}/messages`),
            orderBy('createdAt')
        )
        const unsub = onSnapshot(q, (querySnapshot) => {
            setMessages(
                querySnapshot.docs.map(
                    (doc) => ({id: doc.id, ...doc.data()} as IMessage)
                )
            )
        })

        return () => unsub()
    }, [chatID])

    useEffect(() => {
        if (!messagesRef.current) return
        messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight)

        if (!messagesRef.current?.children.length) return
        messagesRef.current?.children[
            messagesRef.current?.children.length - 1
        ].classList.add('animation-to-bottom')
    }, [messages])

    useEffect(() => {
        const callback = () =>
            messagesRef.current?.scrollTo(0, messagesRef.current?.scrollHeight)
        window.addEventListener('resize', callback)
        return () => window.removeEventListener('resize', callback)
    }, [])

    const sendMessage = async () => {
        if (!chatID || !message) return

        const id = uuidv4()

        await setDoc(doc(db, `chats/${chatID}/messages`, id), {
            meId: meID,
            value: message,
            createdAt: serverTimestamp(),
        })

        setMessage('')
    }

    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        await sendMessage()
        setLoading(false)
    }

    return (
        <div className="direct__chat__main">
            <header className="direct__chat__main__header">
                <Link
                    to={`/${user?.username}`}
                    className="direct__chat__main__header__user-avatar"
                >
                    <img
                        src={user?.avatar ? user.avatar : defaultAvatar}
                        alt="Фото профиля"
                    />
                </Link>
                <Link
                    to={`/${user?.username}`}
                    className="direct__chat__main__header__username"
                >
                    {user?.username}
                </Link>
            </header>
            <form onSubmit={onSubmitHandler} className="direct__chat__form">
                <div ref={messagesRef} className="direct__chat__form__messages">
                    {messages.map(({id, meId, value}) => {
                        return (
                            <div
                                style={
                                    meId === meID
                                        ? {
                                              alignSelf: 'flex-end',
                                              background: '#0095F6',
                                              color: '#fff',
                                          }
                                        : {}
                                }
                                key={id}
                                className="direct__chat__form__message"
                            >
                                {value}
                            </div>
                        )
                    })}
                </div>
                <div className="direct__chat__form__send-message animation-to-top">
                    <div className="direct__chat__form__send-message__container">
                        <input
                            disabled={loading}
                            value={message}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setMessage(e.target.value)
                            }
                            placeholder="Напишите сообщение"
                        />
                        <button
                            disabled={loading || !message}
                            type="submit"
                            className="direct__chat__form__send-message__submit"
                        >
                            Отправить
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
})

export default Chat
