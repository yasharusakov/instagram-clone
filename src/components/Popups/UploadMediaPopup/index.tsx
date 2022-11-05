import {doc, getFirestore, serverTimestamp, setDoc} from "firebase/firestore"
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import {useAppSelector} from "../../../hooks/useAppSelector"
import {useActions} from "../../../hooks/useActions"
import {useNavigate} from "react-router-dom"
import {ChangeEvent, DragEvent, useEffect, useRef, useState} from "react"
import { v4 as uuidv4 } from 'uuid'
import defaultAvatar from '../../../resources/images/default-avatar.jpg'
import Loader from "../../Loaders/DefaultLoader"
import {getAuth} from "firebase/auth"

import './style.scss'

const UploadMediaPopup = () => {
	const db = getFirestore()
	const {setPopup} = useActions()
	const auth = getAuth()
	const {username, avatar} = useAppSelector(state => state.user.me)
	const navigate = useNavigate()
	const [drag, setDrag] = useState<boolean>(false)
	const [file, setFile] = useState<File | null>(null)
	const [fileUrl, setFileUrl] = useState<string>('')
	const [url, setUrl] = useState<string | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(false)
	const [signature, setSignature] = useState<string>('')
	const storage = getStorage()
	const refElement = useRef<any>(null)
	const refContainer = useRef<null | HTMLDivElement>(null)

	const uploadMedia = async () => {
		if (file) {
			setLoading(true)
			const fileExt = file.name.slice(file.name.lastIndexOf('.'))
			const id = `${uuidv4()}[${fileExt}]`
			const storageRef = ref(storage, `users/${auth.currentUser?.uid}/media/${id}`)
			await uploadBytes(storageRef, file)
			await getDownloadURL(storageRef)
				.then((url) => {
					setDoc(doc(db, `users/${auth.currentUser?.uid}/media`, id), {
						uid: auth.currentUser?.uid,
						id: id,
						url: url,
						signature: signature,
						createdAt: serverTimestamp()
					})
				})
			setPopup({name: 'UploadMedia', type: false})
			setUrl(undefined)
			setFile(null)
			setFileUrl('')
			setSignature('')
			setLoading(false)
			if (window.location.pathname !== `/${username}`) {
				navigate(`/${username}`)
			}
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

	const onDragStart = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDrag(true)
	}

	const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDrag(false)
	}

	const onDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		const file = e.dataTransfer.files[0]
		setFile(file)
		setDrag(false)
	}

	const goBack = () => {
		setUrl(undefined)
		setFile(null)
	}

	useEffect(() => {
		createUrl()
	}, [file])

	return (
		<div ref={refContainer} className="upload-media-popup">
			<div className="upload-media-popup__container">
				{
					file ? (
						<div className="upload-media-popup__upload animation-to-right next">
							<div className="upload-media-popup__upload__media">
								{
									fileUrl.includes('.mp4') || fileUrl.includes('.mkv') || fileUrl.includes('.mov') || fileUrl.includes('.MOV') ? (
										<video
											autoPlay={true}
											loop={true}
											controls
											preload="auto"
											playsInline
											muted src={url}
											ref={refElement}
										>
										</video>
									) : <img
										src={url}
										alt={url}
										ref={refElement}
									/>
								}
							</div>
							<div className="upload-media-popup__upload__data">
								<div className="upload-media-popup__upload__data__user">
									<div className="upload-media-popup__upload__data__user__user-avatar">
										<img src={avatar ? avatar : defaultAvatar}  alt="user photo"/>
									</div>
									<div className="upload-media-popup__upload__data__user__username">{username}</div>
								</div>
								<div className="upload-media-popup__upload__data__signature">
									<textarea onChange={(e) => setSignature(e.target.value)} value={signature} maxLength={2200} placeholder="Придумайте подпись" />
								</div>
								<div className="upload-media-popup__upload__data__buttons">
									<button disabled={loading} onClick={goBack} className="upload-media-popup__upload-button">Назад</button>
									<button disabled={loading} onClick={uploadMedia} className="upload-media-popup__upload-button">{loading ? <Loader/> : 'Поделиться'}</button>
								</div>
							</div>
						</div>
					) : (
						<div className="upload-media-popup__upload animation-to-left">
							<div onDragStart={onDragStart} onDragLeave={onDragLeave} onDragOver={onDragStart} onDrop={onDrop} className={drag ? "upload-media-popup__upload-drag drag-active" : "upload-media-popup__upload-drag" }></div>
							<svg aria-label="Значок, соответствующий медиафайлам, например изображениям или видео" color="#262626" fill="#262626" height="77" role="img" viewBox="0 0 97.6 77.3" width="96">
								<path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path>
								<path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path>
								<path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path>
							</svg>
							<div className="upload-media-popup__upload-title">Перетащите сюда фото и видео</div>
							<div className="upload-media-popup__upload-button">
								Выбрать с компьютера
								<input onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files![0])}  type="file" accept=".jpg,.jpeg,.png,.gif, .mp4"/>
							</div>
						</div>
					)
				}
			</div>
		</div>
	)
}

export default UploadMediaPopup