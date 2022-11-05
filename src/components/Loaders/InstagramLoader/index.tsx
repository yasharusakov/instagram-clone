import instagramicon from '../../../resources/images/instagram-icon.png'
import meta from '../../../resources/images/meta.png'

import './style.scss'

const InstagramLoader = () => {
	return (
		<div className="instagram-loader">
			<div className="instagram-loader__container">
				<div className="instagram-loader__instagram-icon">
					<img src={instagramicon} alt="instagram-icon"/>
				</div>
				<div className="instagram-loader__meta">
					<div className="instagram-loader__meta-icon">
						<img src={meta} alt="meta"/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default InstagramLoader