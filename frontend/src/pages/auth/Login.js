import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Messages } from 'primereact/messages';
import { useRef } from 'react';
import { BackgroundVideo } from 'components/BackgroundVideo';
import { GlassCard } from 'components/GlassCard';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const messages = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            messages.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: location.state.message,
                life: 5000
            });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        messages.current.clear();

        try {
            await login(username, password);
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               'Error al iniciar sesión';
            
            messages.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <BackgroundVideo />
            <div className="flex align-items-center justify-content-center min-h-screen backdrop-blur-sm">
                <div className="w-full md:w-6 lg:w-4 px-4 transition-all duration-300 hover:scale-105">
                    <GlassCard>
                        <div className="text-center mb-5">
                            <i className="pi pi-user-circle text-6xl text-primary mb-3"></i>
                            <div className="text-900 text-3xl font-bold mb-3">¡Bienvenido!</div>
                            <span className="text-600 font-medium">Ingresa tus credenciales para continuar</span>
                        </div>

                        <Messages ref={messages} className="mb-4" />
                        
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <div className="field mb-4">
                                <span className="p-float-label p-input-icon-right">
                                    <i className="pi pi-user" />
                                    <InputText 
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="p-inputtext-lg"
                                        required
                                    />
                                    <label htmlFor="username">Usuario o Correo</label>
                                </span>
                            </div>

                            <div className="field mb-4">
                                <span className="p-float-label">
                                    <Password
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        toggleMask
                                        className="p-inputtext-lg"
                                        feedback={false}
                                        required
                                    />
                                    <label htmlFor="password">Contraseña</label>
                                </span>
                            </div>

                            <Button 
                                type="submit" 
                                label="Ingresar" 
                                icon="pi pi-sign-in"
                                loading={loading}
                                disabled={loading}
                                className="p-button-lg mb-3"
                            />
                            
                            <div className="text-center">
                                <span className="text-600">¿No tienes cuenta?</span>
                                <Link 
                                    to="/auth/register" 
                                    className="font-medium text-blue-500 hover:text-blue-700 ml-2 no-underline hover:underline"
                                >
                                    Regístrate aquí
                                </Link>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </>
    );
}
