import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';

const TblTipoAportanteView = () => {
    const { personaId } = useParams();
    const app = useApp();
    
    const [persona, setPersona] = useState(null);
    const [edad, setEdad] = useState(0);

    const [aportaSIP, setAportaSIP] = useState(null);
    const [esJubilado, setEsJubilado] = useState(null);
    const [tipoAportanteOptions, setTipoAportanteOptions] = useState([]);
    const [selectedTipoAportante, setSelectedTipoAportante] = useState(null);
    
    const [loadingPersona, setLoadingPersona] = useState(true);
    const [loadingTipos, setLoadingTipos] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const siNoOptions = [
        { label: 'Sí', value: true },
        { label: 'No', value: false }
    ];
    
    // Calcular la edad a partir de la fecha de nacimiento
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 0;
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const [personaInfo, setPersonaInfo] = useState(null);

    // Agregar estados para la glosa
    const [showGlosaDialog, setShowGlosaDialog] = useState(false);
    const [glosaFormData, setGlosaFormData] = useState({
        gl_tipo_doc: '',
        gl_numero_doc: '',
        gl_fecha_doc: null,
        gl_glosa: ''
    });
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [savingGlosa, setSavingGlosa] = useState(false);

    useEffect(() => {
        const fetchPersonaInfo = async () => {
            try {
                setLoadingPersona(true);
                const [personaResponse, infoResponse] = await Promise.all([
                    axios.get(`/tblpersona/view/${personaId}`),
                    axios.get(`/tbltipoaportante/personaInfo/${personaId}`)
                ]);
                
                setPersona(personaResponse.data);
                setPersonaInfo(infoResponse.data);
                const calculatedEdad = calcularEdad(personaResponse.data.per_fecha_nac);
                setEdad(calculatedEdad);
                setLoadingPersona(false);
            } catch (error) {
                app.flashMsg('Error', `Error al cargar datos: ${error.message}`, 'error');
                setLoadingPersona(false);
            }
        };
        
        fetchPersonaInfo();
    }, [personaId, app]);
    
    // Filtrar tipos de aportante según edad y si es jubilado o no
    useEffect(() => {
        const fetchTipoAportante = async () => {
            if (aportaSIP === null || esJubilado === null) return;
            
            try {
                setLoadingTipos(true);
                const response = await axios.get('/tbltipoaportante');
                
                let filteredTipos = [];
                const allTipos = response.data.data || [];
                const esMayor65 = edad >= 65;
                
                if (esJubilado) {
                    // Es jubilado (3,4,5,6)
                    if (esMayor65) {
                        // Mayor a 65 años (4,6)
                        filteredTipos = allTipos.filter(tipo => 
                            [4, 6].includes(tipo.ta_id)
                        );
                    } else {
                        // Menor a 65 años (3,5)
                        filteredTipos = allTipos.filter(tipo => 
                            [3, 5].includes(tipo.ta_id)
                        );
                    }
                } else {
                    // Es rentista (7,8,9,10)
                    if (esMayor65) {
                        // Mayor a 65 años (8,10)
                        filteredTipos = allTipos.filter(tipo => 
                            [8, 10].includes(tipo.ta_id)
                        );
                    } else {
                        // Menor a 65 años (7,9)
                        filteredTipos = allTipos.filter(tipo => 
                            [7, 9].includes(tipo.ta_id)
                        );
                    }
                }
                
                setTipoAportanteOptions(filteredTipos.map(tipo => ({
                    label: tipo.ta_descripcion,
                    value: tipo.ta_id,
                    tipo: tipo
                })));
                
                setLoadingTipos(false);
            } catch (error) {
                app.flashMsg('Error', `Error al cargar tipos de aportante: ${error.message}`, 'error');
                setLoadingTipos(false);
            }
        };
        
        fetchTipoAportante();
    }, [aportaSIP, esJubilado, edad, app]);

    useEffect(() => {
        const loadTiposDocumento = async () => {
            try {
                const response = await axios.get('/tblcatalogo/byTipo/tipo_documento_impreso');
                setTiposDocumento(response.data.map(tipo => ({
                    value: tipo.cat_id,
                    label: tipo.cat_descripcion
                })));
            } catch (error) {
                console.error('Error loading tipos documento:', error);
            }
        };
        
        loadTiposDocumento();
    }, []);
    
    const handleSave = async () => {
        if (!selectedTipoAportante) {
            app.flashMsg('Advertencia', 'Debe seleccionar un tipo de aportante', 'warn');
            return;
        }

        setShowGlosaDialog(true);
    };

    const handleGlosaSubmit = async () => {
        try {
            setSavingGlosa(true);
            
            // Guardar la asignación
            const asignacionData = {
                at_per_id: parseInt(personaId),
                at_ta_id: selectedTipoAportante.value,
                at_estado: 'V'
            };

            const asignacionResponse = await axios.post('/tblmpasignaciontipoaportante/add', asignacionData);
            
            if (!asignacionResponse.data || !asignacionResponse.data.at_id) {
                throw new Error('No se pudo obtener el ID de la asignación');
            }

            // Guardar la glosa
            const glosaData = {
                gl_valor_pk: asignacionResponse.data.at_id,
                gl_nombre_pk: 'at_id',
                gl_tabla: 'tbl_mp_asignacion_tipo_aportante',
                gl_tipo_doc: parseInt(glosaFormData.gl_tipo_doc),
                gl_numero_doc: glosaFormData.gl_numero_doc,
                gl_fecha_doc: glosaFormData.gl_fecha_doc,
                gl_glosa: glosaFormData.gl_glosa,
                gl_estado: 'V'
            };

            await axios.post('/tblglosa/add', glosaData);
            
            app.flashMsg('Éxito', 'Asignación y glosa guardadas correctamente');
            app.navigate('/tbltipoaportante');
            
        } catch (error) {
            console.error('Error saving:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar los datos';
            app.flashMsg('Error', errorMessage, 'error');
        } finally {
            setSavingGlosa(false);
            setShowGlosaDialog(false);
        }
    };
    
    if (loadingPersona) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }
    
    // Función auxiliar para convertir decimal a porcentaje
    const toPercentage = (value) => {
        return `${(parseFloat(value) * 100).toFixed(2)}%`;
    };

    return (
        <div className="card">
            <Title title={`Asignación de Tipo Aportante - ${persona?.per_nombres} ${persona?.per_ap_paterno} ${persona?.per_ap_materno}`} />
            
            <div className="grid">
                <div className="col-12 md:col-4">
                    <Card className="mb-4">
                        <div className="flex flex-column align-items-center">
                            {/* Header con Avatar */}
                            <div className="relative mb-4">
                                <div className="bg-primary w-8rem h-8rem border-circle flex align-items-center justify-content-center mb-3">
                                    <i className="pi pi-user text-white" style={{ fontSize: '4rem' }}></i>
                                </div>
                            </div>

                            {/* Información Principal */}
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold m-0">
                                    {`${persona?.per_nombres} ${persona?.per_ap_paterno} ${persona?.per_ap_materno}`}
                                </h2>
                                <div className="mt-2 text-500">
                                    <i className="pi pi-id-card mr-2"></i>
                                    <span>{personaInfo?.per_num_doc || 'No asignado'}</span>
                                </div>
                            </div>

                            {/* Info Cards */}
                            <div className="grid w-full">
                                <div className="col-6 mb-3">
                                    <div className="p-3 border-round-lg surface-50">
                                        <div className="flex align-items-center mb-2">
                                            <i className="pi pi-id-card text-primary mr-2"></i>
                                            <span className="text-600 text-sm">CI</span>
                                        </div>
                                        <span className="font-medium">{personaInfo?.per_num_doc || 'No asignado'}</span>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="p-3 border-round-lg surface-50">
                                        <div className="flex align-items-center mb-2">
                                            <i className="pi pi-hashtag text-primary mr-2"></i>
                                            <span className="text-600 text-sm">Item</span>
                                        </div>
                                        <span className="font-medium">
                                            {personaInfo?.ca_ti_item && personaInfo?.ca_num_item 
                                                ? `${personaInfo.ca_ti_item}-${personaInfo.ca_num_item}`
                                                : 'No asignado'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Detalles */}
                            <div className="surface-100 border-round-xl p-4 w-full">
                                <h3 className="text-lg font-semibold mb-3">Información Laboral</h3>
                                
                                <div className="flex flex-column gap-3">
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-briefcase text-primary mr-2"></i>
                                            <span className="text-600">Puesto</span>
                                        </div>
                                        <span className="font-medium">{personaInfo?.cargo_descripcion || 'No asignado'}</span>
                                    </div>
                                    
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-money-bill text-primary mr-2"></i>
                                            <span className="text-600">Haber Básico</span>
                                        </div>
                                        <span className="text-primary font-bold">
                                            {personaInfo?.ns_haber_basico 
                                                ? new Intl.NumberFormat('es-BO', { 
                                                    style: 'currency', 
                                                    currency: 'BOB' 
                                                  }).format(personaInfo.ns_haber_basico)
                                                : 'No asignado'
                                            }
                                        </span>
                                    </div>

                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-chart-line text-primary mr-2"></i>
                                            <span className="text-600">Escalafón</span>
                                        </div>
                                        <span className="font-medium">{personaInfo?.es_escalafon || 'No asignado'}</span>
                                    </div>
                                </div>

                                <div className="border-top-1 surface-border my-3"></div>

                                <h3 className="text-lg font-semibold mb-3">Información Personal</h3>
                                <div className="flex flex-column gap-3">
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-calendar text-primary mr-2"></i>
                                            <span className="text-600">Fecha Nacimiento</span>
                                        </div>
                                        <span className="font-medium">
                                            {personaInfo?.per_fecha_nac ? new Date(personaInfo.per_fecha_nac).toLocaleDateString() : 'No registrada'}
                                        </span>
                                    </div>

                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-user text-primary mr-2"></i>
                                            <span className="text-600">Edad</span>
                                        </div>
                                        <span className="font-medium">{edad} años</span>
                                    </div>
                                </div>

                                <div className="border-top-1 surface-border my-3"></div>

                                <h3 className="text-lg font-semibold mb-3">Fechas</h3>
                                <div className="flex flex-column gap-3">
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-calendar-plus text-primary mr-2"></i>
                                            <span className="text-600">Alta</span>
                                        </div>
                                        <span className="font-medium">
                                            {personaInfo?.as_fecha_inicio ? new Date(personaInfo.as_fecha_inicio).toLocaleDateString() : 'No asignada'}
                                        </span>
                                    </div>

                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-calendar-minus text-primary mr-2"></i>
                                            <span className="text-600">Baja</span>
                                        </div>
                                        <span className="font-medium">
                                            {personaInfo?.as_fecha_fin ? new Date(personaInfo.as_fecha_fin).toLocaleDateString() : 'No asignada'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                
                <div className="col-12 md:col-8">
                    <Card className="mb-4" title="Selección Tipo Aportante">
                        <div className="grid">
                            <div className="col-12 md:col-6 mb-3">
                                <label className="block font-bold mb-2">¿Decide Aportar al S.I.P?</label>
                                <SelectButton 
                                    value={aportaSIP} 
                                    options={siNoOptions} 
                                    onChange={(e) => setAportaSIP(e.value)}
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="col-12 md:col-6 mb-3">
                                <label className="block font-bold mb-2">¿Es Jubilado?</label>
                                <SelectButton 
                                    value={esJubilado} 
                                    options={siNoOptions} 
                                    onChange={(e) => setEsJubilado(e.value)}
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="col-12 md:col-6 mb-3">
                                <label className="block font-bold mb-2">Tipo Aportante</label>
                                <Dropdown
                                    options={tipoAportanteOptions}
                                    value={selectedTipoAportante?.value}
                                    onChange={(e) => {
                                        const selected = tipoAportanteOptions.find(item => item.value === e.value);
                                        setSelectedTipoAportante(selected);
                                    }}
                                    placeholder="Seleccione un tipo de aportante"
                                    className="w-full"
                                    disabled={tipoAportanteOptions.length === 0 || loadingTipos}
                                    loading={loadingTipos}
                                />
                            </div>
                        </div>
                        
                        {selectedTipoAportante && (
                            <div className="grid mt-3">
                                <div className="col-12 md:col-6">
                                    <h3>Aporte Laboral</h3>
                                    <div className="p-2 border-round bg-gray-100 mb-2">
                                        <div className="flex justify-content-between">
                                            <span>Cotización Mensual SSO:</span>
                                            <span className="font-bold">{toPercentage(selectedTipoAportante.tipo.ta_lab_cotizacion_mensual)}</span>
                                        </div>
                                    </div>
                                    <div className="p-2 border-round bg-gray-100 mb-2">
                                        <div className="flex justify-content-between">
                                            <span>Comisión AFP:</span>
                                            <span className="font-bold">{toPercentage(selectedTipoAportante.tipo.ta_lab_comision_afp)}</span>
                                        </div>
                                    </div>
                                    <div className="p-2 border-round bg-gray-100 mb-2">
                                        <div className="flex justify-content-between">
                                            <span>Prima Riesgo Común:</span>
                                            <span className="font-bold">{toPercentage(selectedTipoAportante.tipo.ta_lab_prima_riesgo_comun)}</span>
                                        </div>
                                    </div>
                                    <div className="p-2 border-round bg-gray-100">
                                        <div className="flex justify-content-between">
                                            <span>Aporte Solidario:</span>
                                            <span className="font-bold">{toPercentage(selectedTipoAportante.tipo.ta_lab_solidario)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-12 md:col-6">
                                    <h3>Aporte Patronal</h3>
                                    <div className="p-2 border-round bg-gray-100 mb-2">
                                        <div className="flex justify-content-between">
                                            <span>Prima de Riesgo Profesional:</span>
                                            <span className="font-bold">{toPercentage(selectedTipoAportante.tipo.ta_pat_prima_riesgo_prof)}</span>
                                        </div>
                                    </div>
                                    <div className="p-2 border-round bg-gray-100 mb-2">
                                        <div className="flex justify-content-between">
                                            <span>Cajas:</span>
                                            <span className="font-bold">{toPercentage(selectedTipoAportante.tipo.ta_pat_caja)}</span>
                                        </div>
                                    </div>
                                    <div className="p-2 border-round bg-gray-100 mb-2">
                                        <div className="flex justify-content-between">
                                            <span>Provivienda:</span>
                                            <span className="font-bold">{toPercentage(selectedTipoAportante.tipo.ta_pat_provivienda)}</span>
                                        </div>
                                    </div>
                                    <div className="p-2 border-round bg-gray-100">
                                        <div className="flex justify-content-between">
                                            <span>Aporte Solidario:</span>
                                            <span className="font-bold">{toPercentage(selectedTipoAportante.tipo.ta_pat_solidario)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-12 mt-4 flex justify-content-end">
                                    <Button 
                                        label="Guardar" 
                                        icon="pi pi-save" 
                                        onClick={handleSave}
                                        loading={saving}
                                        disabled={!selectedTipoAportante || saving}
                                    />
                                </div>
                            </div>
                        )}
                    </Card>
                    
                    <Card title="Lista Tipo Aportante Asignados">
                        <TipoAportanteList personaId={personaId} />
                    </Card>
                </div>
            </div>

            {/* Agregar el Dialog de la glosa */}
            <Dialog
                visible={showGlosaDialog}
                onHide={() => setShowGlosaDialog(false)}
                header="Registrar Glosa"
                style={{ width: '500px' }}
                modal
                footer={
                    <div>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setShowGlosaDialog(false)}
                        />
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            loading={savingGlosa}
                            onClick={handleGlosaSubmit}
                        />
                    </div>
                }
            >
                <div className="grid p-fluid">
                    <div className="col-12 mb-3">
                        <label className="font-bold block mb-2">Tipo de Documento *</label>
                        <Dropdown
                            value={glosaFormData.gl_tipo_doc}
                            options={tiposDocumento}
                            onChange={(e) => setGlosaFormData(prev => ({...prev, gl_tipo_doc: e.value}))}
                            placeholder="Seleccione tipo de documento"
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <div className="col-12 mb-3">
                        <label className="font-bold block mb-2">Número Documento *</label>
                        <InputText
                            value={glosaFormData.gl_numero_doc}
                            onChange={(e) => setGlosaFormData(prev => ({...prev, gl_numero_doc: e.target.value}))}
                            placeholder="Ingrese número de documento"
                            required
                        />
                    </div>
                    
                    <div className="col-12 mb-3">
                        <label className="font-bold block mb-2">Fecha Documento *</label>
                        <Calendar
                            value={glosaFormData.gl_fecha_doc}
                            onChange={(e) => setGlosaFormData(prev => ({...prev, gl_fecha_doc: e.value}))}
                            showIcon
                            dateFormat="dd/mm/yy"
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <div className="col-12">
                        <label className="font-bold block mb-2">Descripción *</label>
                        <InputTextarea
                            value={glosaFormData.gl_glosa}
                            onChange={(e) => setGlosaFormData(prev => ({...prev, gl_glosa: e.target.value}))}
                            rows={3}
                            placeholder="Ingrese la descripción"
                            required
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

// Componente para mostrar la lista de asignaciones de tipo aportante
const TipoAportanteList = ({ personaId }) => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const app = useApp();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchAsignaciones = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/tblmpasignaciontipoaportante/listAsignaciones', {
                    params: { 
                        at_per_id: personaId
                    }
                });
                
                // Filtrar solo registros válidos que tienen todas las relaciones necesarias
                const validAsignaciones = (response.data.data || []).filter(asignacion => 
                    asignacion.ta_descripcion && 
                    asignacion.at_estado === 'V'
                );
                
                setAsignaciones(validAsignaciones);
                setLoading(false);
            } catch (error) {
                app.flashMsg('Error', `Error al cargar asignaciones: ${error.message}`, 'error');
                setLoading(false);
            }
        };
        
        fetchAsignaciones();
    }, [personaId, app]);

    const confirmDelete = (id) => {
        setSelectedId(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmedDelete = async () => {
        try {
            await axios.delete(`/tblmpasignaciontipoaportante/delete/${selectedId}`);
            app.flashMsg('Éxito', 'Asignación eliminada correctamente', 'success');
            setAsignaciones(asignaciones.filter(item => item.at_id !== selectedId));
            setShowDeleteDialog(false);
        } catch (error) {
            app.flashMsg('Error', `Error al eliminar: ${error.message}`, 'error');
        }
    };

    const deleteDialogFooter = (
        <div>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setShowDeleteDialog(false)} />
            <Button label="Sí" icon="pi pi-check" className="p-button-danger" onClick={handleConfirmedDelete} />
        </div>
    );

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger p-button-text"
                    onClick={() => confirmDelete(rowData.at_id)}
                    tooltip="Eliminar"
                />
            </div>
        );
    };
    
    return (
        <>
            <DataTable
                value={asignaciones}
                loading={loading}
                emptyMessage={
                    <div className="p-4 text-center">
                        {loading ? (
                            <ProgressSpinner style={{width:'50px', height:'50px'}} />
                        ) : (
                            "No hay asignaciones vigentes registradas"
                        )}
                    </div>
                }
                stripedRows
                className="p-datatable-sm"
            >
                <Column 
                    field="ta_descripcion" 
                    header="Tipo Aportante" 
                    sortable
                />
                <Column 
                    field="at_estado" 
                    header="Estado" 
                    sortable
                    body={(rowData) => rowData.at_estado === 'V' ? 'Vigente' : 'No Vigente'}
                />
                <Column 
                    header="Acciones" 
                    body={actionTemplate} 
                    style={{width: '100px'}} 
                />
            </DataTable>
            <Dialog 
                visible={showDeleteDialog} 
                style={{ width: '450px' }} 
                header="Confirmar Eliminación" 
                modal 
                footer={deleteDialogFooter} 
                onHide={() => setShowDeleteDialog(false)}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Está seguro que desea eliminar esta asignación?</span>
                </div>
            </Dialog>
        </>
    );
};

export default TblTipoAportanteView;
