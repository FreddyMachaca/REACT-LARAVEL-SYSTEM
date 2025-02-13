import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import { AppMenu } from 'components/AppMenu';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Link } from 'react-router-dom';
import PrimeReact from 'primereact/api';
import useApp from 'hooks/useApp';

const MainLayout = () => {
	const app = useApp();
	const appName = process.env.REACT_APP_NAME;
	const [staticMenuInactive, setStaticMenuInactive] = useState(false);
	const [overlayMenuActive, setOverlayMenuActive] = useState(false);
	const [mobileMenuActive, setMobileMenuActive] = useState(false);
	const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
	PrimeReact.ripple = true;
	let menuClick = false;
	let mobileTopbarMenuClick = false;
	const layoutMode = 'static';
	const isDesktop = () => {
		return window.innerWidth >= 992;
	}

	const onWrapperClick = (event) => {
		if (!menuClick) {
			setOverlayMenuActive(false);
			setMobileMenuActive(false);
		}

		if (!mobileTopbarMenuClick) {
			setMobileTopbarMenuActive(false);
		}

		mobileTopbarMenuClick = false;
		menuClick = false;
	}

	const onToggleMenuClick = (event) => {
		menuClick = true;
		if (isDesktop()) {
			if (layoutMode === 'overlay') {
				if (mobileMenuActive === true) {
					setOverlayMenuActive(true);
				}
				setOverlayMenuActive((prevState) => !prevState);
				setMobileMenuActive(false);
			}
			else if (layoutMode === 'static') {
				setStaticMenuInactive((prevState) => !prevState);
			}
		}
		else {
			setMobileMenuActive((prevState) => !prevState);
		}
		event.preventDefault();
	}

	const onSidebarClick = () => {
		menuClick = true;
	}
	const onMenuItemClick = (event) => {
		if (!event.item.items) {
			setOverlayMenuActive(false);
			setMobileMenuActive(false);
		}
	}
	const navbarSideLeft = app.menus.navbarSideLeft;
	const navbarTopLeft = app.menus.navbarTopLeft;
	const navbarTopRight = app.menus.navbarTopRight;
	const wrapperClass = classNames('layout-wrapper', setContainerClass());

	function setContainerClass(){
		return {
			'layout-overlay': layoutMode === 'overlay',
			'layout-static': layoutMode === 'static',
			'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
			'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
			'layout-mobile-sidebar-active': mobileMenuActive,
			'p-input-filled': false
		}
	}
	return (
		<div className={wrapperClass} onClick={onWrapperClick}>
<div className="layout-topbar bg-primary shadow-7">
    <div className="layout-toggle-menu">
        <Button type="button" severity="secondary" outlined className="layout-topbar-button" onClick={onToggleMenuClick}>
        <i className="pi pi-bars" />
        </Button>
    </div>
    <Link to="/" className="layout-topbar-logo flex-grow-none">
						<img src="/images/logo.png" alt="logo" className="my-5" />
						<span className="text-white">{ appName }</span>
        </Link>
        <div className="layout-topbar-menu flex-grow-1 justify-content-between">
            {
            navbarTopLeft && 
            <div className={classNames("", { 'layout-topbar-menu-mobile-active': mobileTopbarMenuActive })}>
                {
                navbarTopLeft.map((item, index)=>
                <Link key={`top-left-menu-${index}`} to={item.to}>
                    <Button label={item.label} icon={item.icon} className="p-button-text text-white page-button" />
                    </Link>
                    )
                    }
                </div>
                }
                {
                navbarTopRight && 
                <div className={classNames("", { 'layout-topbar-menu-mobile-active': mobileTopbarMenuActive })}>
                    {
                    navbarTopRight.map((item, index)=>
                    <Link  key={`top-right-menu-${index}`} to={item.to}>
                        <Button label={item.label} icon={item.icon} className="p-button-text text-white page-button" />
                        </Link>
                        )
                        }
                    </div>
                    }
                </div>
            </div>
            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu 
                    model={navbarSideLeft}
                    className="border-none w-full md:w-25rem"
                />
            </div>
			<div className="layout-main-container ">
				<div className="layout-main">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
export default MainLayout;
