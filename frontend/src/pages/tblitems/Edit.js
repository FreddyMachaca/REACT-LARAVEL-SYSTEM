import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

const TblitemsEditPage = (props) => {
    const app = useApp();
    const { pageid } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [itemDetails, setItemDetails] = useState({});
    const [formData, setFormData] = useState({
        ca_eo_id: '',
        ca_ti_item: '',
        ca_es_id: '',
        ca_tipo_jornada: ''
    });
    
    const [escalaOptions, setEscalaOptions] = useState([]);
    const [estructuraOptions, setEstructuraOptions] = useState([]);
    const [tipoItemOptions, setTipoItemOptions] = useState([]);
    const [cargoDetails, setCargoDetails] = useState({
        codigoEscalafon: '',
        clase: '',
        nivelSalarial: '',
        haberBasico: ''
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const itemResponse = await axios.get(`/tblitems/getItemForEdit/${pageid}`);
                const data = itemResponse.data;
                
                if (!data || !data.id) {
                    throw new Error("No se pudo cargar la información del item");
                }
                
                setItemDetails(data);
            
                setFormData({
                    ca_eo_id: data?.cargo_original?.ca_eo_id || '',
                    ca_ti_item: data?.cargo_original?.ca_ti_item || '',
                    ca_es_id: data?.cargo_original?.ca_es_id || '',
                    ca_tipo_jornada: data?.cargo_original?.ca_tipo_jornada || 'TT'
                });
                
                setCargoDetails({
                    codigoEscalafon: data?.escala_original?.es_escalafon || 'No disponible',
                    clase: data?.nivel_original?.ns_clase || 'No disponible',
                    nivelSalarial: data?.nivel_original?.ns_nivel || 'No disponible',
                    haberBasico: data?.nivel_original?.ns_haber_basico ? 
                        new Intl.NumberFormat('es-BO', { 
                            style: 'currency', 
                            currency: 'BOB' 
                        }).format(data.nivel_original.ns_haber_basico) : 'No disponible'
                });

                const optionsResponse = await axios.get('/tblitems/options');
                const opts = optionsResponse.data;
                
                setEscalaOptions(opts.escalaOptions.map(opt => ({
                    value: opt.es_id, 
                    label: opt.es_descripcion,
                    es_escalafon: opt.es_escalafon || '',
                    ns_clase: opt.ns_clase || '',
                    ns_nivel: opt.ns_nivel || '',
                    ns_haber_basico: opt.ns_haber_basico || ''
                })));
                
                setEstructuraOptions(opts.estructuraOptions.map(opt => ({ 
                    value: opt.eo_id, 
                    label: opt.eo_descripcion 
                })));
                
                // Para tipo item, concatenamos: ti_item - ti_descripcion y, si es "P", añadimos ti_tipo
                setTipoItemOptions(opts.tipoItems.map(item => ({
                    value: item.ti_item,
                    label: item.ti_item === 'P' 
                        ? `${item.ti_item} - ${item.ti_descripcion} - ${item.ti_tipo}`
                        : `${item.ti_item} - ${item.ti_descripcion}`
                })));
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setApiError(error.message || "Error al cargar los datos");
                setLoading(false);
            }
        };
        
        if (pageid) fetchData();
    }, [pageid]);
    
    const handleDropdownChange = (e, fieldName) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: e.value
        }));
        
        if (fieldName === 'ca_es_id') {
            handleCargoChange(e);
        }
    };
    
    const handleCargoChange = (e) => {
        const selectedEscala = escalaOptions.find(option => option.value === e.value);
        
        if (selectedEscala) {
            setCargoDetails({
                codigoEscalafon: selectedEscala.es_escalafon || 'No disponible',
                clase: selectedEscala.ns_clase || 'No disponible',
                nivelSalarial: selectedEscala.ns_nivel || 'No disponible',
                haberBasico: selectedEscala.ns_haber_basico ? 
                    new Intl.NumberFormat('es-BO', { 
                        style: 'currency', 
                        currency: 'BOB' 
                    }).format(selectedEscala.ns_haber_basico) : 'No disponible'
            });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            await axios.post(`/tblitems/edit/${pageid}`, formData);
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
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
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
                
                <Card title="Detalles del Item" className="mb-3">
                    <div className="grid">
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Código Item</div>
                                    <div className="font-bold">{itemDetails.codigo || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Código Escalafón</div>
                                    <div className="font-bold">{itemDetails.escala_original?.es_escalafon || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Clase</div>
                                    <div className="font-bold">{itemDetails.nivel_original?.ns_clase || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Nivel</div>
                                    <div className="font-bold">{itemDetails.nivel_original?.ns_nivel || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Tipo Item</div>
                                    <div className="font-bold">{itemDetails.tipo_item_descripcion || itemDetails.cargo_original?.ca_ti_item || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Haber Básico</div>
                                    <div className="font-bold text-primary">
                                        {itemDetails.nivel_original?.ns_haber_basico 
                                            ? new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(itemDetails.nivel_original.ns_haber_basico)
                                            : 'No disponible'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Categoría Programática</div>
                                    <div className="font-bold">{itemDetails.categoria_programatica || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Fecha Creación</div>
                                    <div className="font-bold">
                                        {itemDetails.fecha_creacion ? 
                                            new Date(itemDetails.fecha_creacion).toLocaleDateString('es-BO', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            }) : 'No disponible'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                
                <Card title="Editar Información" className="mb-3">
                    <form onSubmit={handleSubmit}>
                        <div className="grid formgrid p-fluid">
                            <div className="col-12 md:col-6 mb-3">
                                <label className="block font-bold mb-2">Unidad Organizacional *</label>
                                <Dropdown
                                    value={formData.ca_eo_id}
                                    options={estructuraOptions}
                                    onChange={(e) => handleDropdownChange(e, 'ca_eo_id')}
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Seleccione una unidad organizacional"
                                    className="w-full"
                                    filter
                                    required
                                />
                            </div>
                            
                            <div className="col-12 md:col-6 mb-3">
                                <label className="block font-bold mb-2">Tipo Item *</label>
                                <Dropdown
                                    value={formData.ca_ti_item}
                                    options={tipoItemOptions}
                                    onChange={(e) => handleDropdownChange(e, 'ca_ti_item')}
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Seleccione un tipo de item"
                                    className="w-full"
                                    required
                                />
                            </div>
                            
                            <div className="col-12 md:col-6 mb-3">
                                <label className="block font-bold mb-2">Cargo *</label>
                                <Dropdown
                                    value={formData.ca_es_id}
                                    options={escalaOptions}
                                    onChange={(e) => handleDropdownChange(e, 'ca_es_id')}
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Seleccione un cargo"
                                    className="w-full"
                                    filter
                                    required
                                />
                            </div>
                            
                            <div className="col-12 md:col-6 mb-3">
                                <label className="block font-bold mb-2">Tipo Jornada *</label>
                                <Dropdown
                                    value={formData.ca_tipo_jornada}
                                    options={[
                                        { label: 'Tiempo Completo', value: 'TT' },
                                        { label: 'Medio Tiempo', value: 'MT' }
                                    ]}
                                    onChange={(e) => handleDropdownChange(e, 'ca_tipo_jornada')}
                                    placeholder="Seleccione el tipo de jornada"
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
