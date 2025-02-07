import React from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import useApp from 'hooks/useApp';
const PageNotFound = (props) => {
    const app = useApp()
    return (
        <div className="container">
            <div className="grid flex-column align-items-center card">
                <div className="text-pink-500 font-bold text-5xl">404</div>
                <Avatar size="xlarge" icon="pi pi-lock" className="text-pink-500 bg-pink-100  my-4" />
                <div className="text-900 font-medium text-3xl mb-2">{props.message}</div>
                <div className="text-gray-600">The requested resources could not be found.</div>
                <div className="mt-5 text-center">
                <Button onClick={() => app.navigate('/home')} icon="pi pi-arrow-left" label="Home" />
                </div>
            </div>
        </div>
    )
}

PageNotFound.defaultProps = {
    message: "Resource not found!"
}



export default PageNotFound;