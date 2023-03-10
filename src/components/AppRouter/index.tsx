import {Route, Routes, Navigate} from "react-router-dom"
import {useEffect} from "react"
import {useActions} from "../../hooks/useActions"
import {useAuthState} from "../../hooks/useAuthState"
import Layout from "../Layout"
import Home from "../Home"
import InstagramLoader from "../Loaders/InstagramLoader"
import EditProfile from "../EditProfile"
import PageNotFound from "../PageNotFound"
import User from "../User"
import Direct from "../Direct"
import Login from "../Login"
import Register from "../Register"
import Media from "../Media"
import ExploreSearch from "../ExploreSearch"
import AccountsActivity from "../AccountsActivity"
import UserService from "../../services/user-service"

const AppRouter = () => {
    const {userState, auth, loading} = useAuthState()
    const {setUser, setSubscribers, setSubscriptions} = useActions()

    useEffect(() => {
        if (!userState || !auth.currentUser?.uid) return
        const user = UserService.fetchUserInRealTime(auth.currentUser.uid, 'me', setUser, setSubscribers, setSubscriptions)
        return () => user.forEach(unsubscribe => unsubscribe())
    }, [userState])

    if (loading) return <InstagramLoader/>

    return userState ?
        (
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/:username" element={<User/>}/>
                    <Route path="/:username/p/:id" element={<Media/>}/>
                    <Route path="/accounts/:activeButton" element={<EditProfile/>}/>
                    <Route path="/direct/inbox" element={<Direct/>}/>
                    <Route path="/direct/t/:uid" element={<Direct/>}/>
                    <Route path="/accounts/register" element={<Navigate to="/"/>}/>
                    <Route path="/explore/search" element={<ExploreSearch/>}/>
                    <Route path="/accounts/activity" element={<AccountsActivity/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Layout>
        )
        :
        (
            <Layout>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/accounts/register" element={<Register/>}/>
                    <Route path="/:username" element={<User/>}/>
                    <Route path="/:username/p/:id" element={<Media/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Layout>
        )
}

export default AppRouter