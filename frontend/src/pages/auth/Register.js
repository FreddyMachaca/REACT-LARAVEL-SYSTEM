import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { useRef } from 'react';
import { RadioButton } from 'primereact/radiobutton';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const messages = useRef(null);
    
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: '',
        message: '',
        type: 'info'
    });

    const [formData, setFormData] = useState({
        per_nombres: '',
        per_ap_paterno: '',
        per_ap_materno: '',
        per_num_doc: '',
        per_sexo: 'M',
        usuario: '',
        correo: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showDialog = (title, message, type = 'info') => {
        setDialogContent({
            title,
            message,
            type
        });
        setDialogVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            showDialog(
                'Registro Exitoso',
                'Tu cuenta ha sido creada correctamente. Serás redirigido al login.',
                'success'
            );
            setTimeout(() => {
                navigate('/auth/login', { 
                    state: { 
                        message: 'Cuenta creada exitosamente. Por favor inicia sesión.' 
                    }
                });
            }, 2000);
        } catch (error) {
            console.error('Error details:', error);
            
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => `• ${err}`).join('\n');
                showDialog(
                    'Error de Validación',
                    errorMessages,
                    'error'
                );
            } else if (error.error) {
                showDialog(
                    'Error',
                    error.error,
                    'error'
                );
            } else {
                showDialog(
                    'Error',
                    'Ha ocurrido un error al registrar el usuario. Por favor, inténtalo de nuevo.',
                    'error'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const dialogFooter = (
        <div>
            <Button 
                label="OK" 
                icon="pi pi-check" 
                onClick={() => setDialogVisible(false)}
                autoFocus 
            />
        </div>
    );

    return (
        <div className="flex align-items-center justify-content-center min-h-screen bg-gradient-to-br from-indigo-900 to-blue-500">
            <div className="w-full md:w-8 lg:w-6 xl:w-4 px-4">
                <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-round-xl p-4">
                    <div className="text-center mb-5">
                        <i className="pi pi-user-plus text-6xl text-primary mb-3"></i>
                        <div className="text-900 text-3xl font-bold mb-3">Crear Cuenta</div>
                        <span className="text-600 font-medium">Completa los datos para registrarte</span>
                    </div>

                    <Messages ref={messages} className="mb-4" />
                    
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="grid formgrid">
                            <div className="col-12 md:col-4 field mb-4">
                                <span className="p-float-label">
                                    <InputText 
                                        name="per_nombres" 
                                        value={formData.per_nombres} 
                                        onChange={handleInputChange}
                                        className="p-inputtext-lg"
                                        required 
                                    />
                                    <label>Nombres</label>
                                </span>
                            </div>
                            
                            <div className="col-12 md:col-4 field mb-4">
                                <span className="p-float-label">
                                    <InputText 
                                        name="per_ap_paterno" 
                                        value={formData.per_ap_paterno} 
                                        onChange={handleInputChange}
                                        className="p-inputtext-lg"
                                        required 
                                    />
                                    <label>Apellido Paterno</label>
                                </span>
                            </div>
                            
                            <div className="col-12 md:col-4 field mb-4">
                                <span className="p-float-label">
                                    <InputText 
                                        name="per_ap_materno" 
                                        value={formData.per_ap_materno} 
                                        onChange={handleInputChange}
                                        className="p-inputtext-lg"
                                        required 
                                    />
                                    <label>Apellido Materno</label>
                                </span>
                            </div>
                            
                            <div className="col-12 md:col-6 field mb-4">
                                <span className="p-float-label">
                                    <InputText 
                                        name="per_num_doc" 
                                        value={formData.per_num_doc} 
                                        onChange={handleInputChange}
                                        className="p-inputtext-lg"
                                        required 
                                    />
                                    <label>CI</label>
                                </span>
                            </div>
                            
                            <div className="col-12 md:col-6 field mb-4">
                                <label className="block mb-2">Sexo</label>
                                <div className="flex gap-4 p-2 border-1 border-round surface-border">
                                    <div className="flex align-items-center">
                                        <RadioButton 
                                            inputId="sexoM" 
                                            name="per_sexo" 
                                            value="M" 
                                            onChange={handleInputChange} 
                                            checked={formData.per_sexo === 'M'} 
                                        />
                                        <label htmlFor="sexoM" className="ml-2">Masculino</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton 
                                            inputId="sexoF" 
                                            name="per_sexo" 
                                            value="F" 
                                            onChange={handleInputChange} 
                                            checked={formData.per_sexo === 'F'} 
                                        />
                                        <label htmlFor="sexoF" className="ml-2">Femenino</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="surface-card p-4 border-round mb-4">
                                    <h3 className="text-xl mb-4 font-medium">Información de Cuenta</h3>
                                    <div className="grid formgrid">
                                        <div className="col-12 md:col-6 field mb-4">
                                            <span className="p-float-label">
                                                <InputText 
                                                    name="usuario" 
                                                    value={formData.usuario} 
                                                    onChange={handleInputChange}
                                                    className="p-inputtext-lg"
                                                    required 
                                                />
                                                <label>Usuario</label>
                                            </span>
                                        </div>
                                        
                                        <div className="col-12 md:col-6 field mb-4">
                                            <span className="p-float-label">
                                                <InputText 
                                                    type="email" 
                                                    name="correo" 
                                                    value={formData.correo} 
                                                    onChange={handleInputChange}
                                                    className="p-inputtext-lg"
                                                    required 
                                                />
                                                <label>Correo</label>
                                            </span>
                                        </div>
                                        
                                        <div className="col-12 field mb-4">
                                            <span className="p-float-label">
                                                <Password 
                                                    name="password" 
                                                    value={formData.password} 
                                                    onChange={handleInputChange}
                                                    className="p-inputtext-lg"
                                                    required 
                                                    toggleMask
                                                />
                                                <label>Contraseña</label>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-12 flex justify-content-between gap-2">
                                <Button 
                                    type="submit" 
                                    label="Registrar" 
                                    icon="pi pi-user-plus"
                                    loading={loading}
                                    disabled={loading}
                                    className="p-button-lg flex-1"
                                />
                                
                                <Button 
                                    type="button" 
                                    label="Volver al Login" 
                                    icon="pi pi-arrow-left"
                                    className="p-button-outlined p-button-secondary p-button-lg flex-1"
                                    onClick={() => navigate('/auth/login')}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </form>
                </Card>
            </div>

            <Dialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                header={dialogContent.title}
                footer={dialogFooter}
                className={`dialog-${dialogContent.type} border-round-xl backdrop-blur-sm`}
                breakpoints={{'960px': '75vw', '641px': '90vw'}}
                style={{ width: '50vw' }}
            >
                <div className="flex align-items-center gap-3">
                    <i className={`pi ${
                        dialogContent.type === 'error' ? 'pi-times-circle text-red-500' :
                        dialogContent.type === 'success' ? 'pi-check-circle text-green-500' :
                        'pi-info-circle text-blue-500'
                    } text-5xl`}></i>
                    <div className="text-xl" style={{whiteSpace: 'pre-line'}}>
                        {dialogContent.message}
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
