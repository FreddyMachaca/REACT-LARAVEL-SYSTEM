import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'primereact/card';

const TblitemsEditPage = (props) => {
    const app = useApp();
    const { pageid } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [item, setItem] = useState({
        ca_ti_item: '',
        ca_num_item: '',
        ca_es_id: '',
        ca_eo_id: ''
    });
    
    const [escalaOptions, setEscalaOptions] = useState([]);
    const [estructuraOptions, setEstructuraOptions] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const itemResponse = await axios.get(`/tblitems/view/${pageid}`);
                const itemData = itemResponse.data;
                
                if (!itemData || !itemData.id) {
                    throw new Error("No se pudo cargar la información del item");
                }
                
                setItem({
                    ca_ti_item: itemData.cargo_original.ca_ti_item || '',
                    ca_num_item: itemData.cargo_original.ca_num_item || '',
                    ca_es_id: itemData.cargo_original.ca_es_id || '',
                    ca_eo_id: itemData.cargo_original.ca_eo_id || ''
                });
                
                const optionsResponse = await axios.get('/tblitems/options');
                setEscalaOptions(optionsResponse.data.escalaOptions.map(opt => ({ 
                    value: opt.es_id, 
                    label: opt.es_descripcion 
                })));
                
                setEstructuraOptions(optionsResponse.data.estructuraOptions.map(opt => ({ 
                    value: opt.eo_id, 
                    label: opt.eo_descripcion 
                })));
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setApiError(error.message || "Error al cargar los datos");
                setLoading(false);
            }
        };
        
        if (pageid) {
            fetchData();
        }
    }, [pageid]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleDropdownChange = (e, fieldName) => {
        setItem(prevState => ({
            ...prevState,
            [fieldName]: e.value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            
            await axios.post(`/tblitems/edit/${pageid}`, item);
            
            app.flashMsg("Éxito", "Registro actualizado correctamente");
            app.navigate('/tblitems');
        } catch (error) {
            console.error("Error saving data:", error);
            setApiError(error.message || "Error al guardar los datos");
            setSaving(false);
        }
    };
    
    if (loading) {
        return (
            <div className="p-3 text-center">
                <ProgressSpinner style={{width:'50px', height:'50px'}} />
                <div className="font-bold text-lg mt-2">Cargando...</div>
            </div>
        );
    }
    
    if (apiError) {
        return (
            <div className="p-3 text-center">
                <div className="text-xl text-red-500 mb-3">Error</div>
                <div>{apiError}</div>
                <Button 
                    label="Volver" 
                    icon="pi pi-arrow-left" 
                    className="mt-3"
                    onClick={() => app.navigate('/tblitems')} 
                />
            </div>
        );
    }
    
    return (
        <div>
            <main id="TblitemsEditPage" className="main-page">
                <section className="page-section mb-3">
                    <div className="container">
                        <div className="grid justify-content-between align-items-center">
                            <div className="col-fixed">
                                <Button onClick={() => app.navigate('/tblitems')} label="" className="p-button p-button-text" icon="pi pi-arrow-left" />
                            </div>
                            <div className="col">
                                <Title title="Editar Item" titleClass="text-2xl text-primary font-bold" separator={false} />
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="page-section">
                    <div className="container">
                        <div className="grid">
                            <div className="col-12">
                                <Card>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid formgrid p-fluid">
                                            <div className="col-12 md:col-6 mb-3">
                                                <label htmlFor="ca_ti_item" className="font-medium text-900 mb-2 block">Tipo de Item</label>
                                                <InputText
                                                    id="ca_ti_item"
                                                    name="ca_ti_item"
                                                    value={item.ca_ti_item}
                                                    onChange={handleInputChange}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="col-12 md:col-6 mb-3">
                                                <label htmlFor="ca_num_item" className="font-medium text-900 mb-2 block">Número de Item</label>
                                                <InputText
                                                    id="ca_num_item"
                                                    name="ca_num_item"
                                                    value={item.ca_num_item}
                                                    onChange={handleInputChange}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="col-12 md:col-6 mb-3">
                                                <label htmlFor="ca_es_id" className="font-medium text-900 mb-2 block">Cargo</label>
                                                <Dropdown
                                                    id="ca_es_id"
                                                    value={item.ca_es_id}
                                                    options={escalaOptions}
                                                    onChange={(e) => handleDropdownChange(e, 'ca_es_id')}
                                                    optionValue="value"
                                                    optionLabel="label"
                                                    placeholder="Seleccione un cargo"
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="col-12 md:col-6 mb-3">
                                                <label htmlFor="ca_eo_id" className="font-medium text-900 mb-2 block">Unidad Organizacional</label>
                                                <Dropdown
                                                    id="ca_eo_id"
                                                    value={item.ca_eo_id}
                                                    options={estructuraOptions}
                                                    onChange={(e) => handleDropdownChange(e, 'ca_eo_id')}
                                                    optionValue="value"
                                                    optionLabel="label"
                                                    placeholder="Seleccione una unidad organizacional"
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="col-12 mt-3 text-right">
                                                <Button 
                                                    label="Cancelar" 
                                                    icon="pi pi-times" 
                                                    className="p-button-text mr-2" 
                                                    onClick={() => app.navigate('/tblitems')}
                                                    type="button"
                                                />
                                                <Button 
                                                    label="Guardar" 
                                                    icon="pi pi-save" 
                                                    className="p-button-primary" 
                                                    type="submit"
                                                    loading={saving}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

TblitemsEditPage.defaultProps = {
    pageName: 'tblitems',
    apiPath: 'tblitems/edit',
    routeName: 'tblitemsedit',
};

export default TblitemsEditPage;
