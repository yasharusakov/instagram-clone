import {useAppDispatch} from "./useAppDispatch"
import {bindActionCreators} from "redux"
import * as UserActionCreators from '../redux/slices/userSlice'
import * as PopupActionCreators from '../redux/slices/popupsSlice'

export const useActions = () => {
    const dispatch = useAppDispatch()
    return bindActionCreators(
        {...UserActionCreators, ...PopupActionCreators},
        dispatch
    )
}