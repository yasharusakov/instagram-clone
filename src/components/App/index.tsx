import {BrowserRouter} from "react-router-dom"
import AppRouter from "../AppRouter"

import '../../styles/style.scss'

const App = () => {
    return (
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    )
}

export default App