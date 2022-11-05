import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit"
import {PopupState, IPopupPayloadAction} from "../../types/popup"

const initialState: PopupState = {
	UploadMedia: {type: false, data: null},
	AdditionalMedia: {type: false, data: null},
	SubscriptionsPopup: {type: false, data: null},
	CommentsPopup: {type: false, data: null},
	StoriesPopup: {type: false, data: null},
	ShowUsersPopup: {type: false, data: null}
}

const popupsSlice = createSlice({
	name: 'popups',
	initialState,
	reducers: {
		setPopup(state: Draft<PopupState>, action: PayloadAction<IPopupPayloadAction>) {
			state[action.payload.name] = {type: action.payload.type, data: action.payload.data}
		}
	}
})

export default popupsSlice.reducer

export const {
	setPopup
} = popupsSlice.actions