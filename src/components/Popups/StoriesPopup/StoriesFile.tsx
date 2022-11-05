import {v4 as uuidv4} from "uuid"
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage"
import {doc, getFirestore, serverTimestamp, setDoc} from "firebase/firestore"
import {useEffect, useState} from "react"
import {getAuth} from "firebase/auth"
import {useActions} from "../../../hooks/useActions"
import {useAppSelector} from "../../../hooks/useAppSelector"

const StoriesFile = () => {
    const db = getFirestore()
    const storage = getStorage()
    const auth = getAuth()
    const {setPopup} = useActions()
    const [file, setFile] = useState<File | null>(null)
    const [fileUrl, setFileUrl] = useState<string>('')
    const [url, setUrl] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)
    const type = useAppSelector(state => state.popups.StoriesPopup.type)

    const addStory = async () => {
        if (file) {
            setLoading(true)
            const fileExt = file.name.slice(file.name.lastIndexOf('.'))
            const id = `${uuidv4()}[${fileExt}]`
            const storageRef = ref(storage, `users/${auth.currentUser?.uid}/stories/${id}`)
            await uploadBytes(storageRef, file)
            await getDownloadURL(storageRef)
                .then((url) => {
                    setDoc(doc(db, `users/${auth.currentUser?.uid}/stories`, id), {
                        uid: auth.currentUser?.uid,
                        id: id,
                        url: url,
                        createdAt: serverTimestamp()
                    })
                })
            setUrl(undefined)
            setFile(null)
            setFileUrl('')
            setLoading(false)
            setPopup({name: 'StoriesPopup', type: false})
        }
    }

    const createUrl = () => {
        if (file) {
            const mediaCreator = window.URL || window.webkitURL
            const mediaUrl = mediaCreator.createObjectURL((file as Blob))
            setUrl(mediaUrl)
            setFileUrl(file.name)
        }
    }

    useEffect(() => {
        createUrl()
    }, [file])

    useEffect(() => {
        if (file) {
            setFile(null)
            setUrl(undefined)
            setFileUrl('')
        }
    }, [type])

    return file ? (
        <div className="stories-popup__file animation-to-top">
            {
                fileUrl.includes('.mp4') || fileUrl.includes('.mkv')  ? (
                    <video
                        autoPlay={true}
                        loop={true}
                        playsInline
                        muted
                        src={url}>
                    </video>
                ) : (
                    <img
                        src={url}
                        alt="История"
                    />
                )
            }
            <button disabled={loading} onClick={addStory} className="stories-popup__add">Поделиться</button>
        </div>
    ) : (
        <button className="stories-popup__choose">
            Выберите файл
            <input onChange={(e) => setFile(e.target.files![0])} type="file" accept=".jpg,.jpeg,.png,.gif, .mp4, .mkv"/>
        </button>
    )
}

export default StoriesFile