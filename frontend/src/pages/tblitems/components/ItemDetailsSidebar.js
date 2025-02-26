import React from 'react';
import { Badge } from 'primereact/badge';

const ItemDetailsSidebar = ({ item }) => {
    // Función auxiliar para verificar que un campo tiene valor
    const hasValue = (value) => {
        return value !== undefined && value !== null && value !== '';
    };

    if (!item) {
        return (
            <div className="card shadow-2">
                <div className="card-header bg-primary text-white p-3">
                    <h5 className="m-0">Detalles del Ítem</h5>
                </div>
                <div className="p-4 flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                        <i className="pi pi-info-circle text-6xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500">Seleccione un ítem para ver los detalles</p>
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
                <div className="flex align-items-center mb-3">
                    <h5 className="text-xl mb-0 text-primary flex-grow-1">{item.title}</h5>
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
                    
                    {hasValue(item.cargo) && (
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Cargo</div>
                                <div className="font-medium">{item.cargo}</div>
                            </div>
                        </div>
                    )}
                    
                    {hasValue(item.tiempoJornada) && (
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Tiempo Jornada</div>
                                <div className="font-medium">{item.tiempoJornada}</div>
                            </div>
                        </div>
                    )}
                    
                    {hasValue(item.cantidad) && (
                        <div className="col-12 mb-2">
                            <div className="surface-100 p-2 border-round">
                                <div className="text-500 font-medium mb-1 text-sm">Cantidad</div>
                                <div className="font-medium">{item.cantidad}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemDetailsSidebar;
