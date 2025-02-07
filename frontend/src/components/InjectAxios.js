
import { useEffect } from 'react';
import axios from 'axios';
import useAuth from 'hooks/useAuth';
import useApp from 'hooks/useApp';
import { useLocation } from 'react-router-dom';
axios.defaults.baseURL = process.env.REACT_APP_API_PATH;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default function InjectAxios() {
    const auth = useAuth();
    const app = useApp();
    const location = useLocation();
    useEffect(() => {
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (auth) {
                    const path = window.location.pathname;
                    if (error?.request?.status === 401 && path !== "/") {
                        app.flashMsg("Unable to complete the request", error.request?.response, 'error');
                        return auth.logout(path);
                    }
                }

                // reject error. Error will be handle by calling page.
                throw error;
            }
        );
    }, []);

    useEffect(() => {
        app.closeDialogs();
    }, [location])
}