import React from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

const ItemDetailsSidebar = ({ item, contrato, onCreateContract }) => {
    const hasValue = (value) => {
        return value !== undefined && value !== null && value !== '';
    };

    if (!item && !contrato) {
        return (
            <div className="card shadow-2">
                <div className="card-header bg-primary text-white p-3">
                    <h5 className="m-0">Detalles</h5>
                </div>
                <div className="p-4 flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                        <i className="pi pi-info-circle text-6xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500">Seleccione un ítem o contrato para ver los detalles</p>
                    </div>
                </div>
            </div>
        );
    }

    if (contrato) {
        return (
            <div className="card shadow-2">
                <div className="card-header bg-primary text-white p-3">
                    <h5 className="m-0">Detalles del Ítem</h5>
                </div>
                <div className="p-3">
                    <div className="mb-3">
                        <div className="bg-secondary text-white p-2 border-round">
                            <h6 className="m-0 font-bold">Contrato</h6>
                        </div>
                    </div>
                    
                    <div className="flex align-items-center mb-3">
                        <h5 className="text-xl mb-0 text-secondary">{contrato.cargo}</h5>
                    </div>
                    
                    <div className="grid">
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Código Item</div>
                                <div className="font-medium">{contrato.codigo_item}</div>
                            </div>
                        </div>
                        
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Haber Básico</div>
                                <div className="font-medium">
                                    {contrato.haber_basico 
                                        ? `Bs. ${parseFloat(contrato.haber_basico).toFixed(2)}` 
                                        : "Bs. 0.00"}
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Unidad Organizacional</div>
                                <div className="font-medium">{contrato.unidad_organizacional}</div>
                            </div>
                        </div>
                        
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Tiempo Jornada</div>
                                <div className="font-medium">{contrato.tiempoJornada}</div>
                            </div>
                        </div>
                        
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Cantidad</div>
                                <div className="font-medium">{contrato.cantidad}</div>
                            </div>
                        </div>
                        
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Fecha Creación</div>
                                <div className="font-medium">
                                    {new Date(contrato.fecha_creacion).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-2">
            <div className="card-header bg-primary text-white p-3">
                <h5 className="m-0">Detalles del Ítem</h5>
            </div>
            <div className="p-3">
                <div className="flex align-items-center mb-3 justify-content-between">
                    <h5 className="text-xl mb-0 text-primary">{item.title}</h5>
                    {item.contratos && item.contratos.length > 0 && (
                        <Badge value={`${item.contratos.length} contrato(s)`} severity="success" />
                    )}
                </div>
                
                <div className="grid">
                    {hasValue(item.categoriaPragmatica) && (
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Categoría Pragmática</div>
                                <div className="font-medium">{item.categoriaPragmatica}</div>
                            </div>
                        </div>
                    )}
                    
                    {hasValue(item.categoriaAdministrativa) && (
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Categoría Administrativa</div>
                                <div className="font-medium">{item.categoriaAdministrativa}</div>
                            </div>
                        </div>
                    )}
                </div>

                <Divider />
                
                <div className="flex justify-content-center mt-3">
                    <Button
                        label="Crear contrato"
                        icon="pi pi-plus"
                        className="p-button-outlined"
                        onClick={() => onCreateContract(item.id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ItemDetailsSidebar;
