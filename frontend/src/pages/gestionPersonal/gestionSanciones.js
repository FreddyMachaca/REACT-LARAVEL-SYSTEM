import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import useApp from 'hooks/useApp';
import axios from 'axios';

const formatDateToYYYYMMDD = (date) => {
    if (!date || !(date instanceof Date)) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        const day = utcDate.getDate().toString().padStart(2, '0');
        const month = (utcDate.getMonth() + 1).toString().padStart(2, '0');
        const year = utcDate.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return ''; 
    }
};

const GestionSanciones = ({ personaId }) => {
    const app = useApp();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [sanciones, setSanciones] = useState([]);
    const [tiposSancion, setTiposSancion] = useState([]); 
    const [selectedTipoSancion, setSelectedTipoSancion] = useState(null); 
    const [formData, setFormData] = useState({
        sa_minutos: null,
        sa_fecha_inicio: null,
        sa_fecha_fin: null,
        sa_dias_sancion: null,
        sa_fecha_sancion: null,
        sa_dias_acumulados: null, 
    });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedSancion, setSelectedSancion] = useState(null);

    const SANCTION_DESCRIPTIONS = {
        MINUTOS: 'SANCION POR MINUTOS DE ATRASO',
        INASISTENCIA: 'SANCION POR INASISTENCIA',
        ABANDONO: 'SANCION POR ABANDONO',
        MARCADO_30: 'SANCION POR MARCADO MAS DE 30 MINUTOS',
        INTERNA: 'SANCION INTERNA'
    };

    const resetFormData = () => {
        setFormData({
            sa_minutos: null,
            sa_fecha_inicio: null,
            sa_fecha_fin: null,
            sa_dias_sancion: null,
            sa_fecha_sancion: null,
            sa_dias_acumulados: null,
        });
    };

    const fetchSanciones = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/sanciones', { params: { sa_per_id: personaId } });
            setSanciones(response.data?.data || []);
        } catch (error) {
            app.flashMsg('Error', 'No se pudieron cargar las sanciones', 'error');
        } finally {
            setLoading(false);
        }
    }, [personaId, app]);

    const fetchTiposSancion = useCallback(async () => {
        try {
            const response = await axios.get('/tblcatalogo/getTiposSancion');
            setTiposSancion(response.data?.map(cat => ({
                id: cat.cat_id,
                descripcion: cat.cat_descripcion,
                abreviacion: cat.cat_abreviacion
            })) || []);
        } catch (error) {
            app.flashMsg('Error', 'No se pudieron cargar los tipos de sanción', 'error');
        }
    }, [app]);

    useEffect(() => {
        fetchTiposSancion(); 
        fetchSanciones();
    }, [fetchTiposSancion, fetchSanciones]); 

    const handleTipoSancionChange = (e) => {
        const tipoId = e.value;
        const tipo = tiposSancion.find(t => t.id === tipoId);
        setSelectedTipoSancion(tipo);
        resetFormData();
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getSanctionPayload = () => {
        if (!selectedTipoSancion) return null;

        const basePayload = {
            sa_per_id: parseInt(personaId),
            sa_tipo_sancion: selectedTipoSancion.abreviacion,
            tipo_sancion_descripcion: selectedTipoSancion.descripcion,
            sa_estado: 'V'
        };

        switch (selectedTipoSancion.descripcion) {
            case SANCTION_DESCRIPTIONS.MINUTOS:
                if (!formData.sa_minutos || !formData.sa_fecha_inicio || !formData.sa_fecha_fin) {
                    app.flashMsg('Advertencia', 'Debe ingresar minutos y fechas de inicio/fin', 'warn');
                    return null;
                }
                return {
                    ...basePayload,
                    sa_minutos: formData.sa_minutos,
                    sa_fecha_inicio: formatDateToYYYYMMDD(formData.sa_fecha_inicio),
                    sa_fecha_fin: formatDateToYYYYMMDD(formData.sa_fecha_fin),
                    sa_dias_sancion: 0
                };

            case SANCTION_DESCRIPTIONS.INASISTENCIA:
                if (!formData.sa_fecha_sancion || !formData.sa_dias_sancion) {
                    app.flashMsg('Advertencia', 'Debe ingresar fecha y días de sanción', 'warn');
                    return null;
                }
                return {
                    ...basePayload,
                    sa_fecha_inicio: formatDateToYYYYMMDD(formData.sa_fecha_sancion),
                    sa_dias_sancion: formData.sa_dias_sancion
                };

            case SANCTION_DESCRIPTIONS.ABANDONO:
            case SANCTION_DESCRIPTIONS.MARCADO_30:
            case SANCTION_DESCRIPTIONS.INTERNA:
                if (!formData.sa_fecha_sancion || !formData.sa_dias_sancion || !formData.sa_dias_acumulados) {
                    app.flashMsg('Advertencia', 'Debe ingresar todos los campos requeridos', 'warn');
                    return null;
                }
                return {
                    ...basePayload,
                    sa_fecha_inicio: formatDateToYYYYMMDD(formData.sa_fecha_sancion),
                    sa_dias_sancion: formData.sa_dias_acumulados, // Use accumulated days as sanction days
                    sa_dias_acumulados: formData.sa_dias_acumulados
                };

            default:
                app.flashMsg('Error', 'Tipo de sanción no reconocido', 'error');
                return null;
        }
    };

    const handleSave = async () => {
        const payload = getSanctionPayload();
        if (!payload) return;

        setSaving(true);
        try {
            await axios.post('/sanciones', payload);
            app.flashMsg('Éxito', 'Sanción registrada correctamente', 'success');
            setSelectedTipoSancion(null); 
            resetFormData();
            fetchSanciones();
        } catch (error) {
            console.error("Save error:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'No se pudo registrar la sanción';
            app.flashMsg('Error', errorMsg, 'error');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = (sancion) => {
        setSelectedSancion(sancion);
        setDeleteDialog(true);
    };

    const deleteSancion = async () => {
        if (!selectedSancion) return;
        try {
            await axios.delete(`/sanciones/${selectedSancion.sa_id}`);
            app.flashMsg('Éxito', 'Sanción eliminada', 'success');
            setDeleteDialog(false);
            setSelectedSancion(null);
            fetchSanciones();
        } catch (error) {
            app.flashMsg('Error', 'No se pudo eliminar la sanción', 'error');
        }
    };

    const renderFormFields = () => {
        if (!selectedTipoSancion) return null;

        switch (selectedTipoSancion.descripcion) {
            case SANCTION_DESCRIPTIONS.MINUTOS:
                return (
                    <>
                        <div className="col-12 md:col-4">
                            <label htmlFor="minutos" className="font-bold block mb-2">Minutos Acumulados</label>
                            <InputNumber id="minutos" value={formData.sa_minutos} onValueChange={(e) => handleInputChange('sa_minutos', e.value)} className="w-full" placeholder="0" min={0} />
                        </div>
                        <div className="col-12 md:col-4">
                            <label htmlFor="fechaInicio" className="font-bold block mb-2">Fecha Inicio</label>
                            <Calendar id="fechaInicio" value={formData.sa_fecha_inicio} onChange={(e) => handleInputChange('sa_fecha_inicio', e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" />
                        </div>
                        <div className="col-12 md:col-4">
                            <label htmlFor="fechaFin" className="font-bold block mb-2">Fecha Fin</label>
                            <Calendar id="fechaFin" value={formData.sa_fecha_fin} onChange={(e) => handleInputChange('sa_fecha_fin', e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" minDate={formData.sa_fecha_inicio} />
                        </div>
                    </>
                );

            case SANCTION_DESCRIPTIONS.INASISTENCIA:
                return (
                    <>
                        <div className="col-12 md:col-6">
                            <label htmlFor="diasSancion" className="font-bold block mb-2">Días Sanción</label>
                            <InputNumber id="diasSancion" value={formData.sa_dias_sancion} onValueChange={(e) => handleInputChange('sa_dias_sancion', e.value)} className="w-full" placeholder="0" min={1} />
                        </div>
                        <div className="col-12 md:col-6">
                            <label htmlFor="fechaSancion" className="font-bold block mb-2">Fecha Sanción</label>
                            <Calendar id="fechaSancion" value={formData.sa_fecha_sancion} onChange={(e) => handleInputChange('sa_fecha_sancion', e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" />
                        </div>
                    </>
                );

            case SANCTION_DESCRIPTIONS.ABANDONO:
            case SANCTION_DESCRIPTIONS.MARCADO_30:
            case SANCTION_DESCRIPTIONS.INTERNA:
                return (
                    <>
                        <div className="col-12 md:col-4">
                            <label htmlFor="diasAcumulados" className="font-bold block mb-2">Días Acumulados</label>
                            <InputNumber id="diasAcumulados" value={formData.sa_dias_acumulados} onValueChange={(e) => handleInputChange('sa_dias_acumulados', e.value)} className="w-full" placeholder="0" min={1} />
                        </div>
                        <div className="col-12 md:col-4">
                            <label htmlFor="diasSancion" className="font-bold block mb-2">Días Sanción</label>
                            <InputNumber id="diasSancion" value={formData.sa_dias_sancion} onValueChange={(e) => handleInputChange('sa_dias_sancion', e.value)} className="w-full" placeholder="0" min={1} />
                        </div>
                        <div className="col-12 md:col-4">
                            <label htmlFor="fechaSancion" className="font-bold block mb-2">Fecha Sanción</label>
                            <Calendar id="fechaSancion" value={formData.sa_fecha_sancion} onChange={(e) => handleInputChange('sa_fecha_sancion', e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" />
                        </div>
                    </>
                );

            default:
                return <div className="col-12"><p>Seleccione un tipo de sanción válido.</p></div>;
        }
    };

    const tipoBodyTemplate = (rowData) => {
        return rowData.tipo_sancion_descripcion || rowData.sa_tipo_sancion || 'N/A';
    };

    const dateBodyTemplate = (rowData, field) => {
        const dateString = rowData[field];
        return formatDateToDDMMYYYY(dateString);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => confirmDelete(rowData)}
                tooltip="Eliminar"
            />
        );
    };

    return (
        <div className="p-3">
            <Card title="Registrar Nueva Sanción" className="mb-4">
                <div className="grid p-fluid align-items-end">
                    <div className="col-12 md:col-4">
                        <label htmlFor="tipo_sancion" className="font-bold block mb-2">Tipo Sanción</label>
                        <Dropdown
                            id="tipo_sancion"
                            value={selectedTipoSancion?.id || null} 
                            options={tiposSancion.map(t => ({ label: t.descripcion, value: t.id }))}
                            onChange={handleTipoSancionChange}
                            placeholder="Seleccione un tipo"
                            className="w-full"
                            filter 
                        />
                    </div>
                     {renderFormFields()}

                    {selectedTipoSancion && ( 
                        <div className="col-12 flex justify-content-end mt-3">
                            <Button
                                label="Guardar"
                                icon="pi pi-save"
                                onClick={handleSave}
                                loading={saving}
                            />
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Historial de Sanciones">
                <DataTable
                    value={sanciones}
                    loading={loading}
                    paginator
                    rows={10}
                    emptyMessage={loading ? <ProgressSpinner style={{width: '30px', height: '30px'}}/> : "No se encontraron sanciones."}
                    className="p-datatable-sm"
                    responsiveLayout="scroll"
                >
                    <Column field="sa_id" header="ID" sortable style={{ width: '8%' }}/>
                    <Column body={tipoBodyTemplate} header="Tipo Sanción" sortable style={{ width: '25%' }}/>
                    <Column field="sa_minutos" header="Minutos" sortable style={{ width: '10%' }}/>
                    <Column field="sa_dias_acumulados" header="Días Acum." sortable style={{ width: '10%' }} body={(rowData) => rowData.sa_dias_acumulados ?? ''}/>
                    <Column field="sa_dias_sancion" header="Días Sanción" sortable style={{ width: '10%' }}/>
                    <Column body={(rowData) => dateBodyTemplate(rowData, 'sa_fecha_inicio')} header="Fecha Inicio/Sanción" sortable style={{ width: '15%' }}/>
                    <Column body={(rowData) => dateBodyTemplate(rowData, 'sa_fecha_fin')} header="Fecha Fin" sortable style={{ width: '12%' }}/>
                    <Column body={actionBodyTemplate} header="Acciones" style={{ width: '10%', textAlign: 'center' }} />
                </DataTable>
            </Card>

            <Dialog
                visible={deleteDialog}
                style={{ width: '450px' }}
                header="Confirmar Eliminación"
                modal
                footer={ 
                    <div>
                        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteDialog(false)} />
                        <Button label="Sí" icon="pi pi-check" className="p-button-danger" onClick={deleteSancion} />
                    </div>
                }
                onHide={() => setDeleteDialog(false)}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Está seguro que desea eliminar esta sanción?</span>
                </div>
            </Dialog>
        </div>
    );
};

export default GestionSanciones;
