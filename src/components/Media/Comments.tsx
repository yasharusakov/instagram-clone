import {FC, memo, useEffect, useState} from "react"
import {IComment} from "../../types/user"
import Comment from "./Comment"
import {collection, getFirestore, onSnapshot, orderBy, query} from "firebase/firestore";

interface CommentsProps {
    UID: string | undefined
    mediaID: string | undefined
}

const Comments: FC<CommentsProps> = memo(({UID, mediaID}) => {
    const db = getFirestore()
    const [comments, setComments] = useState<IComment[]>([])

    const fetchComments = () => {
        const collectionRef = collection(db, `users/${UID}/media/${mediaID}/comments`)
        const q = query(collectionRef, orderBy('createdAt', 'desc'))

        return onSnapshot(q, (querySnapshot) => {
            setComments(querySnapshot.docs.map(comment => ({id: comment.id, ...comment.data()} as IComment)))
        })
    }

    useEffect(() => {
        if (!UID || !mediaID) return

        const unsub = fetchComments()
        return () => {
            unsub()
        }
    }, [UID, mediaID])

    return (
        <>
            {comments?.map(comment => <Comment key={comment.id} {...comment} />)}
        </>
    )
})

export default Comments