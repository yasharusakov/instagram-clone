import Popup from "../Popup"
import UploadMediaPopup from "../Popups/UploadMediaPopup"
import CommentsPopup from "../Popups/CommentsPopup"
import AdditionalMediaPopup from "../Popups/AdditionalMediaPopup"
import StoriesPopup from "../Popups/StoriesPopup"
import ShowUsersPopup from "../Popups/ShowUsersPopup"
import './style.scss'

const Footer = () => {

	const links = [
		'Meta', 'Информация', 'Блог', 'Вакансии', 'Помощь', 'API',
		'Конфиденциальность', 'Условия', 'Популярные аккаунты', 'Хэштеги',
		'Места', 'Instagram Lite', 'Загрузка контактов и лица, не являющиеся пользователями'
	]

    return (
        <footer className="footer">
			<div className="footer__container">
				<ul className="footer__links">
					{links.map((link, i) => {
						return (
							<li key={i}>
								<a className="footer__link" href="#">{link}</a>
							</li>
						)
					})}
				</ul>
				<ul className="footer__links">
					<li><div className="footer__link">Русский</div></li>
					<li><div className="footer__link">© 2022 Instagram from Meta</div></li>
				</ul>
			</div>
			<Popup title="Создание публикации" name="UploadMedia" render={() => <UploadMediaPopup/>}/>
			<Popup title="Комментарии" name="CommentsPopup" render={() => <CommentsPopup/>}/>
			<Popup name="AdditionalMedia" render={() => <AdditionalMediaPopup/>}/>
			<Popup name="StoriesPopup" render={() => <StoriesPopup/>}/>
			<Popup name="ShowUsersPopup" render={() => <ShowUsersPopup/>}/>
		</footer>
    )
}

export default Footer