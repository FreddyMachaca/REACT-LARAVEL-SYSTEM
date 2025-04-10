import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import axios from 'axios';

const Configuracion = () => {
    const { personaId } = useParams();
    const app = useApp();
    const [persona, setPersona] = useState(null);
    const [loading, setLoading] = useState(true);

    const cardHoverStyle = {
        transition: 'all 0.3s ease',
    };

    const [hoveredCard, setHoveredCard] = useState(null);
    
    useEffect(() => {
        const fetchPersona = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/tblpersona/view/${personaId}`);
                setPersona(response.data);
                setLoading(false);
            } catch (error) {
                app.flashMsg('Error', `Error al cargar datos del personal: ${error.message}`, 'error');
                setLoading(false);
            }
        };
        
        fetchPersona();
    }, [personaId, app]);
    
    // Lista
    const configOptions = [
        {
            id: "horas_extra",
            title: "Registro de Horas Extra",
            description: "Gestionar horas extra del funcionario",
            longDescription: "Permite registrar y administrar las horas extra trabajadas por el funcionario.",
            icon: "pi pi-clock",
            color: "#14B8A6",
            route: `/gestionPersonal/horas-extra/${personaId}`,
            enabled: true,
        },
        {
            id: "aporte_iva",
            title: "Registro Aporte IVA",
            description: "Gestionar aportes IVA del funcionario",
            longDescription: "Permite el registro y seguimiento de los aportes de IVA realizados por el funcionario.",
            icon: "pi pi-percentage",
            color: "#8B5CF6",
            route: `/gestionPersonal/aporte-iva/${personaId}`,
            enabled: true,
        },
        {
            id: "bono_antiguedad",
            title: "Bono de Antiguedad",
            description: "Gestión de bonos por antigüedad",
            longDescription: "Administra los bonos por antigüedad aplicados según la normativa vigente para el funcionario.",
            icon: "pi pi-calendar",
            color: "#F97316",
            route: `/gestionPersonal/bono-antiguedad/${personaId}`,
            enabled: true,
        },
        {
            id: "Recuperacion de pagos_servicios",
            title: "Pagos de Servicios",
            description: "Administrar pagos de servicios del funcionario",
            longDescription: "Gestiona los pagos de servicios.",
            icon: "pi pi-credit-card",
            color: "#3B82F6",
            route: `/gestionPersonal/pagos-servicios/${personaId}`,
            enabled: true,
        },
        {
            id: "sanciones",
            title: "Administración de Sanciones",
            description: "Gestionar sanciones aplicadas al funcionario",
            longDescription: "Permite registrar y dar seguimiento a las sanciones administrativas aplicadas al funcionario.",
            icon: "pi pi-exclamation-triangle",
            color: "#EF4444",
            route: `/gestionPersonal/sanciones/${personaId}`,
            enabled: true,
        }
    ];
    
    const handleCardClick = (option) => {
        if (option.enabled) {
            app.navigate(option.route);
        } else {
            app.flashMsg('Información', 'Esta funcionalidad estará disponible próximamente', 'info');
        }
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
            <Title title={`Gestionar para ${persona?.per_nombres} ${persona?.per_ap_paterno}`} />
            
            <div className="mb-4">
                <Button 
                    icon="pi pi-arrow-left" 
                    className="p-button-text" 
                    onClick={() => app.navigate(`/gestionPersonal`)} 
                    label="Volver al listado de personal"
                />
            </div>
            
            <div className="grid">
                {configOptions.map((option) => (
                    <div key={option.id} className="col-12 md:col-6 lg:col-4 xl:col-3 mb-3">
                        <Card 
                            className={`cursor-pointer ${!option.enabled ? 'opacity-60' : ''}`} 
                            onClick={() => handleCardClick(option)}
                            style={{
                                ...cardHoverStyle,
                                transform: hoveredCard === option.id ? 'translateY(-5px)' : 'translateY(0)',
                                boxShadow: hoveredCard === option.id 
                                    ? '0 8px 16px rgba(0, 0, 0, 0.1)' 
                                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                                borderLeft: hoveredCard === option.id ? `4px solid ${option.color}` : '1px solid #dee2e6'
                            }}
                            onMouseEnter={() => setHoveredCard(option.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="flex flex-column h-full">
                                <div className="flex align-items-center mb-3">
                                    <div 
                                        className="border-round mr-3 flex align-items-center justify-content-center"
                                        style={{ 
                                            width: '3rem', 
                                            height: '3rem', 
                                            backgroundColor: option.color + '20'
                                        }}
                                    >
                                        <i className={`${option.icon}`} style={{ fontSize: '1.5rem', color: option.color }}></i>
                                    </div>
                                    <div>
                                        <h3 className="m-0 text-md font-bold">{option.title}</h3>
                                    </div>
                                </div>
                                
                                <p className="m-0 text-sm text-color-secondary mt-1 mb-4">
                                    {option.description}
                                </p>
                                
                                {!option.enabled && (
                                    <div className="text-sm bg-gray-100 p-2 border-round mt-auto">
                                        <i className="pi pi-info-circle mr-2"></i>
                                        <span>Próximamente</span>
                                    </div>
                                )}
                                
                                <div className="mt-auto pt-3 flex align-items-center justify-content-end">
                                    <Button 
                                        label="Acceder" 
                                        icon="pi pi-arrow-right" 
                                        className={`p-button-text p-button-sm ${hoveredCard === option.id ? 'p-button-raised' : ''}`}
                                        disabled={!option.enabled}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Configuracion;
