import {useParams} from "react-router-dom"
import ActiveButtonContent from "./ActiveButtonContent"
import ActiveButtonContentNothing from "./ActiveButtonContentNothing"
import ActiveButtonContentEditProfile from "./ActiveButtonContentEditProfile"
import ActiveButtonContentChangePassword from "./ActiveButtonContentChangePassword"
import {EditProfileParams} from "../../types/user"

const ActiveButtonLayout = () => {
	const {activeButton} = useParams<EditProfileParams>()

	switch(activeButton) {
		case 'edit':
			return <ActiveButtonContent render={() => <ActiveButtonContentEditProfile/>}/>
		case 'password_change':
			return <ActiveButtonContent render={() => <ActiveButtonContentChangePassword/>}/>
		default:
			return <ActiveButtonContent render={() => <ActiveButtonContentNothing/>}/>
	}
}

export default ActiveButtonLayout