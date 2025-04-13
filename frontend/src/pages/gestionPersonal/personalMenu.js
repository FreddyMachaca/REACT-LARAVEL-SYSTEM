import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import axios from 'axios';
import PagosServicioModal from './pagosServivicio'; 
import GestionSanciones from './gestionSanciones';
import HorasExtras from './horasExtras';
import BonoAntiguedad from './bonoAntiguedad';

const PersonalConfiguracion = () => {
    const { personaId } = useParams();
    const app = useApp();
    const [persona, setPersona] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
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

        fetchPersonaDetails();
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
            <Title title="Configuración de Personal" />
            
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

            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Horas Extras" leftIcon="pi pi-clock">
                    <HorasExtras personaId={personaId} />
                </TabPanel>
                <TabPanel header="Bono Antigüedad">
                    <BonoAntiguedad personaId={personaId} />
                </TabPanel>
                <TabPanel header="Sanciones" leftIcon="pi pi-exclamation-triangle">
                    <GestionSanciones personaId={personaId} />
                </TabPanel>
                <TabPanel header="Pagos de Servicios" leftIcon="pi pi-paperclip">
                    <PagosServicioModal 
                        personaId={personaId} 
                        embedded={true}
                        show={true} 
                    />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default PersonalConfiguracion;
