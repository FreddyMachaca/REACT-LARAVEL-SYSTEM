import React, { useState, useRef } from 'react';
import useAuth from 'hooks/useAuth';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { TabView, TabPanel } from 'primereact/tabview';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';

export default function UserProfile() {
    const { user, logout, changePassword } = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };
    
    const submitPasswordChange = async () => {
        if (!passwordData.currentPassword) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe ingresar su contraseña actual' });
            return;
        }
        
        if (!passwordData.newPassword) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe ingresar una nueva contraseña' });
            return;
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' });
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }
        
        setLoading(true);
        try {
            // Llamada al API para cambiar la contraseña
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Contraseña actualizada correctamente. Por favor, inicie sesión nuevamente.',
                life: 5000
            });
            
            // Limpiar el formulario
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            // Cerrar sesión después de un cambio de contraseña exitoso
            setTimeout(() => {
                logout();
            }, 3000);
            
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: error.message || 'Error al cambiar la contraseña' 
            });
        } finally {
            setLoading(false);
        }
    };
    
    const getUserFullName = () => {
        if (!user) return 'Usuario';
        
        return `${user.persona?.per_nombres || ''} ${user.persona?.per_ap_paterno || ''} ${user.persona?.per_ap_materno || ''}`.trim();
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            
            <div className="col-12">
                <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>
                <p className="text-lg text-700 mb-5">Gestiona tu información personal y seguridad</p>
            </div>
            
            <div className="col-12 lg:col-4">
                <Card className="h-full shadow-4">
                    <div className="flex flex-column align-items-center text-center mb-4">
                        <Avatar 
                            icon="pi pi-user" 
                            size="xlarge" 
                            style={{ width: '100px', height: '100px', backgroundColor: '#3B82F6', color: '#ffffff', fontSize: '3rem' }} 
                            shape="circle"
                        />
                        <h2 className="mt-3 mb-1 text-xl font-bold">{getUserFullName()}</h2>
                        <p className="text-600">{user?.us_usuario || 'Usuario'}</p>
                    </div>
                    
                    <Divider />
                    
                    <div className="mt-4">
                        <h3 className="font-semibold mb-3">Información de contacto</h3>
                        <div className="mb-3">
                            <div className="flex align-items-center">
                                <i className="pi pi-envelope mr-2 text-500"></i>
                                <span>{user?.us_correo_interno || 'No disponible'}</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="flex align-items-center">
                                <i className="pi pi-id-card mr-2 text-500"></i>
                                <span>CI: {user?.persona?.per_num_doc || 'No disponible'}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            
            <div className="col-12 lg:col-8">
                <Card className="shadow-4">
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header="Información Personal" leftIcon="pi pi-user mr-2">
                            <div className="grid">
                                <div className="col-12 lg:col-6 mb-4">
                                    <label className="block text-900 font-medium mb-2">Nombres</label>
                                    <InputText 
                                        value={user?.persona?.per_nombres || ''} 
                                        disabled 
                                        className="w-full p-inputtext-sm" 
                                    />
                                </div>
                                <div className="col-12 lg:col-6 mb-4">
                                    <label className="block text-900 font-medium mb-2">Apellido Paterno</label>
                                    <InputText 
                                        value={user?.persona?.per_ap_paterno || ''} 
                                        disabled 
                                        className="w-full p-inputtext-sm" 
                                    />
                                </div>
                                <div className="col-12 lg:col-6 mb-4">
                                    <label className="block text-900 font-medium mb-2">Apellido Materno</label>
                                    <InputText 
                                        value={user?.persona?.per_ap_materno || ''} 
                                        disabled 
                                        className="w-full p-inputtext-sm" 
                                    />
                                </div>
                                <div className="col-12 lg:col-6 mb-4">
                                    <label className="block text-900 font-medium mb-2">CI</label>
                                    <InputText 
                                        value={user?.persona?.per_num_doc || ''} 
                                        disabled 
                                        className="w-full p-inputtext-sm" 
                                    />
                                </div>
                                <div className="col-12 lg:col-6 mb-4">
                                    <label className="block text-900 font-medium mb-2">Sexo</label>
                                    <InputText 
                                        value={user?.persona?.per_sexo === 'M' ? 'Masculino' : user?.persona?.per_sexo === 'F' ? 'Femenino' : ''} 
                                        disabled 
                                        className="w-full p-inputtext-sm" 
                                    />
                                </div>
                                <div className="col-12 lg:col-6 mb-4">
                                    <label className="block text-900 font-medium mb-2">Usuario</label>
                                    <InputText 
                                        value={user?.us_usuario || ''} 
                                        disabled 
                                        className="w-full p-inputtext-sm" 
                                    />
                                </div>
                                <div className="col-12 mb-4">
                                    <label className="block text-900 font-medium mb-2">Correo</label>
                                    <InputText 
                                        value={user?.us_correo_interno || ''} 
                                        disabled 
                                        className="w-full p-inputtext-sm" 
                                    />
                                </div>
                            </div>
                        </TabPanel>
                        
                        <TabPanel header="Cambiar Contraseña" leftIcon="pi pi-lock mr-2">
                            {loading && <ProgressBar mode="indeterminate" style={{height: '6px'}} className="mb-4" />}
                            
                            <div className="grid">
                                <div className="col-12 mb-4">
                                    <label className="block text-900 font-medium mb-2">Contraseña Actual</label>
                                    <Password 
                                        name="currentPassword"
                                        value={passwordData.currentPassword} 
                                        onChange={handlePasswordChange}
                                        toggleMask 
                                        className="w-full" 
                                        feedback={false}
                                    />
                                </div>
                                <div className="col-12 mb-4">
                                    <label className="block text-900 font-medium mb-2">Nueva Contraseña</label>
                                    <Password 
                                        name="newPassword"
                                        value={passwordData.newPassword} 
                                        onChange={handlePasswordChange}
                                        toggleMask 
                                        className="w-full" 
                                        promptLabel="Ingrese una contraseña"
                                        weakLabel="Débil"
                                        mediumLabel="Media"
                                        strongLabel="Fuerte"
                                    />
                                </div>
                                <div className="col-12 mb-4">
                                    <label className="block text-900 font-medium mb-2">Confirmar Nueva Contraseña</label>
                                    <Password 
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword} 
                                        onChange={handlePasswordChange}
                                        toggleMask 
                                        className="w-full" 
                                        feedback={false}
                                    />
                                </div>
                                <div className="col-12 mt-3">
                                    <Button 
                                        label="Cambiar Contraseña" 
                                        icon="pi pi-save" 
                                        className="w-full p-button-raised" 
                                        onClick={submitPasswordChange}
                                        loading={loading}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </TabPanel>
                    </TabView>
                </Card>
            </div>
        </div>
    );
}
