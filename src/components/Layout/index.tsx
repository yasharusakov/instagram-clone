import {ReactNode, ReactElement, FC} from 'react'
import Footer from '../Footer'
import Header from '../Header'

import './style.scss'
import SideBar from '../SideBar'

interface BaseLayoutProps {
	children: ReactNode | ReactElement
}

const Layout: FC<BaseLayoutProps> = ({children}) => {
	return (
		<div className="layout">
			<SideBar />
			<div className="layout__container">
				<main className="layout__content">{children}</main>
				<Footer />
			</div>
		</div>
	)
}

export default Layout
