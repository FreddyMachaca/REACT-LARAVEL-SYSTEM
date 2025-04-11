import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import axios from 'axios';

const TblTransaccionesAdd = () => {
    const { personaId } = useParams();
    const app = useApp();
    
    const [loading, setLoading] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [personaInfo, setPersonaInfo] = useState(null);
    const [tiposTransaccion, setTiposTransaccion] = useState([]);
    const [estadosAporte, setEstadosAporte] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [saving, setSaving] = useState(false);
    
    const [showGlosaDialog, setShowGlosaDialog] = useState(false);
    const [glosaFormData, setGlosaFormData] = useState({
        gl_tipo_doc: '',
        gl_numero_doc: '',
        gl_fecha_doc: new Date(),
        gl_glosa: ''
    });
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [savingGlosa, setSavingGlosa] = useState(false);
    
    const [formData, setFormData] = useState({
        tr_fa_id: null,
        tr_pc_id: 1,
        tr_estado: 'V',
        tr_fecha_inicio: new Date(),
        tr_monto: 0 
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                
                const personaResponse = await axios.get(`/tblplatransacciones/personaInfo/${personaId}`);
                setPersonaInfo(personaResponse.data);
                const factoresResponse = await axios.get('/tblplafactor/getFactoresEspeciales');
                if (factoresResponse.data && factoresResponse.data.records) {
                    const tiposOptions = factoresResponse.data.records.map(factor => ({
                        value: factor.fa_id,
                        label: factor.fa_descripcion
                    }));
                    setTiposTransaccion(tiposOptions);
                }
                
                const tiposDocResponse = await axios.get('/tblcatalogo/byTipo/tipo_documento_impreso');
                if (tiposDocResponse.data) {
                    setTiposDocumento(tiposDocResponse.data.map(tipo => ({
                        value: tipo.cat_id,
                        label: tipo.cat_descripcion
                    })));
                }
                
                await loadTransactions();
                
                setLoading(false);
            } catch (error) {
                app.flashMsg('Error', 'No se pudo cargar la información inicial', 'error');
                setLoading(false);
            }
        };
        
        fetchInitialData();
    }, [personaId, app]);
    
    const loadTransactions = async () => {
        try {
            setLoadingTransactions(true);
            const response = await axios.get(`/tblplatransacciones/persona/${personaId}`);
            setTransactions(response.data.records);
            setLoadingTransactions(false);
        } catch (error) {
            app.flashMsg('Error', 'No se pudieron cargar las transacciones', 'error');
            setLoadingTransactions(false);
        }
    };
    
    const handleSave = () => {
        if (!formData.tr_fa_id) {
            app.flashMsg('Advertencia', 'Por favor seleccione el tipo de transacción', 'warn');
            return;
        }
        
        setShowGlosaDialog(true);
    };
    
    const handleGlosaSubmit = async () => {
        try {
            if (!glosaFormData.gl_tipo_doc || !glosaFormData.gl_numero_doc || !glosaFormData.gl_glosa) {
                app.flashMsg('Advertencia', 'Por favor complete todos los campos de la glosa', 'warn');
                return;
            }
            
            setSavingGlosa(true);
            
            const transaccionPayload = {
                tr_fa_id: parseInt(formData.tr_fa_id),
                tr_pc_id: parseInt(formData.tr_pc_id),
                tr_per_id: parseInt(personaId),
                tr_fecha_inicio: new Date().toISOString(),
                tr_estado: formData.tr_estado,
                tr_monto: 0.00
            };
            
            const transaccionResponse = await axios.post('/tblplatransacciones/add', transaccionPayload);
            
            if (transaccionResponse.data) {
                const transaccionId = transaccionResponse.data.tr_id;
                
                if (!transaccionId) {
                    throw new Error('No se pudo obtener el ID de la transacción');
                }
                
                const glosaPayload = {
                    gl_valor_pk: transaccionId,
                    gl_nombre_pk: 'tr_id',
                    gl_tabla: 'tbl_pla_transacciones',
                    gl_tipo_doc: parseInt(glosaFormData.gl_tipo_doc),
                    gl_numero_doc: glosaFormData.gl_numero_doc,
                    gl_fecha_doc: glosaFormData.gl_fecha_doc instanceof Date 
                        ? glosaFormData.gl_fecha_doc.toISOString() 
                        : new Date(glosaFormData.gl_fecha_doc).toISOString(),
                    gl_glosa: glosaFormData.gl_glosa,
                    gl_estado: 'V'
                };
                
                await axios.post('/tblglosa/add', glosaPayload);
                
                setFormData({
                    tr_fa_id: null,
                    tr_pc_id: 1,
                    tr_estado: 'V',
                    tr_fecha_inicio: new Date(),
                    tr_monto: 0
                });
                
                setGlosaFormData({
                    gl_tipo_doc: '',
                    gl_numero_doc: '',
                    gl_fecha_doc: new Date(),
                    gl_glosa: ''
                });
                
                await loadTransactions();
                setShowGlosaDialog(false);
                app.flashMsg('Éxito', 'Transacción guardada correctamente', 'success');
            } else {
                throw new Error('No se recibió respuesta del servidor al guardar la transacción');
            }
        } catch (error) {
            app.flashMsg('Error', `No se pudo guardar: ${error.message}`, 'error');
        } finally {
            setSavingGlosa(false);
        }
    };
    
    const confirmDelete = (transaction) => {
        setSelectedTransaction(transaction);
        setDeleteDialog(true);
    };
    
    const deleteTransaction = async () => {
        try {
            await axios.delete(`/tblplatransacciones/delete/${selectedTransaction.tr_id}`);
            setDeleteDialog(false);
            app.flashMsg('Éxito', 'Transacción eliminada correctamente', 'success');
            await loadTransactions();
        } catch (error) {
            app.flashMsg('Error', 'No se pudo eliminar la transacción', 'error');
        }
    };
    
    const actionTemplate = (rowData) => {
        return (
            <div className="flex justify-content-center">
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger p-button-text" 
                    onClick={() => confirmDelete(rowData)}
                    tooltip="Eliminar" 
                />
            </div>
        );
    };
    
    const dateTemplate = (rowData) => {
        return rowData.tr_fecha_creacion ? new Date(rowData.tr_fecha_creacion).toLocaleDateString() : '';
    };
    
    const tipoTransaccionTemplate = (rowData) => {
        const tipo = tiposTransaccion.find(t => t.value === rowData.tr_fa_id);
        return tipo ? tipo.label : '';
    };
    
    const estadoAporteTemplate = (rowData) => {
        return rowData.tr_estado === 'V' ? 'APORTA' : 'NO APORTA';
    };

    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="card">
            <Title title="Nueva Transacción" />
            
            <div className="grid">
                <div className="col-12 md:col-4">
                    <Card className="h-full">
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
                                    {`${personaInfo?.per_nombres || ''} ${personaInfo?.per_ap_paterno || ''} ${personaInfo?.per_ap_materno || ''}`}
                                </h2>
                                <div className="mt-2 text-500">
                                    <i className="pi pi-id-card mr-2"></i>
                                    <span>{personaInfo?.per_num_doc || 'No asignado'}</span>
                                </div>
                            </div>

                            {/* Detalles */}
                            <div className="surface-100 border-round-xl p-4 w-full">
                                <h3 className="text-lg font-semibold mb-3">Información Laboral</h3>
                                
                                <div className="flex flex-column gap-3">
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-hashtag text-primary mr-2"></i>
                                            <span className="text-600">Item</span>
                                        </div>
                                        <span className="font-medium">
                                            {personaInfo?.ca_ti_item && personaInfo?.ca_num_item 
                                                ? `${personaInfo.ca_ti_item}-${personaInfo.ca_num_item}`
                                                : 'No asignado'
                                            }
                                        </span>
                                    </div>
                                    
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-briefcase text-primary mr-2"></i>
                                            <span className="text-600">Cargo</span>
                                        </div>
                                        <span className="font-medium">{personaInfo?.cargo_descripcion || 'No asignado'}</span>
                                    </div>

                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-calendar-plus text-primary mr-2"></i>
                                            <span className="text-600">Fecha Asignación</span>
                                        </div>
                                        <span className="font-medium">
                                            {personaInfo?.as_fecha_inicio ? new Date(personaInfo.as_fecha_inicio).toLocaleDateString() : 'No asignada'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-calendar-minus text-primary mr-2"></i>
                                            <span className="text-600">Fecha Baja</span>
                                        </div>
                                        <span className="font-medium">
                                            {personaInfo?.as_fecha_fin ? new Date(personaInfo.as_fecha_fin).toLocaleDateString() : 'No asignada'}
                                        </span>
                                    </div>

                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center">
                                            <i className="pi pi-money-bill text-primary mr-2"></i>
                                            <span className="text-600">Haber Básico (BS)</span>
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
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                
                <div className="col-12 md:col-8">
                    <Card title="Datos de la Transacción" className="mb-3">
                        <div className="grid p-fluid">
                            <div className="col-12 md:col-6 mb-3">
                                <label className="font-bold block mb-2">Tipo Transacción *</label>
                                <Dropdown 
                                    value={formData.tr_fa_id}
                                    options={tiposTransaccion}
                                    onChange={(e) => setFormData({...formData, tr_fa_id: e.value})}
                                    placeholder="Seleccione un tipo"
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="col-12 md:col-6 mb-3">
                                <label className="font-bold block mb-2">Estado Aporte *</label>
                                <Dropdown 
                                    value={formData.tr_estado}
                                    options={[{label: 'APORTA', value: 'V'}, {label: 'NO APORTA', value: 'I'}]}
                                    onChange={(e) => {
                                        setFormData({...formData, tr_estado: e.value});
                                    }}
                                    placeholder="Seleccione un estado"
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="col-12 text-right">
                                <Button 
                                    label="Guardar" 
                                    icon="pi pi-save" 
                                    onClick={handleSave}
                                    loading={saving}
                                />
                            </div>
                        </div>
                    </Card>
                    
                    <Card title="Transacciones Registradas">
                        <DataTable 
                            value={transactions} 
                            loading={loadingTransactions}
                            emptyMessage="No hay transacciones registradas"
                            stripedRows
                            className="p-datatable-sm"
                        >
                            <Column body={tipoTransaccionTemplate} header="Tipo Transacción" style={{ width: '40%' }} />
                            <Column body={estadoAporteTemplate} header="Estado Aporte" style={{ width: '30%' }} />
                            <Column body={dateTemplate} header="Fecha Registro" style={{ width: '20%' }} />
                            <Column body={actionTemplate} header="Opciones" style={{ width: '10%' }} />
                        </DataTable>
                    </Card>
                </div>
            </div>
            
            <Dialog 
                visible={deleteDialog} 
                style={{ width: '450px' }} 
                header="Confirmar Eliminación" 
                modal 
                footer={
                    <div>
                        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteDialog(false)} />
                        <Button label="Sí" icon="pi pi-check" className="p-button-danger" onClick={deleteTransaction} />
                    </div>
                } 
                onHide={() => setDeleteDialog(false)}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Está seguro que desea eliminar esta transacción?</span>
                </div>
            </Dialog>
            
            <Dialog
                visible={showGlosaDialog}
                style={{ width: '500px' }}
                header="Registrar Glosa"
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
                onHide={() => setShowGlosaDialog(false)}
            >
                <div className="grid p-fluid">
                    <div className="col-12 mb-3">
                        <label className="font-bold block mb-2">Tipo de Documento *</label>
                        <Dropdown
                            value={glosaFormData.gl_tipo_doc}
                            options={tiposDocumento}
                            onChange={(e) => setGlosaFormData({...glosaFormData, gl_tipo_doc: e.value})}
                            placeholder="Seleccione tipo de documento"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 mb-3">
                        <label className="font-bold block mb-2">Número de Documento *</label>
                        <InputText
                            value={glosaFormData.gl_numero_doc}
                            onChange={(e) => setGlosaFormData({...glosaFormData, gl_numero_doc: e.target.value})}
                            placeholder="Ingrese número de documento"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 mb-3">
                        <label className="font-bold block mb-2">Fecha Documento *</label>
                        <Calendar
                            value={glosaFormData.gl_fecha_doc}
                            onChange={(e) => setGlosaFormData({...glosaFormData, gl_fecha_doc: e.value})}
                            dateFormat="dd/mm/yy"
                            showIcon
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12">
                        <label className="font-bold block mb-2">Descripción *</label>
                        <InputTextarea
                            value={glosaFormData.gl_glosa}
                            onChange={(e) => setGlosaFormData({...glosaFormData, gl_glosa: e.target.value})}
                            rows={3}
                            placeholder="Ingrese descripción de la glosa"
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default TblTransaccionesAdd;
