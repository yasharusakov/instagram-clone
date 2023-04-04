import {NavLink} from "react-router-dom"
import ActiveButtonLayout from "./ActiveButtonContentLayout"

import './style.scss'

const EditProfile = () => {
	const isActive = ({isActive}: {isActive: boolean}) => isActive ? 'isActive' : ''

	const buttons = [
		{to: '/accounts/edit', title: 'Редактировать профиль'},
		{to: '/accounts/password_change', title: 'Сменить пароль'},
		{to: '/accounts/manage_access', title: 'Приложения и сайты'},
		{to: '/accounts/emails_settings', title: 'Уведомления по электронной почте'},
		{to: '/accounts/push_web_settings', title: 'Управление контактами'},
		{to: '/accounts/privacy_and_security', title: 'Конфидинциальность и безопасность'},
		{to: '/accounts/login_activity', title: 'Входы в аккаунт'},
		{to: '/accounts/emails_sent', title: 'Электронные письма от Instagram'},
		{to: '/accounts/help', title: 'Помощь'}
	]

	return (
		<div className="edit-profile">
			<div className="edit-profile__container">
				<div className="edit-profile__edit">
					<div className="edit-profile__buttons">
						{buttons.map(({title, to}) => {
							return (
								<NavLink key={to} className={isActive} to={to}>
									<button className="edit-profile__button">{title}</button>
								</NavLink>
							)
						})}
					</div>
				</div>
				<ActiveButtonLayout/>
			</div>
		</div>
	)
}

export default EditProfile