import {useAppSelector} from "../../hooks/useAppSelector"
import {Link} from "react-router-dom"
import Posts from "../Posts"
import Stories from "../Stories"
import defaultAvatar from "../../resources/images/default-avatar.jpg"

import './style.scss'

const Home = () => {
	const me = useAppSelector(state => state.user.me)

	return (
		<div className="home">
			<div className="home__container">
				<div className="home__media">
					<Stories/>
					<Posts subscriptions={me.subscriptions}/>
				</div>
				<div className="home__data">
					<header className="home__data__header">
						<Link to={`/${me.username}`} className="home__data__header__user-avatar">
							<img src={me.avatar ? me.avatar : defaultAvatar} alt="Фото профиля"/>
						</Link>
						<Link to={`/${me.username}`} className="home__data__header__username">
							{me.username}
						</Link>
					</header>
					<footer className="home__data__footer">
						<div className="home__data__footer__title">© 2022 INSTAGRAM FROM META</div>
					</footer>
				</div>
			</div>
		</div>
	)
}

export default Home