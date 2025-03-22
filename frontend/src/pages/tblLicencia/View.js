import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const ScheduleForm = () => {
  const [startDate, setStartDate] = useState(new Date('2025-02-01'));
  const [endDate, setEndDate] = useState(new Date('2025-02-28'));
  const [switchChecked, setSwitchChecked] = useState(true);
  
  // Generate schedule data
  const generateScheduleData = () => {
    const weeks = [
      { weekNum: '1 - FEBRERO', days: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { weekNum: '2 - FEBRERO', days: [10, 11, 12, 13, 14, 15, 16] },
      { weekNum: '3 - FEBRERO', days: [17, 18, 19, 20, 21, 22, 23] }
    ];
    return weeks;
  };
  
  const weeks = generateScheduleData();
  
  // Time template for schedule cells
  const timeTemplate = () => {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between bg-blue-50 text-sm">
          <div className="px-2 py-1 bg-blue-100 text-blue-800 font-bold">ING</div>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 font-bold">SAL</div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="px-2 py-1">08:00</div>
          <div className="px-2 py-1">12:00</div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="px-2 py-1">14:30</div>
          <div className="px-2 py-1">19:00</div>
        </div>
      </div>
    );
  };

  // Day cell template
  const dayTemplate = (day) => {
    return (
      <div className="flex flex-col items-center">
        <div className="text-xl font-bold mb-2">{day}</div>
        <Checkbox />
        {day >= 3 && day <= 23 ? timeTemplate() : null}
      </div>
    );
  };

  // Week template for schedule
  const weekTemplate = (week) => {
    return (
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-2 border-r border-gray-200 bg-gray-100 flex items-center justify-center font-semibold text-blue-600">
          {week.weekNum}
        </div>
        {week.days.map((day, index) => (
          <div key={index} className="p-2 border-r border-gray-200">
            {dayTemplate(day)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500 uppercase">TIPO</div>
          <div className="font-semibold">NORMAL(Oficial)</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 uppercase">DATOS HORARIO</div>
        </div>
        <div></div>
      </div>

      {/* Dates */}
      <div className="flex justify-between mb-6">
        <div></div>
        <div className="flex gap-8">
          <div>
            <div className="text-sm text-gray-500 uppercase mb-1">FECHA INICIO</div>
            <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" />
          </div>
          <div>
            <div className="text-sm text-gray-500 uppercase mb-1">FECHA FIN</div>
            <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} dateFormat="dd/mm/yy" />
          </div>
        </div>
        <div></div>
      </div>

      {/* Switch */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">¿APLICAR CABALLO?</span>
          <InputSwitch checked={switchChecked} onChange={(e) => setSwitchChecked(e.value)} />
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Button icon="pi pi-calendar" label="LLENAR HORARIO" className="w-full bg-blue-500 text-white" />
        </div>
        <div>
          <Button icon="pi pi-trash" label="LIMPIAR HORARIO" className="w-full bg-white text-gray-700 border border-gray-300" />
        </div>
      </div>

      {/* Secondary Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Button icon="pi pi-times" label="CANCELAR" className="w-full bg-gray-200 text-gray-700" />
        </div>
        <div>
          <Button icon="pi pi-save" label="GUARDAR" className="w-full bg-green-500 text-white" />
        </div>
      </div>

      {/* Special options */}
      <div className="flex justify-end gap-4 mb-6">
        <Button label="HORARIO NO PRESENCIAL" className="bg-red-400 text-white rounded-full" />
        <Button label="SIN TOLERANCIA HORARIA" className="bg-white text-gray-700 border border-gray-300 rounded-full" />
      </div>

      {/* Schedule Table */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-8 bg-blue-50 text-center font-semibold">
          <div className="p-2 border-r border-gray-200">Nº SEM.</div>
          <div className="p-2 border-r border-gray-200">LUNES</div>
          <div className="p-2 border-r border-gray-200">MARTES</div>
          <div className="p-2 border-r border-gray-200">MIÉRCOLES</div>
          <div className="p-2 border-r border-gray-200">JUEVES</div>
          <div className="p-2 border-r border-gray-200">VIERNES</div>
          <div className="p-2 border-r border-gray-200">SÁBADO</div>
          <div className="p-2">DOMINGO</div>
        </div>
        
        {/* Table Body */}
        {weeks.map((week, index) => (
          <div key={index}>
            {weekTemplate(week)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleForm;