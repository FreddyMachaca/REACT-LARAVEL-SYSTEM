import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import useApp from 'hooks/useApp';
import axios from 'axios';
import DialogCalendar from './DialogCalendar';


function TblCpAsigcionHorarioAdd() {
    const app = useApp();
    const { personaId } = useParams();
    const [ persona, setPersona ] = useState(null);
    const [ personaSchedule, setPersonaSchedule ] = useState();
    const [ loading, setLoading ] = useState(true);
    const [ tipoHorario, setTipoHorario ] = useState('');
    const [ dialogCalendar, setDialogCalendar ] = useState(false);
    

    useEffect(() => {
        fetchPersonaDetails();
        fetchSchedule();
    }, [personaId, app]);

    const fetchPersonaDetails = async () => {
        try {
            setLoading(true);
            const [personaResponse, infoResponse] = await Promise.all([
                axios.get(`/tblpersona/view/${personaId}`),
                axios.get(`/tbltipoaportante/personaInfo/${personaId}`)
            ]);
            setPersona({...personaResponse.data, ...infoResponse.data});
            setLoading(false);
        } catch (error) {
            app.flashMsg('Error', error.message, 'error');
            setLoading(false);
        }
    };

    const fetchSchedule = async () => {
        try {
            const { data } = await axios.get(`tblcpasignacionhorario/getschedule/${personaId}`);

            setPersonaSchedule( transformSchedule(data[0]) );
            setTipoHorario(data[0].tipo_horario.cat_descripcion);
        } catch (error){
            app.flashMsg('Error', error.message, 'error');
        }
    }

    const transformSchedule = (registro) => {
        const dias = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
        return dias.map((dia) => {
            return {
                dia: dia.charAt(0).toUpperCase() + dia.slice(1),
                ingreso1: registro[`ah_${dia}_ing1`] || 'No registrado',
                salida1: registro[`ah_${dia}_sal1`] || 'No registrado',
                ingreso2: registro[`ah_${dia}_ing2`] || 'No registrado',
                salida2: registro[`ah_${dia}_sal2`] || 'No registrado',
            };
        });
    };

    const actionTemplate = (rowData) => {
        return (
          <div className="flex gap-2">
            <Button
              icon="pi pi-eye"
              className="p-button-rounded p-button-success p-button-text"
            //   onClick={() => handleView(rowData)}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger p-button-text"
            //   onClick={() => handleDelete(rowData.id)}
            />
          </div>
        );
      };
    
  return (
    <>
        <div className='card'>
            <Card className="mb-4">
                <div className="flex flex-column md:flex-row">
                    {/* Avatar Section */}
                    <div className="flex align-items-center justify-content-center mr-4 mb-3 md:mb-0" style={{minWidth: '200px'}}>
                        <div className="bg-primary w-8rem h-8rem border-circle flex align-items-center justify-content-center">
                            <i className="pi pi-user text-white" style={{ fontSize: '4rem' }}></i>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold m-0 mb-3">
                            {`${persona?.per_nombres || ''} ${persona?.per_ap_paterno || ''} ${persona?.per_ap_materno || ''}`}
                        </h2>

                        <div className="surface-100 border-round-xl p-4 w-full">
                            <div className="grid">
                                <div className="col-12 md:col-4">
                                    <h3 className="text-lg font-semibold mb-3">Información Laboral</h3>
                                    <div className="flex flex-column gap-3">
                                        <div className="flex align-items-center justify-content-between">
                                            <div className="flex align-items-center">
                                                <i className="pi pi-briefcase text-primary mr-2"></i>
                                                <span className="text-600">Puesto</span>
                                            </div>
                                            <span className="font-medium">{persona?.cargo_descripcion || 'No asignado'}</span>
                                        </div>
                                        <div className="flex align-items-center justify-content-between">
                                            <div className="flex align-items-center">
                                                <i className="pi pi-money-bill text-primary mr-2"></i>
                                                <span className="text-600">Haber Básico</span>
                                            </div>
                                            <span className="text-primary font-bold">
                                                {persona?.ns_haber_basico 
                                                    ? new Intl.NumberFormat('es-BO', { 
                                                        style: 'currency', 
                                                        currency: 'BOB' 
                                                    }).format(persona.ns_haber_basico)
                                                    : 'No asignado'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex align-items-center justify-content-between">
                                            <div className="flex align-items-center">
                                                <i className="pi pi-chart-line text-primary mr-2"></i>
                                                <span className="text-600">Escalafón</span>
                                            </div>
                                            <span className="font-medium">{persona?.es_escalafon || 'No asignado'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-4">
                                    <h3 className="text-lg font-semibold mb-3">Categorías</h3>
                                    <div className="flex flex-column gap-3">
                                        {/* Categoría Administrativa */}
                                        <div className="p-2 border-round bg-gray-50">
                                            <div className="flex align-items-center mb-2">
                                                <i className="pi pi-sitemap text-primary mr-2"></i>
                                                <span className="text-600">Categoría Administrativa</span>
                                            </div>
                                            <div className="flex flex-column">
                                                <span className="font-medium mb-2">
                                                    {persona?.categoria_administrativa || 'No asignada'}
                                                </span>
                                                <div className="flex align-items-center gap-2">
                                                    <span className="text-sm text-500">CATEGORÍA</span>
                                                    <span className="text-sm bg-primary-100 text-primary-700 p-2 border-round">
                                                        {persona?.codigo_administrativo || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Categoría Programática */}
                                        <div className="p-2 border-round bg-gray-50">
                                            <div className="flex align-items-center mb-2">
                                                <i className="pi pi-bookmark text-primary mr-2"></i>
                                                <span className="text-600">Categoría Programática</span>
                                            </div>
                                            <div className="flex flex-column">
                                                <span className="font-medium mb-2">
                                                    {persona?.categoria_programatica || 'No asignada'}
                                                </span>
                                                <div className="flex align-items-center gap-2">
                                                    <span className="text-sm text-500">CATEGORÍA</span>
                                                    <span className="text-sm bg-primary-100 text-primary-700 p-2 border-round">
                                                        {persona?.codigo_programatico || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-4">
                                    <h3 className="text-lg font-semibold mb-3">Información Personal</h3>
                                    <div className="flex flex-column gap-3">
                                        <div className="flex align-items-center justify-content-between">
                                            <div className="flex align-items-center">
                                                <i className="pi pi-calendar text-primary mr-2"></i>
                                                <span className="text-600">Fecha Nacimiento</span>
                                            </div>
                                            <span className="font-medium">
                                                {persona?.per_fecha_nac ? new Date(persona.per_fecha_nac).toLocaleDateString() : 'No registrada'}
                                            </span>
                                        </div>
                                        <div className="flex align-items-center justify-content-between">
                                            <div className="flex align-items-center">
                                                <i className="pi pi-id-card text-primary mr-2"></i>
                                                <span className="text-600">CI</span>
                                            </div>
                                            <span className="font-medium">{persona?.per_num_doc || 'No registrado'}</span>
                                        </div>

                                        <h3 className="text-lg font-semibold mt-3 mb-2">Fechas</h3>
                                        <div className="flex align-items-center justify-content-between">
                                            <div className="flex align-items-center">
                                                <i className="pi pi-calendar-plus text-primary mr-2"></i>
                                                <span className="text-600">Alta</span>
                                            </div>
                                            <span className="font-medium">
                                                {persona?.as_fecha_inicio ? new Date(persona.as_fecha_inicio).toLocaleDateString() : 'No asignada'}
                                            </span>
                                        </div>
                                        <div className="flex align-items-center justify-content-between">
                                            <div className="flex align-items-center">
                                                <i className="pi pi-calendar-minus text-primary mr-2"></i>
                                                <span className="text-600">Baja</span>
                                            </div>
                                            <span className="font-medium">
                                                {persona?.as_fecha_fin ? new Date(persona.as_fecha_fin).toLocaleDateString() : 'No asignada'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        <div className='card'>
            <Tag className="m-2 py-2 px-4" value={`Tipo: ${tipoHorario}`}/>

            <DataTable
                loading={loading}
                emptyMessage={
                    <div className="p-4 text-center">
                        {loading ? (
                            <ProgressSpinner style={{width:'50px', height:'50px'}} />
                        ) : (
                            "No se encontraron registros válidos"
                        )}
                    </div>
                }
                className="p-datatable-sm"
                responsiveLayout="scroll"
                stripedRows
                lazy
                paginator
                rows={10}
                value={personaSchedule}
                >
                <Column field="dia" header="Día" />
                <Column field="ingreso1" header="Ingreso 1" />
                <Column field="salida1" header="Salida 1" />
                <Column field="ingreso2" header="Ingreso 2" />
                <Column field="salida2" header="Salida 2" />
                
                <Column body={actionTemplate} header="Acciones" style={{width: '100px'}} />
            </DataTable>
        </div>
        <div className="fixed bottom-0 right-0 p-3">
            <div className="flex flex-column align-items-center gap-2">
            <Button
                icon="pi pi-calendar custom-icon-xl"
                className="p-button-rounded p-button-info p-button-lg w-4rem h-4rem text-2xl" 
                onClick={() => setDialogCalendar(true)}
            />
            {/* <Button
                icon="pi pi-plus custom-icon-xl"
                className="p-button-rounded p-button-success p-button-lg w-4rem h-4rem text-2xl" 
                onClick={() => navigate('/tbllicencia')} 
            /> */}
            </div>
        </div>

        <DialogCalendar visible={dialogCalendar} setVisible={setDialogCalendar}/>
    </>
  )
}

export default TblCpAsigcionHorarioAdd