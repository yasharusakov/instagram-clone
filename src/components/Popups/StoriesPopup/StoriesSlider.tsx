import {EffectCube, Navigation} from "swiper"
import {Swiper, SwiperSlide} from "swiper/react"
import {FC, memo} from "react"
import {IStory} from "../../../types/user"
import {Swiper as SwiperType} from 'swiper/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-cube'

interface StoriesSliderProps {
    setRefData: any
    onTimeUpdate: any
    setSwiper: {(data: SwiperType): void}
    setActiveIndex: {(data: number): void}
    stories: IStory[] | undefined
}

const StoriesSlider: FC<StoriesSliderProps> = memo(({setRefData, onTimeUpdate, setSwiper, setActiveIndex, stories}) => {
    return (
        <Swiper
            modules={[EffectCube, Navigation]}
            effect="cube"
            spaceBetween={0}
            slidesPerView={1}
            speed={500}
            navigation
            onSwiper={(swiper) => {
                setSwiper(swiper)
                setActiveIndex(swiper.activeIndex)
            }}
            onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex)
            }}
        >
            {
                stories?.map((item) => {
                    return (
                        <SwiperSlide key={item.id}>
                            {({isActive}) => (
                                isActive && (
                                    item?.url.includes('.mp4') || item?.url.includes('.mkv') || item?.url.includes('.mov') || item?.url.includes('.MOV') ? (
                                        <video
                                            onLoad={(e) => setRefData({data: e.target, type: 'video'})}
                                            onLoadedData={(e) => setRefData({data: e.target, type: 'video'})}
                                            onTimeUpdate={(e) => onTimeUpdate(e.target)}
                                            autoPlay={true}
                                            muted={false}
                                            playsInline
                                            src={item.url}>
                                        </video>
                                    ) : (
                                        <img
                                            onLoad={(e) => setRefData({data: e.target, type: 'image'})}
                                            onLoadedData={(e) => setRefData({data: e.target, type: 'image'})}
                                            src={item.url}
                                        />
                                    )
                                )
                            )}
                        </SwiperSlide>
                    )
                })
            }
        </Swiper>
    )
})

export default StoriesSlider