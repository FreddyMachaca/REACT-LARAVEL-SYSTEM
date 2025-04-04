import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import { Card } from 'primereact/card';
import useApp from 'hooks/useApp';
import axios from 'axios';

const ExtraHours = () => {
    const app = useApp();

    /* =============================
       MÓDULO DE HORAS EXTRAS (Transacciones)
       ============================= */
    const [tbltransacciones, setTransacciones] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        tr_id: null,
        tr_pc_id: '',
        tr_per_id: '', // Se actualizará al seleccionar una persona
        tr_fa_id: '',
        tr_fecha_inicio: null,
        tr_fecha_fin: null,
        tr_monto: 0,
        tr_estado: 'V'
    });

    /* Estados para el buscador de personas */
    const [personDialogVisible, setPersonDialogVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [persons, setPersons] = useState([]);
    const [loadingPersons, setLoadingPersons] = useState(false);

    const fetchTransacciones = async () => {
        try {
            const response = await axios.get('/transacciones');
            setTransacciones(response.data);
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
        }
    };

    useEffect(() => {
        fetchTransacciones();
    }, []);

    const openNew = () => {
        setEditing(false);
        setFormData({
            tr_id: null,
            tr_pc_id: '',
            tr_per_id: '',
            tr_fa_id: '',
            tr_fecha_inicio: null,
            tr_fecha_fin: null,
            tr_monto: 0,
            tr_estado: 'V'
        });
        setDialogVisible(true);
    };

    const editTransaccion = (transaccion) => {
        setEditing(true);
        setFormData({ ...transaccion });
        setDialogVisible(true);
    };

    const saveTransaccion = async () => {
        if (editing) {
            updateTransaccion();
        } else {
            createTransaccion();
        }
    };

    const createTransaccion = async () => {
        try {
            await axios.post('/transacciones', formData);
            fetchTransacciones();
            setDialogVisible(false);
        } catch (error) {
            console.error('Error al guardar la transacción:', error);
        }
    };

    const updateTransaccion = async () => {
        try {
            await axios.put(`/transacciones/${formData.tr_id}`, formData);
            fetchTransacciones();
            setDialogVisible(false);
            setEditing(false);
        } catch (error) {
            console.error('Error al actualizar la transacción:', error);
        }
    };

    const deleteTransaccion = async (transaccion) => {
        try {
            await axios.delete(`/transacciones/${transaccion.tr_id}`);
            fetchTransacciones();
        } catch (error) {
            console.error('Error al eliminar la transacción:', error);
        }
    };

    const onInputChange = (e, name) => {
        const val = e.target && e.target.value !== undefined ? e.target.value : e.value;
        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-success p-mr-2" 
                    onClick={() => editTransaccion(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-warning" 
                    onClick={() => deleteTransaccion(rowData)} 
                />
            </>
        );
    };

    const dialogFooter = (
        <div>
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                onClick={() => setDialogVisible(false)} 
                className="p-button-text" 
            />
            <Button 
                label="Guardar" 
                icon="pi pi-check" 
                onClick={saveTransaccion} 
                autoFocus 
            />
        </div>
    );

    /* Funciones para el buscador de personas */
    const searchPersons = async () => {
        setLoadingPersons(true);
        try {
            // Se asume que el endpoint para buscar personas es '/tblpersona'
            const response = await axios.get('/tblpersona', {
                params: { search: searchQuery }
            });
            setPersons(response.data.records);
        } catch (error) {
            console.error('Error al buscar personas:', error);
        } finally {
            setLoadingPersons(false);
        }
    };

    const selectPerson = (person) => {
        setFormData(prev => ({
            ...prev,
            tr_per_id: person.per_id // puedes guardar más información si lo requieres
        }));
        setPersonDialogVisible(false);
    };

    return (
        <div style={{ padding: '2rem' }}>
            {/* Sección de Transacciones de Horas Extras */}
            <div style={{ marginTop: '2rem' }}>
                <h2>Registro de Horas Extras</h2>
                <Button 
                    label="Nueva Transacción" 
                    icon="pi pi-plus" 
                    onClick={openNew} 
                    style={{ marginBottom: '1rem' }} 
                />

                <DataTable value={tbltransacciones} responsiveLayout="scroll">
                    <Column field="tr_id" header="ID" />
                    <Column field="tr_pc_id" header="PC ID" />
                    <Column field="tr_per_id" header="ID Usuario" />
                    <Column field="tr_fa_id" header="FA ID" />
                    <Column field="tr_fecha_inicio" header="Fecha Inicio" />
                    <Column field="tr_fecha_fin" header="Fecha Fin" />
                    <Column field="tr_monto" header="Monto" />
                    <Column field="tr_estado" header="Estado" />
                    <Column header="Acciones" body={actionBodyTemplate} />
                </DataTable>

                {/* Diálogo para crear/editar transacción */}
                <Dialog
                    visible={dialogVisible}
                    style={{ width: '450px' }}
                    header={editing ? 'Editar Transacción' : 'Nueva Transacción'}
                    modal
                    className="p-fluid"
                    footer={dialogFooter}
                    onHide={() => setDialogVisible(false)}
                >
                    <div className="field">
                        <label htmlFor="tr_pc_id">PC ID</label>
                        <InputText 
                            id="tr_pc_id" 
                            value={formData.tr_pc_id} 
                            onChange={(e) => onInputChange(e, 'tr_pc_id')} 
                        />
                    </div>

                    <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="tr_per_id">ID Usuario Seleccionado</label>
                            <InputText 
                                id="tr_per_id" 
                                value={formData.tr_per_id} 
                                onChange={(e) => onInputChange(e, 'tr_per_id')} 
                                disabled
                            />
                        </div>
                        <Button 
                            icon="pi pi-search" 
                            className="p-button-rounded p-ml-2" 
                            onClick={() => setPersonDialogVisible(true)}
                            tooltip="Buscar persona"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="tr_fa_id">FA ID</label>
                        <InputText 
                            id="tr_fa_id" 
                            value={formData.tr_fa_id} 
                            onChange={(e) => onInputChange(e, 'tr_fa_id')} 
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="tr_fecha_inicio">Fecha Inicio</label>
                        <Calendar 
                            id="tr_fecha_inicio"
                            value={formData.tr_fecha_inicio}
                            onChange={(e) => onInputChange(e, 'tr_fecha_inicio')}
                            dateFormat="yy-mm-dd"
                            showTime
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="tr_fecha_fin">Fecha Fin</label>
                        <Calendar 
                            id="tr_fecha_fin"
                            value={formData.tr_fecha_fin}
                            onChange={(e) => onInputChange(e, 'tr_fecha_fin')}
                            dateFormat="yy-mm-dd"
                            showTime
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="tr_monto">Monto</label>
                        <InputNumber 
                            id="tr_monto" 
                            value={formData.tr_monto} 
                            onValueChange={(e) => onInputChange(e, 'tr_monto')} 
                            mode="decimal" 
                            minFractionDigits={2} 
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="tr_estado">Estado</label>
                        <InputText 
                            id="tr_estado" 
                            value={formData.tr_estado} 
                            onChange={(e) => onInputChange(e, 'tr_estado')} 
                        />
                    </div>
                </Dialog>

                {/* Diálogo para buscar y seleccionar una persona */}
                <Dialog
                    visible={personDialogVisible}
                    style={{ width: '600px' }}
                    header="Buscar Persona"
                    modal
                    className="p-fluid"
                    onHide={() => setPersonDialogVisible(false)}
                >
                    <div className="p-grid p-ai-center">
                        <div className="p-col-9">
                            <InputText 
                                placeholder="Ingrese nombre, apellidos o número de documento" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="p-col-3">
                            <Button label="Buscar" icon="pi pi-search" onClick={searchPersons} />
                        </div>
                    </div>

                    {loadingPersons ? (
                        <div className="p-d-flex p-jc-center p-mt-3">
                            <ProgressSpinner />
                        </div>
                    ) : (
                        <DataTable value={persons} paginator rows={5} className="p-mt-3" selectionMode="single" onRowSelect={(e) => selectPerson(e.data)} dataKey="per_id">
                            <Column field="per_id" header="ID" />
                            <Column field="per_nombres" header="Nombres" />
                            <Column field="per_ap_paterno" header="Apellido Paterno" />
                            <Column field="per_ap_materno" header="Apellido Materno" />
                            <Column field="per_num_doc" header="N° Documento" />
                        </DataTable>
                    )}
                </Dialog>
            </div>
        </div>
    );
};

export default ExtraHours;
