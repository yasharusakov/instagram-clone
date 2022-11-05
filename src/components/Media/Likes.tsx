import {collection, getFirestore, onSnapshot} from "firebase/firestore"
import {FC, useEffect, useState} from "react"
import {useActions} from "../../hooks/useActions"

interface LikesProps {
   UID: string | undefined
   mediaID: string | undefined
}

const Likes: FC<LikesProps> = ({UID, mediaID}) => {
    const db = getFirestore()
    const {setPopup} = useActions()
    const [likesLength, setLikesLength] = useState<number>(0)

    const fetchLikes = () => {
        const collectionRef = collection(db, `users/${UID}/media/${mediaID}/likes`)

        return onSnapshot(collectionRef, (querySnapshot) => {
            setLikesLength(querySnapshot.docs.length)
        })
    }

    useEffect(() => {
        if (!UID || !mediaID) return

        const unsub = fetchLikes()

        return () => {
            unsub()
        }
    }, [UID, mediaID])

    return <div onClick={() => setPopup({name: 'ShowUsersPopup', type: true, data: {name: 'likes', uid: UID, mediaId: mediaID}})} className="media__control-panel__likes">{likesLength} отметок "Нравится"</div>
}

export default Likes