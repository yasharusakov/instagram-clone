import {useEffect, useState} from "react"
import {collection, getFirestore, onSnapshot} from "firebase/firestore"
import {useAppSelector} from "../../hooks/useAppSelector"
import {Swiper, SwiperSlide} from "swiper/react"
import {Mousewheel, Navigation} from "swiper"
import Story from "../Story"

import 'swiper/css'
import 'swiper/css/mousewheel'
import 'swiper/css/navigation'

import './style.scss'

const Stories = () => {
    const me = useAppSelector(state => state.user.me)
    const db = getFirestore()

    const [usersWhoHaveStories, setUsersWhoHaveStories] = useState<string[]>([])

    useEffect(() => {
        if (me.subscriptions!.length <= 0) return

        me.subscriptions!.forEach(uid => {
            const collectionRef = collection(db, `users/${uid}/stories`)
            onSnapshot(collectionRef, querySnapshot => {
                if (!querySnapshot.empty) {
                    setUsersWhoHaveStories(usersWhoHaveStories => Array.from(new Set([...usersWhoHaveStories, uid])))
                }
            })
        })

    }, [me?.subscriptions])

    return (
        <div className="stories">
            <div className="stories__container">
                <Swiper
                    modules={[Mousewheel, Navigation]}
                    spaceBetween={0}
                    slidesPerView={6.5}
                    watchSlidesProgress={true}
                    mousewheel
                    navigation
                    speed={1000}
                    breakpoints={{
                        0: {
                            slidesPerView: 3.5,
                        },
                        320: {
                            slidesPerView: 4.5,
                        },
                        640: {
                            slidesPerView: 6.5,
                        },
                    }}
                >
                    <SwiperSlide>
                        {me.uid && <Story options={{username: true}} uid={me.uid}/>}
                    </SwiperSlide>
                    {usersWhoHaveStories?.map(uid => {
                        return (
                            <SwiperSlide key={uid}>
                                <Story options={{username: true}} uid={uid}/>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    )
}

export default Stories