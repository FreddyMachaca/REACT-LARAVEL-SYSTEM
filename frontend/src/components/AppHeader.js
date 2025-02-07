import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { SplitButton } from 'primereact/splitbutton';
import { Avatar } from 'primereact/avatar';
export const AppTopbar = (props) => {
    return (
        <div className="layout-topbar bg-primary shadow-7">
            <Link to="/" className="layout-topbar-logo">
                <img src="assets/layout/images/logo-dark.svg" alt="logo" />
                <span>SAKAI</span>
            </Link>
            <div className="layout-topbar-menu flex-grow-1 justify-content-between">
                <button type="button" className="p-link text-white layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                    <i className="pi pi-bars" />
                </button>

                {/* <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                    <i className="pi pi-ellipsis-v" />
                </button> */}

                <div className={classNames("", { 'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    <button className="p-link text-white layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-calendar" />
                        <span>Events</span>
                    </button>
                    <button className="p-link text-white layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-calendar" />
                        <span>Events</span>
                    </button>
                    <button className="p-link text-white layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-calendar" />
                        <span>Events</span>
                    </button>
                </div>
                <SplitButton className="layout-menu-user-button" icon="pi pi-user" />
            </div>
        </div>
    );
}
