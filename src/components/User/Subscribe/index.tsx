import {FC, memo, useEffect, useState} from "react"
import UserService from "../../../services/user-service"

import './style.scss'

interface SubscribeProps {
    uid: string | undefined
    meUid: string | undefined
}

const Subscribe: FC<SubscribeProps> = memo(({uid, meUid}) => {
    const [subscribe, setSubscribe] = useState<boolean>(false)

    useEffect(() => {
        if (!uid || !meUid) return

        const unsub = UserService.listenSubscribe(uid, meUid, setSubscribe)

        return () => unsub && unsub()
    }, [uid, meUid])

    const subscribeOnUser = async () => {
        await UserService.subscribeOnUser(uid!, meUid!)
    }

    const unsubscribeFromUser = async () => {
        await UserService.unsubscribeFromUser(uid!, meUid!)
    }

    return (
        <div className="subscribe">
            {
                (subscribe && (uid !== meUid)) ? (
                    <button onClick={subscribeOnUser} className="subscribe__button subscribe__button_1">Подписки</button>
                ) : (
                    <button onClick={unsubscribeFromUser} className="subscribe__button subscribe__button_2">Подписаться</button>
                )
            }
        </div>
    )
})

export default Subscribe