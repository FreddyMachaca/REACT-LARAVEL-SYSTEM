import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_PATH;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(JSON.parse(localStorage.getItem('user')));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${apiUrl}auth/login`, {
                username,
                password
            });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(`${apiUrl}auth/register`, userData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const changePassword = async (passwordData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró token de autenticación');
            
            const response = await axios.post(`${apiUrl}auth/change-password`, passwordData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Error en cambio de contraseña:', error);
            throw error.response?.data || error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, changePassword, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
