import {FC, FormEvent, memo, useState} from "react"
import {collection, doc, getFirestore, serverTimestamp, setDoc} from "firebase/firestore"
import {getAuth} from "firebase/auth";

interface AddACommentProps {
    UID: string | undefined
    mediaID: string | undefined
}

const AddAComment: FC<AddACommentProps> = memo(({UID, mediaID}) => {
    const db = getFirestore()
    const auth = getAuth()
    const [loading, setLoading] = useState<boolean>(false)
    const [value, setValue] = useState<string>('')

    const addComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!UID || !mediaID || !auth.currentUser?.uid) return

        setLoading(true)

        const collectionRef = doc(collection(db, `users/${UID}/media/${mediaID}/comments`))

        await setDoc(collectionRef, {
            uid: auth.currentUser?.uid,
            value: value,
            createdAt: serverTimestamp()
        })

        setValue('')
        setLoading(false)
    }

    return (
        <form onSubmit={addComment} className="media__add-comment">
            <input value={value} onChange={(e) => setValue(e.target.value)} disabled={loading} placeholder="Добавьте комментарий..."/>
            <button disabled={loading || !value} type="submit">Опубликовать</button>
        </form>
    )
})

export default AddAComment