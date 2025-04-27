import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Title } from 'components/Title';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import useApp from 'hooks/useApp';
import axios from 'axios';
import { addLocale } from 'primereact/api';

addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
});

const ProcesosRH = () => {
    const app = useApp();
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [tiposProceso, setTiposProceso] = useState([]);
    const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
    const [loadingProcesos, setLoadingProcesos] = useState(true);
    
    // Funcionario
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioSeleccionado, setFuncionarioSeleccionado] = useState(null);
    const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);
    
    // Item
    const [items, setItems] = useState([]);
    const [itemSeleccionado, setItemSeleccionado] = useState(null);
    const [loadingItems, setLoadingItems] = useState(false);

    // Cargar tipos de proceso (licencias y sanciones)
    useEffect(() => {
        const fetchProcesos = async () => {
            setLoadingProcesos(true);
            try {
                const licenciasResponse = await axios.get('/tblcatalogo/byTipo/Tipo_Licencia');
                const licenciasData = licenciasResponse.data || []; // Asegurar que sea un array
                const licencias = licenciasData.map(item => ({
                    id: item.cat_id,
                    descripcion: item.cat_descripcion,
                }));
                
                // Obtenemos las sanciones ESPECÍFICAS de tbl_pla_factor
                const sancionesResponse = await axios.get('/tblplafactor/sancionesParaProcesamiento');
                const sancionesData = sancionesResponse.data?.records || [];
                const sanciones = sancionesData.map(item => ({
                    id: item.fa_id,
                    descripcion: item.fa_descripcion, 
                }));
                
                const groupedOptions = [];
                if (licencias.length > 0) {
                    groupedOptions.push({ tipo: 'Licencia', items: licencias });
                }
                if (sanciones.length > 0) {
                    groupedOptions.push({ tipo: 'Sanción', items: sanciones });
                }

                setTiposProceso(groupedOptions);
            } catch (error) {
                console.error('Error al cargar tipos de proceso:', error);
                app.flashMsg('Error', 'No se pudieron cargar los tipos de proceso', 'error');
                setTiposProceso([]);
            } finally {
                setLoadingProcesos(false);
            }
        };
        
        fetchProcesos();
    }, [app]);

    useEffect(() => {
        const fetchFuncionarios = async () => {
            setLoadingFuncionarios(true);
            try {
                const response = await axios.get('/tblpersona', { params: { limit: -1 } });
                if (response.data && response.data.records) {
                    const funcionariosMapped = response.data.records.map(person => ({
                        id: person.per_id,
                        nombreCompleto: `${person.per_nombres || ''} ${person.per_ap_paterno || ''} ${person.per_ap_materno || ''}`.trim(),
                        ci: person.per_num_doc
                    }));
                    setFuncionarios(funcionariosMapped);
                } else {
                    setFuncionarios([]);
                }
            } catch (error) {
                console.error('Error al cargar funcionarios:', error);
                app.flashMsg('Error', 'No se pudieron cargar los funcionarios', 'error');
                setFuncionarios([]);
            } finally {
                setLoadingFuncionarios(false);
            }
        };

        fetchFuncionarios();
    }, [app]);

    useEffect(() => {
        const fetchAllItems = async () => {
            setLoadingItems(true);
            try {
                const response = await axios.get('/tblitems', { params: { limit: -1 } });
                if (response.data && response.data.records) {
                    setItems(Array.isArray(response.data.records) ? response.data.records : []);
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error('Error al cargar todos los items:', error);
                app.flashMsg('Error', 'No se pudieron cargar los items', 'error');
                setItems([]);
            } finally {
                setLoadingItems(false);
            }
        };

        fetchAllItems();
    }, [app]);

    const itemTemplate = (option) => {
        return (
            <div className="flex flex-column">
                <span className="font-bold">{`${option.ca_ti_item}-${option.ca_num_item}`}</span>
                <small className="text-color-secondary">{option.cargo}</small>
            </div>
        );
    };

    const funcionarioOptionTemplate = (option) => {
        return (
            <div className="flex flex-column">
                <span className="font-bold">{option.nombreCompleto}</span>
                <small className="text-color-secondary">CI: {option.ci}</small>
            </div>
        );
    };

    const limpiarFormulario = () => {
        setFechaInicio(null);
        setFechaFin(null);
        setProcesoSeleccionado(null);
        setFuncionarioSeleccionado(null);
        setItemSeleccionado(null);
    };

    const procesarSolicitud = () => {
        if (!fechaInicio || !fechaFin || !procesoSeleccionado || !funcionarioSeleccionado || !itemSeleccionado) {
            app.flashMsg('Error', 'Debe completar todos los campos', 'error');
            return;
        }

        app.flashMsg('Éxito', 'Solicitud procesada correctamente (simulado)', 'success');
        limpiarFormulario();
    };

    return (
        <div className="card">
            <Title title="Procesos de Recursos Humanos" />
            
            {/* Rango de Fechas */}
            <Card title="Rango de Fechas" className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-6 mb-2">
                        <span className="p-float-label">
                            <Calendar
                                id="fechaInicio"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.value)}
                                dateFormat="dd/mm/yy"
                                showIcon
                                locale="es"
                                className="w-full"
                            />
                            <label htmlFor="fechaInicio">Fecha Inicio</label>
                        </span>
                    </div>
                    <div className="col-12 md:col-6 mb-2">
                        <span className="p-float-label">
                            <Calendar
                                id="fechaFin"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.value)}
                                dateFormat="dd/mm/yy"
                                showIcon
                                locale="es"
                                className="w-full"
                                minDate={fechaInicio}
                            />
                            <label htmlFor="fechaFin">Fecha Fin</label>
                        </span>
                    </div>
                </div>
            </Card>

            {/* Proceso */}
            <Card title="Proceso" className="mb-4">
                <div className="grid">
                    <div className="col-12 mb-2">
                        <span className="p-float-label">
                            {loadingProcesos ? (
                                <div className="flex justify-content-center">
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                                </div>
                            ) : (
                                <Dropdown
                                    id="proceso"
                                    value={procesoSeleccionado}
                                    onChange={(e) => setProcesoSeleccionado(e.value)}
                                    options={tiposProceso}
                                    optionLabel="descripcion"
                                    optionValue="id"
                                    filter
                                    className="w-full"
                                    placeholder="Seleccione un proceso"
                                    optionGroupLabel="tipo"
                                    optionGroupChildren="items"
                                />
                            )}
                            <label htmlFor="proceso">Seleccione Proceso</label>
                        </span>
                    </div>
                </div>
            </Card>

            {/* Selección de Funcionario */}
            <Card title="Funcionario" className="mb-4">
                <div className="grid">
                    <div className="col-12 mb-2">
                        <span className="p-float-label">
                             {loadingFuncionarios ? (
                                <div className="flex justify-content-center">
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                                </div>
                            ) : (
                                <Dropdown
                                    id="funcionario"
                                    value={funcionarioSeleccionado}
                                    options={funcionarios}
                                    onChange={(e) => setFuncionarioSeleccionado(e.value)}
                                    optionLabel="nombreCompleto"
                                    optionValue="id"
                                    placeholder="Seleccione un funcionario"
                                    filter 
                                    showClear
                                    filterBy="nombreCompleto,ci"
                                    itemTemplate={funcionarioOptionTemplate}
                                    className="w-full"
                                />
                            )}
                            <label htmlFor="funcionario">Seleccionar Funcionario</label>
                        </span>
                    </div>
                </div>
            </Card>

            {/* Selección de Item */}
            <Card title="Item" className="mb-4">
                <div className="grid">
                    <div className="col-12 mb-2">
                        {loadingItems ? (
                            <div className="flex justify-content-center">
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                            </div>
                        ) : (
                            <div>
                                {items.length > 0 ? (
                                    <DataTable
                                        value={items}
                                        selection={itemSeleccionado}
                                        onSelectionChange={(e) => setItemSeleccionado(e.value)}
                                        selectionMode="single"
                                        dataKey="ca_id"
                                        paginator
                                        rows={5}
                                        emptyMessage="No se encontraron items" 
                                        className="p-datatable-sm"
                                        filterDisplay="row"
                                        globalFilterFields={['ca_num_item', 'cargo_descripcion', 'unidad_organizacional']}
                                    >
                                        <Column 
                                            field="ca_num_item" 
                                            header="N° Item" 
                                            body={(rowData) => `${rowData.ca_ti_item || ''}-${rowData.ca_num_item || ''}`} 
                                            sortable 
                                            filter
                                            filterPlaceholder="Buscar N°"
                                        />
                                        <Column 
                                            field="cargo_descripcion"
                                            header="Cargo" 
                                            sortable 
                                            filter
                                            filterPlaceholder="Buscar Cargo"
                                        /> 
                                        <Column 
                                            field="unidad_organizacional"
                                            header="Unidad Organizacional" 
                                            sortable 
                                            filter
                                            filterPlaceholder="Buscar Unidad"
                                        />
                                        <Column
                                            field="ns_haber_basico"
                                            header="Haber Básico"
                                            body={(rowData) => rowData.ns_haber_basico ? new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(rowData.ns_haber_basico) : '-'}
                                            sortable
                                        />
                                    </DataTable>
                                ) : ( 
                                    <div className="p-3 text-center">
                                        <p>No se encontraron items disponibles.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-content-end mt-4 gap-2">
                <Button
                    label="Limpiar"
                    icon="pi pi-eraser"
                    className="p-button-outlined"
                    onClick={limpiarFormulario}
                />
                <Button
                    label="Procesar"
                    icon="pi pi-check"
                    onClick={procesarSolicitud}
                    disabled={!fechaInicio || !fechaFin || !procesoSeleccionado || !funcionarioSeleccionado || !itemSeleccionado} // Actualizar condición disabled
                />
            </div>
        </div>
    );
};

export default ProcesosRH;