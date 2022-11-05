import {useEffect, useState} from "react"
import {getAuth} from "firebase/auth"
import {useActions} from "../../../hooks/useActions"
import {useNavigate} from "react-router-dom"
import {useAppSelector} from "../../../hooks/useAppSelector"
import {collection, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc} from "firebase/firestore"
import {IStory} from "../../../types/user"
import moment from "moment"
import VideoControls from "./VideoControls"
import {Swiper as SwiperType} from 'swiper/types'
import StoriesSlider from "./StoriesSlider"
import StoriesFile from "./StoriesFile"
import defaultAvatar from "../../../resources/images/default-avatar.jpg"

import './style.scss'

const StoriesPopup = () => {
    const db = getFirestore()
    const auth = getAuth()
    const navigate = useNavigate()
    const {setPopup} = useActions()
    const data = useAppSelector(state => state.popups.StoriesPopup.data)

    const [refData, setRefData] = useState<{data: null | HTMLVideoElement | HTMLVideoElement, type: null | 'image' | 'video'}>({data: null, type: null})

    const [stories, setStories] = useState<IStory[]>([])
    const [openStories, setOpenStories] = useState<boolean>(false)
    const [storyCreatedAt, setStoryCreatedAt] = useState<string>('')

    const [swiper, setSwiper] = useState<SwiperType>({} as SwiperType)
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

    const [intervalId, setIntervalId] = useState<any>()

    const onTimeUpdateVideo = (video: HTMLVideoElement) => {
        try {
            const percent = 100 * (video?.currentTime as number) / (video?.duration as number)

            const el = document.querySelectorAll('.stories-popup__progress-bar__bar__fill')[activeIndex!] as HTMLDivElement
            el.style.width = `${percent}%`

            if (video?.ended) {
                swiper.slideNext()
                if (stories.length - 1 === activeIndex) {
                    setPopup({name: 'StoriesPopup', type: false, data: null})
                }
            }
        } catch(err) {}
    }

    const getStories = async () => {
        const collectionRef = collection(db, `users/${data?.user.uid}/stories`)
        const q = query(collectionRef, orderBy('createdAt', 'asc'))
        const docsSnap = await getDocs(q)
        setStories(docsSnap.docs.map(item => item.data()) as IStory[])
    }

    useEffect(() => {
        setOpenStories(data?.openStories)
    }, [data?.openStories])

    useEffect(() => {
        if (!openStories) return
        (async () => getStories())()
    }, [openStories])

    useEffect(() => {
        if (!openStories) {
            clearTimeout(intervalId)
            setSwiper({} as SwiperType)
            setActiveIndex(undefined)
            setRefData({data: null, type: null})
        }
    }, [openStories])

    useEffect(() => {
        if (activeIndex === undefined || !stories.length) return

        const setWatched = async () => {
            const docRef = doc(db, `users/${data?.user.uid}/stories/${stories[activeIndex].id}/watched/${auth.currentUser?.uid}`)

            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    watchedAt: serverTimestamp()
                })
            }
        }

        (async () => setWatched())()

        const createdAt = moment((stories[activeIndex]!.createdAt as any).seconds * 1000).fromNow()
        setStoryCreatedAt(createdAt)

    }, [activeIndex, stories.length])

    useEffect(() => {
        if (intervalId) clearTimeout(intervalId)
        if (activeIndex === undefined) return
        const elements = document.querySelectorAll('.stories-popup__progress-bar__bar__fill')
        const element = elements[activeIndex]

        elements.forEach(element => {
            (element as any).style.width = 0
        })

        for (let i = 0; i <= activeIndex - 1; i++) {
            (elements[i] as any).style.width = '100%'
        }

        if (refData.type !== 'image' || !refData.data) return

        let currentTime = 0
        const time = 5000
        let id = setInterval(() => {
            currentTime += 100
            const percent = 100 * currentTime / time;

            (element as any).style.width = `${percent}%`

            if (currentTime === 5000) {
                clearTimeout(id)
                swiper.slideNext()
                if (stories.length - 1 === activeIndex) {
                    setPopup({name: 'StoriesPopup', type: false, data: null})
                    clearTimeout(id)
                }
            }

        }, 100)

        setIntervalId(id)

    }, [activeIndex, refData.type, refData.data])

    return (
        <div className="stories-popup">
            <div className="stories-popup__container">
                {openStories && (
                    <div className="stories-popup__progress-bar">
                        <div className="stories-popup__progress-bar__container">
                            {stories.map(({id}) => {
                                return (
                                    <div className="stories-popup__progress-bar__bar" key={id}>
                                        <div className="stories-popup__progress-bar__bar__line"></div>
                                        <div className="stories-popup__progress-bar__bar__fill"></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                <div className="stories-popup__user">
                    <div className="stories-popup__user__user-data">
                        <div onClick={() => {
                            if (data?.user.uid === auth.currentUser?.uid) {
                                setOpenStories(false)
                            } else {
                                setPopup({name: 'StoriesPopup', type: false})
                                navigate(`/${data?.user.username}`)
                            }
                        }} className="stories-popup__user__picture">
                            <img src={data?.user.avatar ? data?.user.avatar : defaultAvatar} alt="Фото профиля" />
                            {data?.user.uid === auth.currentUser?.uid && (
                                    <svg aria-label="Значок &quot; Плюс&quot;" color="#0095f6" fill="#0095f6" height="16" role="img" viewBox="0 0 24 24" width="16">
                                        <path d="M12.001.504a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm5 12.5h-4v4a1 1 0 0 1-2 0v-4h-4a1 1 0 1 1 0-2h4v-4a1 1 0 1 1 2 0v4h4a1 1 0 0 1 0 2Z"></path>
                                    </svg>
                                )
                            }
                        </div>
                        <div onClick={() => {
                            setPopup({name: 'StoriesPopup', type: false})
                            navigate(`/${data?.user.username}`)
                        }} className="stories-popup__user__username">
                            {data?.user.username}
                        </div>
                        {(openStories && storyCreatedAt) && (
                            <div className="stories-popup__user__date-of-public">
                                {storyCreatedAt}
                            </div>
                        )}
                    </div>
                    {(refData.data && refData.type === 'video' && openStories) && <VideoControls video={refData.data}/>}
                    <div className="stories-popup__close">
                        <svg onClick={() => setPopup({name: 'StoriesPopup', type: false, data: null})} aria-label="Закрыть" color="#ffffff" fill="#ffffff" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
                        </svg>
                    </div>
                </div>
                {openStories ?
                    <StoriesSlider
                        setRefData={setRefData}
                        onTimeUpdate={onTimeUpdateVideo}
                        setSwiper={setSwiper}
                        setActiveIndex={setActiveIndex}
                        stories={stories}
                    />
                    :
                    <StoriesFile/>
                }
            </div>
        </div>
    )
}

export default StoriesPopup