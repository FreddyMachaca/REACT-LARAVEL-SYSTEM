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

    // Fetch informacion de la persona
    useEffect(() => {
        const fetchPersona = async () => {
            try {
                setLoadingPersona(true);
                const response = await axios.get(`/tblpersona/view/${personaId}`);
                setPersona(response.data);
                const calculatedEdad = calcularEdad(response.data.per_fecha_nac);
                setEdad(calculatedEdad);
                setLoadingPersona(false);
            } catch (error) {
                app.flashMsg('Error', `Error al cargar datos de la persona: ${error.message}`, 'error');
                setLoadingPersona(false);
            }
        };
        
        fetchPersona();
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
    
    const handleSave = async () => {
        if (!selectedTipoAportante) {
            app.flashMsg('Advertencia', 'Debe seleccionar un tipo de aportante', 'warn');
            return;
        }
        
        try {
            setSaving(true);
            
            const data = {
                at_per_id: parseInt(personaId),
                at_ta_id: selectedTipoAportante.value,
                at_estado: 'V'  // Vigente
            };
            
            await axios.post('/tblmpasignaciontipoaportante/add', data);
            
            app.flashMsg('Éxito', 'Tipo de aportante asignado exitosamente', 'success');
            app.navigate('/tbltipoaportante');
            
            setSaving(false);
        } catch (error) {
            app.flashMsg('Error', `Error al guardar: ${error.message}`, 'error');
            setSaving(false);
        }
    };
    
    if (loadingPersona) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }
    
    return (
        <div className="card">
            <Title title={`Asignación de Tipo Aportante - ${persona?.per_nombres} ${persona?.per_ap_paterno} ${persona?.per_ap_materno}`} />
            
            <Card className="mb-4" title="Selección Tipo Aportante">
                <div className="grid">
                    <div className="col-12 md:col-6 mb-3">
                        <label className="block font-bold mb-2">Edad del funcionario</label>
                        <div>{edad} años</div>
                    </div>
                    
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
                                    <span className="font-bold">{selectedTipoAportante.tipo.ta_lab_cotizacion_mensual}%</span>
                                </div>
                            </div>
                            <div className="p-2 border-round bg-gray-100 mb-2">
                                <div className="flex justify-content-between">
                                    <span>Comisión AFP:</span>
                                    <span className="font-bold">{selectedTipoAportante.tipo.ta_lab_comision_afp}%</span>
                                </div>
                            </div>
                            <div className="p-2 border-round bg-gray-100 mb-2">
                                <div className="flex justify-content-between">
                                    <span>Prima Riesgo Común:</span>
                                    <span className="font-bold">{selectedTipoAportante.tipo.ta_lab_prima_riesgo_comun}%</span>
                                </div>
                            </div>
                            <div className="p-2 border-round bg-gray-100">
                                <div className="flex justify-content-between">
                                    <span>Aporte Solidario:</span>
                                    <span className="font-bold">{selectedTipoAportante.tipo.ta_lab_solidario}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 md:col-6">
                            <h3>Aporte Patronal</h3>
                            <div className="p-2 border-round bg-gray-100 mb-2">
                                <div className="flex justify-content-between">
                                    <span>Prima de Riesgo Profesional:</span>
                                    <span className="font-bold">{selectedTipoAportante.tipo.ta_pat_prima_riesgo_prof}%</span>
                                </div>
                            </div>
                            <div className="p-2 border-round bg-gray-100 mb-2">
                                <div className="flex justify-content-between">
                                    <span>Cajas:</span>
                                    <span className="font-bold">{selectedTipoAportante.tipo.ta_pat_caja}%</span>
                                </div>
                            </div>
                            <div className="p-2 border-round bg-gray-100 mb-2">
                                <div className="flex justify-content-between">
                                    <span>Provivienda:</span>
                                    <span className="font-bold">{selectedTipoAportante.tipo.ta_pat_provivienda}%</span>
                                </div>
                            </div>
                            <div className="p-2 border-round bg-gray-100">
                                <div className="flex justify-content-between">
                                    <span>Aporte Solidario:</span>
                                    <span className="font-bold">{selectedTipoAportante.tipo.ta_pat_solidario}%</span>
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
