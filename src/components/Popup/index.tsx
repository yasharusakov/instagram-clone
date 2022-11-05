import {useAppSelector} from "../../hooks/useAppSelector"
import {IPopup} from "../../types/popup"
import {MouseEvent} from "react"
import {FC, memo} from 'react'
import {useActions} from "../../hooks/useActions"

import './style.scss'

const Popup: FC<IPopup> = memo(({title, name, render}) => {
	const popup = useAppSelector(state => state.popups[name].type)
	const {setPopup} = useActions()

	if (popup) {
		// document.documentElement.style.overflowY = 'scroll'
		document.body.style.overflowY = 'hidden'
	} else {
		// document.documentElement.style.overflow = ''
		document.body.style.overflow = ''
	}

	return (
		<div className={`popup ${name} ${popup ? 'show' : 'hide'}`}>
			<div onClick={(e: MouseEvent<HTMLDivElement>) => {
				if ((e.target as Element).classList.contains('popup__container')) {
					setPopup({name: name, type: false})
				}
			}} className="popup__container">
				<div className={`popup__content ${name}`}>
					{title && (
						<div className="popup__control-panel">
							<div className="popup__control-panel__title">{title}</div>
							<div onClick={() => setPopup({name: name, type: false, data: null})} className="popup__control-panel__close">&#x2715;</div>
						</div>
					)}
					<div className={`popup__main ${name}`}>
						{render()}
					</div>
				</div>
			</div>
		</div>
	)
})

export default Popup