import React, { useState } from 'react';

const ItemForm = ({ parentId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    categoriaPragmatica: '',
    categoriaAdministrativa: '',
    cargo: '',
    tiempoJornada: '',
    cantidad: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, parentId });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {parentId ? 'Agregar Nuevo Elemento' : 'Crear Elemento Raíz'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría Pragmática</label>
          <select
            name="categoriaPragmatica"
            value={formData.categoriaPragmatica}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Estratégica">Estratégica</option>
            <option value="Táctica">Táctica</option>
            <option value="Operativa">Operativa</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría Administrativa</label>
          <select
            name="categoriaAdministrativa"
            value={formData.categoriaAdministrativa}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Dirección">Dirección</option>
            <option value="Gerencia">Gerencia</option>
            <option value="Departamento">Departamento</option>
            <option value="Unidad">Unidad</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Cargo</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiempo Jornada</label>
          <select
            name="tiempoJornada"
            value={formData.tiempoJornada}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Completa">Completa</option>
            <option value="Media">Media</option>
            <option value="Por horas">Por horas</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
