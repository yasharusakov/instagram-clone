import {useAppSelector} from "../../hooks/useAppSelector"
import defaultAvatar from "../../resources/images/default-avatar.jpg"
import {ChangeEvent, FormEvent, useEffect, useState} from "react"
import {getFirestore, updateDoc, doc, deleteDoc, setDoc} from "firebase/firestore"
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage"
import {getAuth, updateEmail, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth"

import Loader from "../Loaders/DefaultLoader"

const ActiveButtonContentEditProfile = () => {
	const db = getFirestore()
	const storage = getStorage()
	const auth = getAuth()
	const me = useAppSelector(state => state.user.me)

	const [loading, setLoading] = useState<boolean>(false)
	const [someChange, setSomeChange] = useState<boolean>(false)

	const [file, setFile] = useState<File | null>(null)

	const [valueFullName, setValueFullName] = useState<string>("")
	const [valueUsername, setValueUsername] = useState<string>("")
	const [valueLink, setValueLink] = useState<string>("")
	const [valueBiography, setValueBiography] = useState<string>("")
	const [valueEmail, setValueEmail] = useState<string>("")

	const updateUserPhoto = async () => {
		if (file) {
			const uid = auth.currentUser?.uid
			setLoading(true)
			const storageRef = ref(storage, `/users/${uid}/avatar/avatar`)
			await uploadBytes(storageRef, file)
			await getDownloadURL(storageRef)
				.then((url) => {
					updateDoc(doc(db, 'users', uid!), {
						avatar: url,
					})
				})
			setFile(null)
			setLoading(false)
		}
	}

	useEffect(() => {
		(async () => await updateUserPhoto())()
	}, [file])

	const handler = (callback: (value: string) => void, value: string) => {
		if (!someChange) {
			setSomeChange(true)
		}
		callback(value)
	}

	useEffect(() => {
		setValueFullName(me.fullName)
		setValueUsername(me.username)
		setValueLink(me.link)
		setValueBiography(me.biography)
		setValueEmail(me.email)
	}, [me])

	const updateUserData = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setLoading(true)

		const docRef = doc(db, 'users', auth.currentUser?.uid!)

		const credential = EmailAuthProvider.credential(me.email, me.password)
		await reauthenticateWithCredential(auth.currentUser!, credential)

		await updateDoc(docRef, {
			biography: valueBiography,
			email: valueEmail,
			fullName: valueFullName,
			link: valueLink,
			username: valueUsername
		})

		await deleteDoc(doc(db, 'usernames', me.username))
		await setDoc(doc(db, 'usernames', valueUsername), {uid: auth.currentUser?.uid})
		await updateEmail(auth.currentUser!, valueEmail)

		setLoading(false)
		setSomeChange(false)
	}

	return (
		<div className="edit-profile__active-button-content__edit-profile">
			<header className="edit-profile__active-button-content__edit-profile__header">
				<div className="edit-profile__active-button-content__edit-profile__header__user-avatar">
					<div className="edit-profile__active-button-content__edit-profile__header__user-avatar__avatar">
						<img src={me.avatar ? me.avatar : defaultAvatar} alt="avatar"/>
						<input disabled={loading} onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files![0])} autoComplete="off" type="file" accept=".jpg,.jpeg,.png,.gif"/>
					</div>
				</div>
				<div className="edit-profile__active-button-content__edit-profile__header__metadata__user-metadata">
					<div className="edit-profile__active-button-content__edit-profile__header__user-metadata__username">{me.username}</div>
					<div className="edit-profile__active-button-content__edit-profile__header__user-metadata__change-photo">
						<button type="button">Изменить фото профиля</button>
						<input disabled={loading} onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files![0])} autoComplete="off" type="file" accept=".jpg,.jpeg,.png,.gif"/>
					</div>
				</div>
			</header>
			<form onSubmit={updateUserData} className="edit-profile__active-button-content__edit-profile__form">
				<section className="edit-profile__active-button-content__edit-profile__form__section">
					<aside className="edit-profile__active-button-content__edit-profile__form__section__aside">
						<label htmlFor="name" className="edit-profile__active-button-content__edit-profile__form__section__aside__label">Имя</label>
					</aside>
					<div className="edit-profile__active-button-content__edit-profile__form__section__input">
						<input disabled={loading} onChange={(e) => handler(setValueFullName, e.target.value)} id="name" value={valueFullName} placeholder="Имя" autoComplete="off" type="text"/>
					</div>
				</section>
				<section className="edit-profile__active-button-content__edit-profile__form__section">
					<aside className="edit-profile__active-button-content__edit-profile__form__section__aside">
						<label htmlFor="username" className="edit-profile__active-button-content__edit-profile__form__section__aside__label">Имя пользователя</label>
					</aside>
					<div className="edit-profile__active-button-content__edit-profile__form__section__input">
						<input disabled={loading} onChange={(e) => handler(setValueUsername, e.target.value.replace(/\W/g, '').toLowerCase())} id="username" value={valueUsername} placeholder="Имя пользователя" autoComplete="off" type="text"/>
					</div>
				</section>
				<section className="edit-profile__active-button-content__edit-profile__form__section">
					<aside className="edit-profile__active-button-content__edit-profile__form__section__aside">
						<label htmlFor="web" className="edit-profile__active-button-content__edit-profile__form__section__aside__label">Веб-сайт</label>
					</aside>
					<div className="edit-profile__active-button-content__edit-profile__form__section__input">
						<input disabled={loading} onChange={(e) => handler(setValueLink, e.target.value)} id="web" value={valueLink} placeholder="Веб-сайт" autoComplete="off" type="text"/>
					</div>
				</section>
				<section className="edit-profile__active-button-content__edit-profile__form__section">
					<aside className="edit-profile__active-button-content__edit-profile__form__section__aside">
						<label htmlFor="about" className="edit-profile__active-button-content__edit-profile__form__section__aside__label">О себе</label>
					</aside>
					<div className="edit-profile__active-button-content__edit-profile__form__section__input">
						<textarea disabled={loading} onChange={(e) => handler(setValueBiography, e.target.value)} id="about" value={valueBiography} autoComplete="off" placeholder="О себе"/>
					</div>
				</section>
				<section className="edit-profile__active-button-content__edit-profile__form__section">
					<aside className="edit-profile__active-button-content__edit-profile__form__section__aside">
						<label htmlFor="email" className="edit-profile__active-button-content__edit-profile__form__section__aside__label">Эл. адрес</label>
					</aside>
					<div className="edit-profile__active-button-content__edit-profile__form__section__input">
						<input disabled={loading} onChange={(e) => handler(setValueEmail, e.target.value)} id="email" value={valueEmail} placeholder="Эл. адрес" autoComplete="off" type="email"/>
					</div>
				</section>
				<button disabled={loading || !someChange} className="edit-profile__active-button-content__edit-profile__form__submit" type="submit">{loading ? <Loader/> : 'Отправить'}</button>
			</form>
		</div>
	)
}

export default ActiveButtonContentEditProfile