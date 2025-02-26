import React from 'react';

const ItemDetailsSidebar = ({ item }) => {
  if (!item) {
    return (
      <div className="border p-4 rounded-md bg-white shadow-sm h-full">
        <p className="text-gray-500">Selecciona un ítem para ver los detalles</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">{item.title}</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría Pragmática</label>
          <div className="mt-1">{item.categoriaPragmatica}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría Administrativa</label>
          <div className="mt-1">{item.categoriaAdministrativa}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Cargo</label>
          <div className="mt-1">{item.cargo}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiempo Jornada</label>
          <div className="mt-1">{item.tiempoJornada}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
          <div className="mt-1">{item.cantidad}</div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsSidebar;
