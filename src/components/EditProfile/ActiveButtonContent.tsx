import {FC, ReactElement, ReactNode} from 'react'

interface ActiveButtonContentProps {
	render: () => ReactElement | ReactNode
}

const ActiveButtonContent: FC<ActiveButtonContentProps> = ({render}) => {
	return (
		<div className="edit-profile__active-button-content">
			<div className="edit-profile__active-button-content__container">
				{render()}
			</div>
		</div>
	)
}

export default ActiveButtonContent