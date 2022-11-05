import {ChangeEvent, FormEvent, useState} from "react"
import {Link} from "react-router-dom"
import {doc, getFirestore, serverTimestamp, setDoc} from "firebase/firestore"
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth"
import DefaultLoader from '../Loaders/DefaultLoader'
import instagram from "../../resources/images/instagram.png"
import appstore from "../../resources/images/app-store.png"
import googleplay from "../../resources/images/google-play.png"

import '../../styles/notLoggedIn.scss'

const Register = () => {
    const db = getFirestore()
    const auth = getAuth()

    const [loading, setLoading] = useState<boolean>(false)

    const [email, setEmail] = useState<string>('')
    const [fullName, setFullName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const signUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                setDoc(doc(db, 'usernames', username), {
                    uid: auth.currentUser?.uid
                }).then(() => {
                    setDoc(doc(db, 'users', auth.currentUser?.uid!), {
                        email: email,
                        username: username,
                        fullName: fullName,
                        password: password,
                        uid: auth.currentUser?.uid,
                        avatar: '',
                        biography: '',
                        link: '',
                        createdAt: serverTimestamp()
                    })
                }).then(() => {
                    setDoc(doc(db, 'users', auth.currentUser?.uid!, 'subscribers', ''), {})
                    setDoc(doc(db, 'users', auth.currentUser?.uid!, 'subscriptions', ''), {})
                })
            })
            .catch(() => {
                setLoading(false)
            })

        setEmail('')
        setFullName('')
        setUsername('')
        setPassword('')
        setLoading(false)
    }

    return (
        <div className="not-logged-in">
            <div className="not-logged-in__container">
                <div className="not-logged-in__item not-logged__item_1">
                    <div className="not-logged-in__icon">
                        <img src={instagram} alt="instagram"/>
                    </div>
                    <div className="not-logged-in__regText">Зарегистрируйтесь, чтобы смотреть фото и видео ваших друзей.</div>
                    <form onSubmit={signUp} className="not-logged-in__form">
                        <div className="not-logged-in__inputs">
                            <input onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} value={email} type="email" placeholder="Эл. адрес" autoComplete="off" required className="not-logged-in__input"/>
                            <input onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} value={fullName} type="text" placeholder="Имя и фамилия" autoComplete="off" required className="not-logged-in__input"/>
                            <input onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value.replace(/\W/g, '').toLowerCase())} value={username} type="text" placeholder="Имя пользователя" autoComplete="off" required className="not-logged-in__input"/>
                            <input onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} type="password" placeholder="Пароль" minLength={6} autoComplete="off" required className="not-logged-in__input"/>
                        </div>
                        <button disabled={!(email && fullName && username && password)} type="submit" className="not-logged-in__submit">{loading ? <DefaultLoader/> : 'Регистрация'}</button>
                    </form>
                </div>
                <div className="not-logged-in__item not-logged-in__item_2">
                    <div className="not-logged-in__redirect">
                        <div className="not-logged-in__redirect__row">
                            <div className="not-logged-in__redirect__text">Есть аккаунт?</div>
                            <div className="not-logged-in__redirect-to">
                                <Link aria-disabled={loading} to='/'>Вход</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="not-logged-in__install-app">
                    <div className="not-logged-in__install-title">Установите приложение.</div>
                    <div className="not-logged-in__apps">
                        <div className="not-logged-in__app">
                            <img src={appstore} alt="app store"/>
                        </div>
                        <div className="not-logged-in__app">
                            <img src={googleplay} alt="google play"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register