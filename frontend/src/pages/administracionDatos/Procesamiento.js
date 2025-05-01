import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Title } from 'components/Title';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import useApp from 'hooks/useApp';
import axios from 'axios';
import { addLocale } from 'primereact/api';
import { Tag } from 'primereact/tag';

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
    const toast = useRef(null);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    
    const [asistenciaData, setAsistenciaData] = useState([]);
    const [sancionesData, setSancionesData] = useState([]);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [processing, setProcessing] = useState(false);

    const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const limpiarFormulario = () => {
        setFechaInicio(null);
        setFechaFin(null);
        setAsistenciaData([]);
        setSancionesData([]);
        setShowResults(false);
    };

    const fetchGeneratedData = async (fechaInicioStr, fechaFinStr) => {
        setResultsLoading(true);
        setShowResults(true);
        try {
            const response = await axios.get('/asistencia/data', {
                params: {
                    fecha_inicio: fechaInicioStr,
                    fecha_fin: fechaFinStr
                }
            });
            setAsistenciaData(response.data.asistencia || []);
            setSancionesData(response.data.sanciones || []);
        } catch (error) {
            console.error('Error al obtener los datos generados:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los resultados.', life: 5000 });
            setAsistenciaData([]);
            setSancionesData([]);
        } finally {
            setResultsLoading(false);
        }
    };

    const procesarSolicitud = async () => {
        if (!fechaInicio || !fechaFin) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar las fechas de inicio y fin.', life: 3000 });
            return;
        }

        if (fechaFin < fechaInicio) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La fecha de fin no puede ser anterior a la fecha de inicio.', life: 3000 });
            return;
        }

        const fechaInicioFormateada = formatDate(fechaInicio);
        const fechaFinFormateada = formatDate(fechaFin);

        setProcessing(true); 
        setResultsLoading(false);
        setShowResults(false); 
        setAsistenciaData([]); 
        setSancionesData([]);

        try {
            const responseSP = await axios.post('/asistencia/generar', {
                fecha_inicio: fechaInicioFormateada,
                fecha_fin: fechaFinFormateada
            });

            toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseSP.data.message || 'Procedimiento completado.', life: 3000 });

            await fetchGeneratedData(fechaInicioFormateada, fechaFinFormateada);

        } catch (error) {
            console.error('Error en el proceso:', error);
            const errorMsg = error.response?.data?.message || 'Ocurrió un error durante el proceso.';
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMsg, life: 5000 });
            setShowResults(false); 
        } finally {
            setProcessing(false);
        }
    };

    // --- Templates para DataTables ---
    const formatTime = (time) => {
        if (!time) return '-';
        return time.substring(0, 5);
    };

    const statusBodyTemplate = (rowData) => {
        const status = rowData.att_tipo_observado;
        let severity = 'info';
        let value = status;

        switch (status) {
            case 'OK': severity = 'success'; value = 'Normal'; break;
            case 'AT': severity = 'warning'; value = 'Atraso'; break;
            case 'AU': severity = 'danger'; value = 'Ausente'; break;
            case 'JU': severity = 'info'; value = 'Justificado'; break;
            case 'VA': severity = 'contrast'; value = 'Vacación'; break;
            case 'FE': severity = 'secondary'; value = 'Feriado'; break;
            case 'DL': severity = 'secondary'; value = 'Día Libre'; break;
            default: value = status || 'N/A'; break;
        }
        return <Tag severity={severity} value={value}></Tag>;
    };

    const atrasoBodyTemplate = (rowData) => {
        const minutos = rowData.att_min_atraso;
        if (minutos > 0) {
            return <span className="text-orange-600 font-bold">{minutos} min</span>;
        }
        return '0 min';
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString + 'T00:00:00');
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    const tipoSancionBodyTemplate = (rowData) => {
        const tipo = rowData.sa_tipo_sancion;
        let severity = 'info';
        let value = tipo;

        switch (tipo) {
            case 'B': severity = 'danger'; value = 'Descuento Haber'; break;
            default: value = tipo || 'N/A'; break;
        }
        return <Tag severity={severity} value={value}></Tag>;
    };


    return (
        <div className="card">
            <Toast ref={toast} />
            <Title title="Generar y Consultar Reporte de Asistencia" />
            
            {/* Selección de Fechas y Botón de Generar */}
            <Card title="Seleccione el Rango y Genere el Reporte" className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-5 mb-2">
                        <span className="p-float-label">
                            <Calendar
                                id="fechaInicio"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.value)}
                                dateFormat="dd/mm/yy"
                                showIcon
                                locale="es"
                                className="w-full"
                                placeholder="Fecha Inicio"
                            />
                            <label htmlFor="fechaInicio">Fecha Inicio</label>
                        </span>
                    </div>
                    <div className="col-12 md:col-5 mb-2">
                        <span className="p-float-label">
                            <Calendar
                                id="fechaFin"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.value)}
                                dateFormat="dd/mm/yy"
                                showIcon
                                locale="es"
                                className="w-full"
                                placeholder="Fecha Fin"
                            />
                            <label htmlFor="fechaFin">Fecha Fin</label>
                        </span>
                    </div>
                    <div className="col-12 md:col-2 mb-2 flex align-items-center justify-content-end">
                         <Button
                            label={processing ? 'Procesando...' : 'Generar'}
                            icon={processing ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                            onClick={procesarSolicitud}
                            disabled={!fechaInicio || !fechaFin || processing || resultsLoading}
                            className="w-full"
                            tooltip="Ejecuta el proceso y muestra los resultados"
                            tooltipOptions={{ position: 'bottom' }}
                        />
                    </div>
                </div>
                 <Button
                    label="Limpiar"
                    icon="pi pi-eraser"
                    className="p-button-outlined mt-2"
                    onClick={limpiarFormulario}
                    disabled={processing || resultsLoading}
                />
            </Card>

            {/* Sección de Resultados */}
            {showResults && (
                <Card title="Resultados del Proceso" className="mt-4">
                    {resultsLoading ? (
                        <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <ProgressSpinner />
                            <span className="ml-2">Cargando resultados...</span>
                        </div>
                    ) : (
                        <>
                            {/* Tabla de Asistencia */}
                            <div className="mb-5">
                                <h3 className="mb-3">Detalle de Asistencia</h3>
                                <DataTable
                                    value={asistenciaData}
                                    paginator rows={10} rowsPerPageOptions={[10, 25, 50]}
                                    emptyMessage="No se encontraron registros de asistencia para este período."
                                    className="p-datatable-sm"
                                    sortMode="multiple"
                                    removableSort
                                    filterDisplay="row"
                                    globalFilterFields={['nombre_completo', 'per_num_doc', 'att_dia', 'att_tipo_observado', 'licencia_descripcion', 'horario_especial_descripcion']}
                                >
                                    <Column field="att_fecha" header="Fecha" body={(rowData) => formatDateOnly(rowData.att_fecha)} sortable filter filterPlaceholder="Buscar Fecha"/>
                                    <Column field="att_dia" header="Día" sortable filter filterPlaceholder="Buscar Día"/>
                                    <Column field="nombre_completo" header="Funcionario" sortable filter filterPlaceholder="Buscar Nombre"/>
                                    <Column field="per_num_doc" header="CI" sortable filter filterPlaceholder="Buscar CI"/>
                                    <Column field="att_ing1" header="Ing. Mañana" body={(rowData) => formatTime(rowData.att_ing1)} style={{ textAlign: 'center' }}/>
                                    <Column field="att_sal1" header="Sal. Mañana" body={(rowData) => formatTime(rowData.att_sal1)} style={{ textAlign: 'center' }}/>
                                    <Column field="att_ing2" header="Ing. Tarde" body={(rowData) => formatTime(rowData.att_ing2)} style={{ textAlign: 'center' }}/>
                                    <Column field="att_sal2" header="Sal. Tarde" body={(rowData) => formatTime(rowData.att_sal2)} style={{ textAlign: 'center' }}/>
                                    <Column field="att_min_atraso" header="Atraso (min)" body={atrasoBodyTemplate} sortable style={{ textAlign: 'center' }}/>
                                    <Column field="att_tipo_observado" header="Estado" body={statusBodyTemplate} sortable filter filterPlaceholder="Buscar Estado"/>
                                    <Column field="licencia_descripcion" header="Justificación" filter filterPlaceholder="Buscar Just."/>
                                    <Column field="horario_especial_descripcion" header="Horario Especial" filter filterPlaceholder="Buscar Motivo HE"/>
                                </DataTable>
                            </div>

                            {/* Tabla de Sanciones */}
                            <div>
                                <h3 className="mb-3">Sanciones Generadas</h3>
                                <DataTable
                                    value={sancionesData}
                                    paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                    emptyMessage="No se encontraron sanciones generadas para este período."
                                    className="p-datatable-sm"
                                    sortMode="multiple"
                                    removableSort
                                    filterDisplay="row"
                                    globalFilterFields={['nombre_completo', 'per_num_doc', 'factor_descripcion', 'sa_tipo_sancion']}
                                >
                                    <Column field="fecha_sancion" header="Fecha Sanción" body={(rowData) => formatDateOnly(rowData.fecha_sancion)} sortable filter filterPlaceholder="Buscar Fecha"/>
                                    <Column field="nombre_completo" header="Funcionario" sortable filter filterPlaceholder="Buscar Nombre"/>
                                    <Column field="per_num_doc" header="CI" sortable filter filterPlaceholder="Buscar CI"/>
                                    <Column field="factor_descripcion" header="Motivo (Factor)" sortable filter filterPlaceholder="Buscar Motivo"/>
                                    <Column field="sa_minutos" header="Minutos Atraso" sortable style={{ textAlign: 'center' }}/>
                                    <Column field="sa_tipo_sancion" header="Tipo Sanción" body={tipoSancionBodyTemplate} sortable filter filterPlaceholder="Buscar Tipo"/>
                                    <Column field="sa_dias_sancion" header="Días Sanción" sortable style={{ textAlign: 'center' }}/>
                                </DataTable>
                            </div>
                        </>
                    )}
                </Card>
            )}
        </div>
    );
};

export default ProcesosRH;