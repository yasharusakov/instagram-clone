import Comments from "../../Media/Comments"
import {useAppSelector} from "../../../hooks/useAppSelector"
import AddAComment from "../../Media/AddAComment"
import {Link} from "react-router-dom"
import defaultAvatar from "../../../resources/images/default-avatar.jpg"

import './style.scss'

const CommentsPopup = () => {
    const data = useAppSelector(state => state.popups.CommentsPopup.data)

    return (
        <div className="comments-popup">
            <div className="comments-popup__container">
                <div className="comments-popup__comments">
                    {
                        data?.signature && (
                            <div style={{marginTop: 0, marginBottom: 20}} className="media__comment">
                                <div className="media__comment__container">
                                    <Link to={`/${data.user?.username}`} className="media__comment__user-avatar">
                                        <img src={data.user?.avatar ? data.user.avatar : defaultAvatar} alt="Фото профиля"/>
                                    </Link>
                                    <div className="media__comment__row">
                                        <div className="media__comment__data">
                                            <Link to={`/${data.user?.username}`} className="media__comment__username">
                                                {data.user?.username}
                                            </Link>
                                            <span className="media__comment__value">
                                                {data?.signature}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <Comments UID={data?.UID} mediaID={data?.mediaID}/>
                </div>
                <AddAComment UID={data?.UID} mediaID={data?.mediaID}/>
            </div>
        </div>
    )
}

export default CommentsPopup