import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Title } from 'components/Title';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import useApp from 'hooks/useApp';
import axios from 'axios';

const TblasignacionView = () => {
    const { personaId } = useParams();
    const app = useApp();
    const [loading, setLoading] = useState(true);
    const [persona, setPersona] = useState(null);
    const [tieneItem, setTieneItem] = useState(null);
    const [itemNumber, setItemNumber] = useState('');
    const [tiposAlta] = useState([
        { label: 'Nuevo', value: 'N' },
        { label: 'Reingreso', value: 'R' },
        { label: 'Transferencia', value: 'T' }
    ]);
    const [selectedTipoAlta, setSelectedTipoAlta] = useState(null);

    useEffect(() => {
        const loadPersona = async () => {
            try {
                const response = await axios.get(`/tblpersona/view/${personaId}`);
                setPersona(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading persona:', error);
                app.flashMsg('Error', 'No se pudo cargar los datos de la persona', 'error');
                setLoading(false);
            }
        };

        if (personaId) {
            loadPersona();
        }
    }, [personaId]);

    const PersonaCard = () => (
        <Card title="Información de la Persona" className="mb-3">
            <div className="grid">
                <div className="col-12 md:col-6 lg:col-3">
                    <label className="block text-600">CI</label>
                    <div className="text-900 font-medium">{persona?.per_num_doc}</div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <label className="block text-600">Nombres</label>
                    <div className="text-900 font-medium">{persona?.per_nombres}</div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <label className="block text-600">Apellido Paterno</label>
                    <div className="text-900 font-medium">{persona?.per_ap_paterno}</div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <label className="block text-600">Apellido Materno</label>
                    <div className="text-900 font-medium">{persona?.per_ap_materno}</div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <label className="block text-600">Estado Item</label>
                    <div className={`text-900 font-medium ${persona?.tiene_item ? 'text-green-500' : 'text-red-500'}`}>
                        {persona?.tiene_item ? (
                            <>
                                <i className="pi pi-check-circle mr-2"></i>
                                Tiene Item ({persona?.ca_ti_item}-{persona?.ca_num_item})
                            </>
                        ) : (
                            <>
                                <i className="pi pi-times-circle mr-2"></i>
                                Sin Item Asignado
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );

    const BusquedaItemCard = () => (
        <Card title="Búsqueda de Item" className="mb-3">
            <div className="grid">
                <div className="col-12">
                    <label className="block text-600 mb-2">¿Tiene número de item?</label>
                    <div className="flex gap-4">
                        <div className="flex align-items-center">
                            <RadioButton 
                                inputId="si" 
                                value="si" 
                                checked={tieneItem === 'si'} 
                                onChange={e => setTieneItem(e.value)}
                            />
                            <label htmlFor="si" className="ml-2">Sí</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton 
                                inputId="no" 
                                value="no" 
                                checked={tieneItem === 'no'} 
                                onChange={e => setTieneItem(e.value)}
                            />
                            <label htmlFor="no" className="ml-2">No</label>
                        </div>
                    </div>
                </div>
                {tieneItem === 'si' && (
                    <div className="col-12 md:col-6">
                        <label htmlFor="itemNumber" className="block text-600 mb-2">Número de Item</label>
                        <InputText 
                            id="itemNumber"
                            value={itemNumber}
                            onChange={e => setItemNumber(e.target.value)}
                            className="w-full"
                            placeholder="Ingrese el número de item"
                        />
                    </div>
                )}
            </div>
        </Card>
    );

    const DatosRequeridosCard = () => (
        <Card title="Datos Requeridos" className="mb-3">
            <div className="grid">
                <div className="col-12 md:col-6">
                    <label htmlFor="tipoAlta" className="block text-600 mb-2">Tipo de Alta</label>
                    <Dropdown
                        id="tipoAlta"
                        value={selectedTipoAlta}
                        options={tiposAlta}
                        onChange={e => setSelectedTipoAlta(e.value)}
                        className="w-full"
                        placeholder="Seleccione el tipo de alta"
                    />
                </div>
            </div>
        </Card>
    );

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="card">
            <Title title="Administración de Asignación" />
            
            <PersonaCard />
            
            {persona?.tiene_item ? (
                <Card className="mb-3 border-yellow-500">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-exclamation-triangle text-yellow-500 text-xl"></i>
                        <span>Esta persona ya tiene un item asignado. No se puede realizar una nueva asignación.</span>
                    </div>
                </Card>
            ) : (
                <>
                    <BusquedaItemCard />
                    <DatosRequeridosCard />
                </>
            )}

            <div className="flex justify-content-end gap-2">
                <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    className="p-button-text"
                    onClick={() => app.navigate('/asignacionItems')}
                />
                {!persona?.tiene_item && (
                    <Button 
                        label="Continuar" 
                        icon="pi pi-arrow-right"
                        onClick={() => {
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default TblasignacionView;
