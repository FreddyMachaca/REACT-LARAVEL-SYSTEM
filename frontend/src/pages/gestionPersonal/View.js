import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import axios from 'axios';

const TblPersonalView = () => {
    const { personaId } = useParams();
    const app = useApp();
    
    const [persona, setPersona] = useState(null);
    const [personaInfo, setPersonaInfo] = useState(null);
    const [edad, setEdad] = useState(0);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchPersonaInfo = async () => {
            try {
                setLoading(true);
                let infoResponse;
                try {
                    infoResponse = await axios.get(`/tbltipoaportante/personaInfo/${personaId}`);
                } catch (error) {
                    infoResponse = { data: null };
                }
                
                const personaResponse = await axios.get(`/tblpersona/view/${personaId}`);
                
                setPersona(personaResponse.data);
                setPersonaInfo(infoResponse.data || personaResponse.data);
                const calculatedEdad = calcularEdad(personaResponse.data.per_fecha_nac);
                setEdad(calculatedEdad);
                setLoading(false);
            } catch (error) {
                app.flashMsg('Error', `Error al cargar datos: ${error.message}`, 'error');
                setLoading(false);
            }
        };
        
        fetchPersonaInfo();
    }, [personaId, app]);
    
    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="card">
            <Title title={`Información del Personal - ${persona?.per_nombres} ${persona?.per_ap_paterno} ${persona?.per_ap_materno}`} />
            
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

                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex flex-column w-full">
                                            <div className="flex align-items-center mb-2">
                                                <i className="pi pi-sitemap text-primary mr-2"></i>
                                                <span className="text-600">Categoría Administrativa</span>
                                            </div>
                                            <div className="flex flex-column">
                                                <span className="font-medium mb-2">
                                                    {personaInfo?.categoria_administrativa || 'No asignada'}
                                                </span>
                                                <div className="flex align-items-center gap-2">
                                                    <span className="text-sm text-500">CATEGORÍA</span>
                                                    <span className="text-sm bg-primary-100 text-primary-700 p-2 border-round">
                                                        {personaInfo?.codigo_administrativo || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex flex-column w-full">
                                            <div className="flex align-items-center mb-2">
                                                <i className="pi pi-bookmark text-primary mr-2"></i>
                                                <span className="text-600">Categoría Programática</span>
                                            </div>
                                            <div className="flex flex-column">
                                                <span className="font-medium mb-2">
                                                    {personaInfo?.categoria_programatica || 'No asignada'}
                                                </span>
                                                <div className="flex align-items-center gap-2">
                                                    <span className="text-sm text-500">CATEGORÍA</span>
                                                    <span className="text-sm bg-primary-100 text-primary-700 p-2 border-round">
                                                        {personaInfo?.codigo_programatico || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
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
                
                
            </div>
        </div>
    );
};

export default TblPersonalView;
