import Popup from "../Popup"
import UploadMediaPopup from "../Popups/UploadMediaPopup"
import CommentsPopup from "../Popups/CommentsPopup"
import AdditionalMediaPopup from "../Popups/AdditionalMediaPopup"
import StoriesPopup from "../Popups/StoriesPopup"

import './style.scss'
import ShowUsersPopup from "../Popups/ShowUsersPopup";

const Footer = () => {

    return (
        <footer className="footer">
			<div className="footer__container">
				<ul className="footer__links">
					<li><a className="footer__link" href="#">Meta</a></li>
					<li><a className="footer__link" href="#">Информация</a></li>
					<li><a className="footer__link" href="#">Блог</a></li>
					<li><a className="footer__link" href="#">Вакансии</a></li>
					<li><a className="footer__link" href="#">Помощь</a></li>
					<li><a className="footer__link" href="#">API</a></li>
					<li><a className="footer__link" href="#">Конфиденциальность</a></li>
					<li><a className="footer__link" href="#">Условия</a></li>
					<li><a className="footer__link" href="#">Популярные аккаунты</a></li>
					<li><a className="footer__link" href="#">Хэштеги</a></li>
					<li><a className="footer__link" href="#">Места</a></li>
					<li><a className="footer__link" href="#">Instagram Lite</a></li>
					<li><a className="footer__link" href="#">Загрузка контактов и лица, не являющиеся пользователями</a></li>
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