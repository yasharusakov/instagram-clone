import {FC, memo, useMemo} from 'react'
import DropDownListItemsUser from "./DropDownListItemsUser"
import DropDownListItemsActivity from "./DropDownListItemsActivity"
import DropDownListItemsSearchPanel from "./DropDownListItemsSearchPanel"

import './style.scss'

interface DropDownListLayoutProps {
	name: 'search-panel' | 'activity' | 'user'
	visibility: boolean
	value?: string
}

const DropDownListLayout: FC<DropDownListLayoutProps> = memo(({name, visibility, value}) => {
	const renderContent = useMemo(() => {
		switch(name) {
			case 'search-panel':
				return <DropDownListItemsSearchPanel value={value}/>
			case 'activity':
				return <DropDownListItemsActivity/>
			case 'user':
				return <DropDownListItemsUser/>
		}
	}, [value])

	return (
		<div className={`drop-down-list-layout ${name} ${visibility && 'show'}`}>
			<div className={`drop-down-list-layout__triangle-up ${name}`}></div>
			<div className={`drop-down-list-layout__container ${name}`}>
				{renderContent}
			</div>
		</div>
	)
})

export default DropDownListLayout