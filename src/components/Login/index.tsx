import {ChangeEvent, FormEvent, useState} from 'react'
import {Link} from "react-router-dom"
import {signInWithEmailAndPassword, getAuth} from "firebase/auth"
import DefaultLoader from "../Loaders/DefaultLoader"
import instagram from "../../resources/images/instagram.png"
import appstore from "../../resources/images/app-store.png"
import googleplay from "../../resources/images/google-play.png"

import '../../styles/notLoggedIn.scss'

const Login = () => {
    const auth = getAuth()

    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const signIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        await signInWithEmailAndPassword(auth, email, password)
            .catch(() => {
                setLoading(false)
            })

        setEmail('')
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
                    <form onSubmit={signIn} className="not-logged-in__form">
                        <div className="not-logged__inputs">
                            <input onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} value={email} type="email" autoComplete="off" placeholder="Эл. адрес" required className="not-logged-in__input"/>
                            <input onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} type="password" minLength={6} autoComplete="off" placeholder="Пароль" required className="not-logged-in__input"/>
                        </div>
                        <button disabled={!(email && password)} type="submit" className="not-logged-in__submit">{loading ? <DefaultLoader/> : 'Войти'}</button>
                    </form>
                </div>
                <div className="not-logged-in__item not-logged-in__item_2">
                    <div className="not-logged-in__redirect">
                        <div className="not-logged-in__redirect__row">
                            <div className="not-logged-in__redirect__text">У вас ещё нет аккаунта?</div>
                            <div className="not-logged-in__redirect-to">
                                <Link to="/accounts/register">Зарегистрироваться</Link>
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

export default Login