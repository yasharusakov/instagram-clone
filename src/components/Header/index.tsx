import {useEffect, useState} from "react"
import {useAppSelector} from "../../hooks/useAppSelector"
import {Link, useLocation} from "react-router-dom"
import DropDownList from "./DropDownListLayout"
import defaultAvatar from "../../resources/images/default-avatar.jpg"
import instagram from '../../resources/images/instagram.png'
import {useActions} from "../../hooks/useActions"
import {getAuth} from 'firebase/auth'
import {collection, getDocs, getFirestore, onSnapshot, doc, updateDoc} from "firebase/firestore"

import './style.scss'

const Header = () => {
    const auth = getAuth()
    const db = getFirestore()
    const {pathname} = useLocation()
    const {setPopup} = useActions()

    const {avatar, username, uid} = useAppSelector(state => state.user.me)
    const UploadMedia = useAppSelector(state => state.popups.UploadMedia.type)

    const [searchPanel, setSearchPanel] = useState<boolean>(false)
    const [activity, setActivity] = useState<boolean>(false)
    const [user, setUser] = useState<boolean>(false)

    const [value, setValue] = useState<string>('')

    const [dataActivity, setDataActivity] = useState<boolean>(false)

    const turnOffVisibility = (e: MouseEvent) => {
        const target = e.target as Element
        if (
            !target.closest('.drop-down-list-target-button') &&
            !target.closest('.drop-down-list') &&
            !target.closest('.drop-down-list-layout')
        ) {
            setActivity(false)
            setSearchPanel(false)
            setUser(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mouseup', turnOffVisibility)
        return () => document.removeEventListener('mouseup', turnOffVisibility)
    }, [])

    const fetchActivity = () => {
        const collectionRef = collection(db, `users/${uid}/subscribers`)
        return onSnapshot(collectionRef, (querySnapshot) => {
           if (!querySnapshot.empty) {
               const array = querySnapshot.docs.map(item => item.data().watched)
               if (array.includes(undefined)) {
                   setDataActivity(true)
               } else {
                   setDataActivity(false)
               }

           } else {
               setDataActivity(false)
           }
        })
    }

    useEffect(() => {
        if (!uid) return
        const unsub = fetchActivity()
        return () => unsub()
    }, [uid])

    const whenActivityIsTrue = async () => {
        const collectionRef = collection(db, `users/${uid}/subscribers`)
        const docsSnapshot = await getDocs(collectionRef)
        docsSnapshot.docs.forEach(item => {
            const docRef = doc(db, `users/${uid}/subscribers/${item.id}`)
            updateDoc(docRef, {
                watched: true
            })
        })
    }

    useEffect(() => {
        if (!activity || !dataActivity) return
        whenActivityIsTrue()
    }, [activity, dataActivity])

    useEffect(() => {
        if (!pathname.includes('/accounts/activity') || !dataActivity) return
        whenActivityIsTrue()
    }, [pathname, dataActivity])

    return (
        <header className="header">
            <div className="header__container">
                <Link className="header__icon" to="/">
                    <img src={instagram} alt="instagram"/>
                </Link>
                <div className="header__search-panel">
                    <input
                        onClick={() => {
                            setActivity(false)
                            setUser(false)
                            setSearchPanel(searchPanel => !searchPanel)
                        }}
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        className="drop-down-list-target-button"
                        placeholder="Поиск"
                        type="text"
                    />
                    <DropDownList
                        name="search-panel"
                        visibility={searchPanel}
                        value={value}
                    />
                </div>
                {
                    auth.currentUser ? (
                        <ul className="header__links-list">
                            <li className="header__links-list__link-main">
                                <Link to="/">
                                    <svg aria-label="Главная страница" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                        {
                                            (pathname === '/' && !UploadMedia && !user && !activity) ? (
                                                <path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z"></path>
                                            ) : (
                                                <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                                            )
                                        }
                                    </svg>
                                </Link>
                            </li>
                            <li className="header__links-list__link-direct">
                                <Link to="/direct/inbox">
                                    <svg aria-label="Messenger" color="#262626" fill="#262626" height="24" role="img"
                                         viewBox="0 0 24 24" width="24">
                                        {
                                            (pathname.includes('/direct') && !UploadMedia && !user && !activity) ? (
                                                <path d="M12.003 1.131a10.487 10.487 0 00-10.87 10.57 10.194 10.194 0 003.412 7.771l.054 1.78a1.67 1.67 0 002.342 1.476l1.935-.872a11.767 11.767 0 003.127.416 10.488 10.488 0 0010.87-10.57 10.487 10.487 0 00-10.87-10.57zm5.786 9.001l-2.566 3.983a1.577 1.577 0 01-2.278.42l-2.452-1.84a.63.63 0 00-.759.002l-2.556 2.049a.659.659 0 01-.96-.874L8.783 9.89a1.576 1.576 0 012.277-.42l2.453 1.84a.63.63 0 00.758-.003l2.556-2.05a.659.659 0 01.961.874z"></path>
                                            ) : (
                                                <>
                                                    <path d="M12.003 2.001a9.705 9.705 0 110 19.4 10.876 10.876 0 01-2.895-.384.798.798 0 00-.533.04l-1.984.876a.801.801 0 01-1.123-.708l-.054-1.78a.806.806 0 00-.27-.569 9.49 9.49 0 01-3.14-7.175 9.65 9.65 0 0110-9.7z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"></path>
                                                    <path d="M17.79 10.132a.659.659 0 00-.962-.873l-2.556 2.05a.63.63 0 01-.758.002L11.06 9.47a1.576 1.576 0 00-2.277.42l-2.567 3.98a.659.659 0 00.961.875l2.556-2.049a.63.63 0 01.759-.002l2.452 1.84a1.576 1.576 0 002.278-.42z" fillRule="evenodd"></path>
                                                </>
                                            )
                                        }
                                    </svg>
                                </Link>
                            </li>
                            <li className="header__links-list__link-upload-media">
                                <button onClick={() => setPopup({name: 'UploadMedia', type: true})}>
                                    <svg aria-label="Новая публикация" color="#262626" fill="#262626" height="24" role="img"
                                         viewBox="0 0 24 24" width="24">
                                        {
                                            UploadMedia ? (
                                                <path d="M12.003 5.545l-.117.006-.112.02a1 1 0 00-.764.857l-.007.117V11H6.544l-.116.007a1 1 0 00-.877.876L5.545 12l.007.117a1 1 0 00.877.876l.116.007h4.457l.001 4.454.007.116a1 1 0 00.876.877l.117.007.117-.007a1 1 0 00.876-.877l.007-.116V13h4.452l.116-.007a1 1 0 00.877-.876l.007-.117-.007-.117a1 1 0 00-.877-.876L17.455 11h-4.453l.001-4.455-.007-.117a1 1 0 00-.876-.877zM8.552.999h6.896c2.754 0 4.285.579 5.664 1.912 1.255 1.297 1.838 2.758 1.885 5.302L23 8.55v6.898c0 2.755-.578 4.286-1.912 5.664-1.298 1.255-2.759 1.838-5.302 1.885l-.338.003H8.552c-2.754 0-4.285-.579-5.664-1.912-1.255-1.297-1.839-2.758-1.885-5.302L1 15.45V8.551c0-2.754.579-4.286 1.912-5.664C4.21 1.633 5.67 1.05 8.214 1.002L8.552 1z"></path>
                                            ) : (
                                                <>
                                                    <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
                                                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
                                                </>
                                            )
                                        }
                                    </svg>
                                </button>
                            </li>
                            <li className="header__links-list__link-activity">
                                <button
                                    onClick={() => {
                                        setUser(false)
                                        setSearchPanel(false)
                                        setActivity(searchPanel => !searchPanel)
                                    }}
                                    className="drop-down-list-target-button"
                                >
                                    <svg
                                        aria-label="Что нового"
                                        color="#262626"
                                        fill="#262626"
                                        height="24"
                                        role="img"
                                        viewBox={activity ? "0 0 48 48" : '0 0 24 24'} width="24">
                                        {activity ? <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path> : <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>}
                                    </svg>
                                    {dataActivity && <div className="data-activity"></div>}
                                </button>
                                <DropDownList
                                    name="activity"
                                    visibility={activity}
                                />
                            </li>
                            <li className="header__links-list__link-user">
                                <button
                                    onClick={() => {
                                        setActivity(false)
                                        setSearchPanel(false)
                                        setUser(user => !user)
                                    }}
                                    style={((pathname === `/${username}` && !UploadMedia && !activity) || user) ? {filter: 'drop-shadow(0 0 3px black)'} : {filter: ''}}
                                    className="drop-down-list-target-button">
                                    <img src={avatar ? avatar : defaultAvatar} alt="Фото профиля"/>
                                </button>
                                <DropDownList
                                    name="user"
                                    visibility={user}
                                />
                            </li>
                        </ul>
                    ) : (
                        <ul className="header__links-list">
                            <li>
                                <Link className="header__link__redirect-to-login" to="/">
                                    Войти
                                </Link>
                            </li>
                            <li>
                                <Link className="header__link__redirect-to-register" to="/accounts/register">
                                    Зарегистрироваться
                                </Link>
                            </li>
                        </ul>
                    )
                }
            </div>
            <div className="header__bottom">
                {
                    auth.currentUser && (
                        <ul className="header__links-list header__links-list_2">
                            <li>
                                <Link to="/">
                                    <svg aria-label="Главная страница" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                        {
                                            (pathname === '/' && !UploadMedia && !user && !activity) ? (
                                                <path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z"></path>
                                            ) : (
                                                <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                                            )
                                        }
                                    </svg>
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore/search">
                                    {(pathname.includes('explore/search')) && !UploadMedia ? (
                                        <svg aria-label="Поиск и интересное" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 48 48" width="24">
                                            <path d="M47.6 44 35.8 32.2C38.4 28.9 40 24.6 40 20 40 9 31 0 20 0S0 9 0 20s9 20 20 20c4.6 0 8.9-1.6 12.2-4.2L44 47.6c.6.6 1.5.6 2.1 0l1.4-1.4c.6-.6.6-1.6.1-2.2zM20 35c-8.3 0-15-6.7-15-15S11.7 5 20 5s15 6.7 15 15-6.7 15-15 15z"></path>
                                        </svg>
                                    ) : (
                                        <svg aria-label="Поиск и интересное" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                            <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
                                        </svg>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link to="/accounts/activity">
                                    <svg aria-label="Что нового" color="#262626" fill="#262626" height="24" role="img" viewBox={(pathname.includes('activity')) && !UploadMedia  ? "0 0 48 48" : '0 0 24 24'} width="24">
                                        {
                                            (pathname.includes('activity')) && !UploadMedia ? (
                                                <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                                            ) : (
                                                <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
                                            )
                                        }
                                    </svg>
                                    {dataActivity && <div className="data-activity"></div>}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/${username}`}
                                    style={((pathname === `/${username}` && !UploadMedia && !activity) || user) ? {filter: 'drop-shadow(0 0 3px black)'} : {filter: ''}}
                                    className="drop-down-list-target-button">
                                    <img src={avatar ? avatar : defaultAvatar} alt="Фото профиля"/>
                                </Link>
                            </li>
                        </ul>
                    )
                }
            </div>
        </header>
    )
}

export default Header