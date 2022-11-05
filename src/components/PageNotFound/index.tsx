import {Link} from "react-router-dom"

import './style.scss'

const PageNotFound = () => {
	return (
		<div className="page-not-found">
			<h2 className="page-not-found__title">К сожалению, эта страница недоступна.</h2>
			<div className="page-not-found__sub-title">
				<span>Возможно, вы воспользовались недействительной ссылкой или страница была удалена. </span>
				<Link to="/">Назад в Instagram.</Link>
			</div>
		</div>
	)
}

export default PageNotFound