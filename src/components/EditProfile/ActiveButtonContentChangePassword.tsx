import {FormEvent, useState} from 'react'
import defaultAvatar from "../../resources/images/default-avatar.jpg"
import {useAppSelector} from "../../hooks/useAppSelector"
import Loader from "../Loaders/DefaultLoader"
import {getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth"
import {getFirestore, doc, updateDoc} from "firebase/firestore"

const ActiveButtonContentChangePassword = () => {
	const auth = getAuth()
	const db = getFirestore()
	const me = useAppSelector(state => state.user.me)
	const [loading, setLoading] = useState<boolean>(false)
	const [newPassword, setNewPassword] = useState<string>('')
	const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')

	const updateUserPassword = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)

		const user = auth.currentUser!
		const docRef = doc(db, 'users', user.uid)

		const credential = EmailAuthProvider.credential(me.email, me.password)
		await reauthenticateWithCredential(auth.currentUser!, credential)

		await updateDoc(docRef, {password: newPassword})
		await updatePassword(user, newPassword)

		setNewPassword('')
		setConfirmNewPassword('')
		setLoading(false)
	}

	const disableButton = !(!loading &&
		!!newPassword && !!confirmNewPassword &&
		newPassword === confirmNewPassword &&
		newPassword.length >= 6 && confirmNewPassword.length >= 6)

	return (
		<div className="edit-profile__active-button-content__change-password">
			<header className="edit-profile__active-button-content__edit-profile__header">
				<div className="edit-profile__active-button-content__edit-profile__header__user-avatar">
					<div className="edit-profile__active-button-content__edit-profile__header__user-avatar__avatar">
						<img src={me.avatar ? me.avatar : defaultAvatar} alt="avatar"/>
					</div>
				</div>
				<div className="edit-profile__active-button-content__edit-profile__header__metadata__user-metadata">
					<div className="edit-profile__active-button-content__edit-profile__header__user-metadata__username">{me.username}</div>
				</div>
			</header>
			<form onSubmit={updateUserPassword} className="edit-profile__active-button-content__edit-profile__form">
				<section className="edit-profile__active-button-content__edit-profile__form__section">
					<aside className="edit-profile__active-button-content__edit-profile__form__section__aside">
						<label htmlFor="newPassword" className="edit-profile__active-button-content__edit-profile__form__section__aside__label">Новый пароль</label>
					</aside>
					<div className="edit-profile__active-button-content__edit-profile__form__section__input">
						<input onChange={(e) => setNewPassword(e.target.value)} id="newPassword" placeholder="Новый пароль" autoComplete="off" type="password"/>
					</div>
				</section>
				<section className="edit-profile__active-button-content__edit-profile__form__section">
					<aside className="edit-profile__active-button-content__edit-profile__form__section__aside">
						<label htmlFor="confirmNewPassword" className="edit-profile__active-button-content__edit-profile__form__section__aside__label">Подтвердите новый пароль</label>
					</aside>
					<div className="edit-profile__active-button-content__edit-profile__form__section__input">
						<input onChange={(e) => setConfirmNewPassword(e.target.value)} id="confirmNewPassword" placeholder="Подтвердите новый пароль" autoComplete="off" type="password"/>
					</div>
				</section>
				<button disabled={disableButton} className="edit-profile__active-button-content__edit-profile__form__submit" type="submit">{loading ? <Loader/> : 'Отправить'}</button>
			</form>
		</div>
	)
}

export default ActiveButtonContentChangePassword