import ExploreSearch from "../../ExploreSearch"
import {FC} from "react"

interface DropDownListItemsSearchPanelProps {
	value: string | undefined
}

const DropDownListItemsSearchPanel: FC<DropDownListItemsSearchPanelProps> = ({value}) => {
	return <ExploreSearch header={true} inputValue={value}/>
}

export default DropDownListItemsSearchPanel