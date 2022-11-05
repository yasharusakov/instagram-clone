import {NavLink} from "react-router-dom"
import ActiveButtonLayout from "./ActiveButtonContentLayout"

import './style.scss'

const EditProfile = () => {
	const isActive = ({isActive}: {isActive: boolean}) => isActive ? 'isActive' : ''

	return (
		<div className="edit-profile">
			<div className="edit-profile__container">
				<div className="edit-profile__edit">
					<div className="edit-profile__buttons">
						<NavLink className={isActive} to="/accounts/edit">
							<button className="edit-profile__button">Редактировать профиль</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/password_change">
							<button className="edit-profile__button">Сменить пароль</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/manage_access">
							<button className="edit-profile__button">Приложения и сайты</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/emails_settings/">
							<button className="edit-profile__button">Уведомления по электронной почте</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/push_web_settings/">
							<button className="edit-profile__button">Push-увидомления</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/contact_history">
							<button className="edit-profile__button">Управление контактами</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/privacy_and_security">
							<button className="edit-profile__button">Конфидинциальность и безопасность</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/login_activity">
							<button className="edit-profile__button">Входы в аккаунт</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/emails_sent">
							<button className="edit-profile__button">Электронные письма от Instagram</button>
						</NavLink>
						<NavLink className={isActive} to="/accounts/help">
							<button className="edit-profile__button">Помощь</button>
						</NavLink>
					</div>
				</div>
				<ActiveButtonLayout/>
			</div>
		</div>
	)
}

export default EditProfile