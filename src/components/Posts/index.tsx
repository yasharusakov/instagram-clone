import {FC, memo, useEffect, useState} from "react"
import {collection, getFirestore, orderBy, query, limit, getDocs} from "firebase/firestore"
import Media from "../Media"
import {IMedia} from "../../types/user"

import './style.scss'

interface PostsProps {
    subscriptions: string[] | undefined
}

const Posts: FC<PostsProps> = memo(({subscriptions}) => {
    const db = getFirestore()
    const [posts, setPosts] = useState<IMedia[]>([])

    const fetchMedia = () => {
        subscriptions!.forEach(async uid => {
            const q = query(collection(db, `users/${uid}/media`), orderBy('createdAt', 'desc'), limit(2))

            const querySnapshot = await getDocs(q)
            const justArray = [...querySnapshot.docs.map(item => ({...item.data()}))]
            setPosts(array => ([...array, ...justArray] as IMedia[]).sort((a, b) => (new Date(+b.createdAt!.seconds * 1000) as any) - (new Date(+a.createdAt!.seconds * 1000) as any)))
        })
    }

    useEffect(() => {
        if (!subscriptions || subscriptions.length <= 0) return
        fetchMedia()
    }, [subscriptions])

    return (
        <div className="posts">
            {posts?.map(item => <Media key={item.id} mediaData={item}/>)}
        </div>
    )
})

export default Posts