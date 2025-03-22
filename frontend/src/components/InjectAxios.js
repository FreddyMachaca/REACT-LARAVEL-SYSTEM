import { useEffect } from 'react';
import axios from 'axios';
import useAuth from 'hooks/useAuth';
import useApp from 'hooks/useApp';
import { useLocation, useNavigate } from 'react-router-dom';

axios.defaults.baseURL = process.env.REACT_APP_API_PATH;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default function InjectAxios() {
    const auth = useAuth();
    const app = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Interceptor de solicitud para incluir token
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor de respuesta para manejar errores
        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (auth) {
                    const path = window.location.pathname;
                    if (error?.request?.status === 401 && path !== "/auth/login" && path !== "/auth/register") {
                        app.flashMsg("Sesión expirada", "Por favor inicie sesión nuevamente", 'error');
                        auth.logout();
                        navigate('/auth/login');
                        return Promise.reject(error);
                    }
                }

                // reject error. Error will be handle by calling page.
                throw error;
            }
        );
        
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [auth, app, navigate]);

    useEffect(() => {
        app.closeDialogs();
    }, [location, app]);
}