import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import axios from "axios";

function TtblCpLicenciaJustificadaAdd() {
    const { personaId } = useParams();
    const [tiposLicencia, setTiposLicencia] = useState(null);
    const [autorizadores, setAutorizadores] = useState(null);
    const [persona, setPersona] = useState(null);
    const [habilitarTexto, setHabilitarTexto] = useState(true);


    useEffect(() => {
      fetchData();

    }, []);
    
    const fetchData = async () => {
        try {
            const [resLicencias, resAutorizadores] = await Promise.all([
                axios.get('/tblcatalogo/get-tipo-licencia'),
                axios.get('/tblpersona/getoptions')
            ]);

            const [personaResponse, infoResponse] = await Promise.all([
                axios.get(`/tblpersona/view/${personaId}`),
                axios.get(`/tbltipoaportante/personaInfo/${personaId}`)
            ]);
            setPersona({...personaResponse.data, ...infoResponse.data});

            const tiposLicencia = resLicencias.data;
            const autorizadores = resAutorizadores.data;

            setTiposLicencia(tiposLicencia);
            setAutorizadores(autorizadores);

        } catch(error){
            console.error(error);
        }
    };

    useEffect(() => {
      console.log(persona)
    }, [persona])
    

    return (
        <>
        <div className="flex flex-wrap gap-5">
            <div className="p-4 surface-card border-round shadow-2 md:col-7">
                <h5 className="mb-4">Datos para el registro de la Licencia</h5>
                <div className="grid formgrid">
                    <div className="field col-12">
                        <label htmlFor="tipoLicencia">Tipo Licencia</label>
                        <Dropdown options={tiposLicencia} optionValue='cat_id' optionLabel="cat_descripcion" placeholder="Seleccionar..." className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="motivo">Motivo</label>
                        <InputText className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="lugar">Lugar</label>
                        <InputText className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="fechaInicio">Fecha Inicio</label>
                        <Calendar showIcon className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="fechaFin">Fecha Fin</label>
                        <Calendar showIcon className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="horaInicio">Hora Inicio</label>
                        <Calendar timeOnly showIcon className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="horaFin">Hora Fin</label>
                        <Calendar timeOnly showIcon className="w-full" />
                    </div>

                    <div className="field col-6 flex align-items-center gap-2">
                        <label htmlFor="habilitarTexto" className="mb-0">¿Habilitar texto?</label>
                        <InputSwitch checked={habilitarTexto} />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="autorizador">Autorizado por</label>
                        <Dropdown options={autorizadores} optionValue='per_id' 
                        optionLabel={(option) => `${option.per_nombres} ${option?.per_ap_materno} ${option?.per_ap_paterno}`}
                        placeholder="Seleccionar autorizador" className="w-full" />
                    </div>

                    <div className="field col-12 text-right">
                        <Button label="Guardar" icon="pi pi-check" className="p-button-primary" />
                    </div>
                </div>
            </div>
            <div className="surface-card border-round shadow-2 col-4 p-3">
                <div className="flex align-items-center justify-content-center mt-4 mb-3 md:mb-0" style={{minWidth: '200px'}}>
                    <div className="bg-primary w-8rem h-8rem border-circle flex align-items-center justify-content-center">
                        <i className="pi pi-user text-white" style={{ fontSize: '4rem' }}></i>
                    </div>
                </div>
                <div className="grid">
                    <div className="col-12">
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

                    <div className="col-12">
                        <h3 className="text-lg font-semibold mb-3">Categorías</h3>
                        <div className="flex flex-column gap-3">
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

                    <div className="col-12">
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
        </>
    );
}

export default TtblCpLicenciaJustificadaAdd