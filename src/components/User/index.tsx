import {useParams, Link} from "react-router-dom"
import {UserParams, IMedia} from "../../types/user"
import {useAppSelector} from "../../hooks/useAppSelector"
import {useEffect, useState} from "react"
import {useActions} from "../../hooks/useActions"
import UserService from "../../services/user-service"
import Story from "../Story"
import camera from '../../resources/images/camera.png'
import Subscribe from "./Subscribe"
import './style.scss'

const User = () => {
    const {setUser, setSubscribers, setSubscriptions, setPopup} = useActions()
    const {me, anotherUser} = useAppSelector(user => user.user)
    const {username} = useParams<UserParams>()
    const [uid, setUid] = useState<string>()
    const [media, setMedia] = useState<IMedia[]>([])

    useEffect(() => {
        if (!uid) return
        const user = UserService.fetchUserInRealTime(uid, 'anotherUser', setUser, setSubscribers, setSubscriptions)
        const unsubFromMedia = UserService.getUserMedia(uid, setMedia)

        return () => {
            user.forEach(unsubscribe => unsubscribe())
        }
    }, [uid])

    useEffect(() => {
        if (!username) return
        UserService.getUserUid(username)
            .then(uid => setUid(uid))
    }, [username])

    const user = (uid || me.uid && uid !== me.uid) ? anotherUser : me

    return (
        <div className="user">
            <div className="user__container">
                <div className="user__info">
                    <div className="user__info__container">
                        <div className="user__info__user-avatar">
                            <Story options={{username: false, className: true}} uid={user.uid}/>
                        </div>
                        <div className="user__info__user__data">
                            <div className="user__info__user__data__metadata">
                                <div className="user__info__user__data__metadata__username">{username}</div>
                                <div className="user__info__user__data__metadata__buttons">
                                    {
                                        (uid !== me.uid) ? (
                                            <>
                                                <Link to={`/direct/t/${anotherUser.uid}`}
                                                      className="user__info__user__data__metadata__buttons__button user__info__user__data__metadata__buttons__button__send-message">Отправить
                                                    сообщение</Link>
                                                <Subscribe uid={anotherUser.uid} meUid={me.uid}/>
                                            </>
                                        ) : <Link to="/accounts/edit"
                                                  className="user__info__user__data__metadata__buttons__button user__info__user__data__metadata__buttons__button__edit-profile">Редактировать
                                            профиль</Link>
                                    }
                                </div>
                            </div>
                            <div className="user__info__user__data__additional">
                                <div className="user__info__user__data__additional__publications">
                                    <div
                                        className="user__info__user__data__additional__publications__amount">{media?.length}</div>
                                    <div className="user__info__user__data__additional__publications__data">публикаций
                                    </div>
                                </div>
                                <div onClick={() => setPopup({
                                    name: 'ShowUsersPopup',
                                    type: true,
                                    data: {uid: uid, name: 'subscribers'}
                                })} className="user__info__user__data__additional__subscribers">
                                    <div
                                        className="user__info__user__data__additional__subscribers__amount">{user.subscribers?.length}</div>
                                    <div className="user__info__user__data__additional__subscribers__data">подписчиков
                                    </div>
                                </div>
                                <div onClick={() => setPopup({
                                    name: 'ShowUsersPopup',
                                    type: true,
                                    data: {uid: uid, name: 'subscriptions'}
                                })} className="user__info__user__data__additional__subscriptions">
                                    <div
                                        className="user__info__user__data__additional__subscriptions__amount">{user.subscriptions?.length} </div>
                                    <div className="user__info__user__data__additional__subscribers__data">подписок
                                    </div>
                                </div>
                            </div>
                            <div className="user__info__user__data__additional-lower">
                                {user.fullName &&
                                    <div className="user__info__user__data__user-fullname">{user.fullName}</div>}
                                {user.biography &&
                                    <div className="user__info__user__data__user-biography">{user.biography}</div>}
                                {user.link && <a href={user.link} target="_blank"
                                                 className="user__info__user__data__user-link">{user.link}</a>}
                            </div>
                        </div>
                    </div>
                    <div className="user__info__additional-lower__same">
                        {user.fullName && <div className="user__info__user__data__user-fullname">{user.fullName}</div>}
                        {user.biography &&
                            <div className="user__info__user__data__user-biography">{user.biography}</div>}
                        {user.link && <a href={user.link} target="_blank"
                                         className="user__info__user__data__user-link">{user.link}</a>}
                    </div>
                    <div className="user__info__buttons-same">
                        {
                            (uid !== me.uid) ? (
                                <>
                                    <Link to={`/direct/t/${anotherUser.uid}`}
                                          className="user__info__user__data__metadata__buttons__button user__info__user__data__metadata__buttons__button__send-message">Отправить
                                        сообщение</Link>
                                    <Subscribe uid={anotherUser.uid} meUid={me.uid}/>
                                </>
                            ) : (
                                <Link to="/accounts/edit"
                                      className="user__info__user__data__metadata__buttons__button user__info__user__data__metadata__buttons__button__edit-profile">Редактировать
                                    профиль</Link>
                            )
                        }
                    </div>
                </div>
                <hr/>
                <div className="user__media">
                    {
                        media?.length > 0 ? (
                            <div className="user__media__media">
                                {
                                    media.map(({url, id}) => {
                                        return (
                                            <Link to={`/${username}/p/${id}`} key={id}
                                                  className="user__media__media__media-item">
                                                {
                                                    url.includes('.mp4') || url.includes('.mkv') || url.includes('.mov') || url.includes('.MOV') ? (
                                                        <>
                                                            <video src={url}/>
                                                            <svg aria-label="Видео" color="#ffffff" fill="#ffffff"
                                                                 height="18" role="img" viewBox="0 0 24 24" width="18">
                                                                <path
                                                                    d="M5.888 22.5a3.46 3.46 0 01-1.721-.46l-.003-.002a3.451 3.451 0 01-1.72-2.982V4.943a3.445 3.445 0 015.163-2.987l12.226 7.059a3.444 3.444 0 01-.001 5.967l-12.22 7.056a3.462 3.462 0 01-1.724.462z"></path>
                                                            </svg>
                                                        </>
                                                    ) : (
                                                        <img src={url} alt="Фото"/>
                                                    )
                                                }
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        ) : (
                            uid === me.uid ? (
                                <div className="user__media__nothing">
                                    <div className="user__media__nothing__title">Профиль</div>
                                    <div className="user__media__nothing__sub-title">Фото и видео, которыми вы
                                        поделитесь, будут показываться в вашем профиле
                                    </div>
                                    <button onClick={() => setPopup({name: 'UploadMedia', type: true})}
                                            className="user__media__nothing__button-share">Поделиться своим первым фото
                                        или видео
                                    </button>
                                </div>
                            ) : (
                                <div className="user__media__nothing">
                                    <img src={camera} alt="camera"/>
                                    <div className="user__media__nothing__title">Публикаций пока нет</div>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default User