import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Card } from 'primereact/card';
import { Checkbox } from "primereact/checkbox";
import { Button } from 'primereact/button';
import { InputSwitch } from "primereact/inputswitch";
import { Divider } from 'primereact/divider';
import useApp from 'hooks/useApp';
import axios from 'axios';
import DialogCalendar from './DialogCalendar';
import DialogSchedule from './DialogSchedule';

const generateCalendar = (start, end) => {
    const days = [];
    let current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
};

const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    startOfYear.setDate(startOfYear.getDate() + (1 - startOfYear.getDay())); // Ajustar al primer Lunes del año
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    return Math.floor(pastDaysOfYear / 7) + 1;
  };

const getMonthFromWeek = (days) => {
    const firstDay = days.find((day) => day !== null);
    if (firstDay) {
        return firstDay.toLocaleDateString("es-ES", { month: "long" });
    }
    return "";
};

const weekdayMap = {
    lunes: "monday",
    martes: "tuesday",
    miércoles: "wednesday",
    jueves: "thursday",
    viernes: "friday",
    sábado: "saturday",
    domingo: "sunday",
  };

const groupDaysByWeek = (days) => {
  const weeks = {};

  days.forEach((day) => {
      const weekNumber = getWeekNumber(day);

      if (!weeks[weekNumber]) {
      weeks[weekNumber] = Array(7).fill(null); // Lunes a Domingo
      }
      const adjustedDayOfWeek = (day.getDay() + 6) % 7; // Lunes (0) a Domingo (6)
      weeks[weekNumber][adjustedDayOfWeek] = day;
  });
  return weeks;
};
const weekdayMapInverted = {
  monday: "lunes",
  tuesday: "martes",
  wednesday: "miércoles",
  thursday: "jueves",
  friday: "viernes",
  saturday: "sábado",
  sunday: "domingo",
};

function TblCpAsigcionHorarioAdd() {
    const app = useApp();
    const { personaId } = useParams();
    const [ persona, setPersona ] = useState(null);
    const [ personaSchedule, setPersonaSchedule ] = useState();

    const [ loading, setLoading ] = useState(true);

    const [ scheduleValuesByDay, setScheduleValuesByDay ] = useState({});
    const [ tipoHorario, setTipoHorario ] = useState('');
    const [ weeks, setWeeks ] = useState({});

    const [ dialogCalendar, setDialogCalendar ] = useState(false);
    const [ dialogSchedule, setDialogSchedule ] = useState(false);    
    
    const [ firstCard, setFirstCard ] = useState(true);
    const [ secondCard, setSecondCard ] = useState(false);

    const [ data, setData ] = useState();
    const [ checkedDays, setCheckedDays ] = useState({});
    const [ switchChecked, setSwitchChecked ] = useState(false);    
    const [ scheduleValues, setScheduleValues ] = useState({
        ingress1: null,
        exit1: null,
        ingress2: null,
        exit2: null,
    });
    const [editingScheduleValues, setEditingScheduleValues] = useState({
      ingress1: null,
      exit1: null,
      ingress2: null,
      exit2: null
    });

    const [ dataAssistance, setDataAssistance ] = useState();
    const [ daysWork, setDaysWork ] = useState([]);

    const [ isWatching, setIsWatching ] = useState(false);

    useEffect(() => {
        fetchPersonaDetails();
        fetchSchedule();
    }, [personaId, app]);

    useEffect(() => {
      if (dialogSchedule) {
        setEditingScheduleValues({
          ingress1: scheduleValues.ingress1 || null,
          exit1: scheduleValues.exit1 || null,
          ingress2: scheduleValues.ingress2 || null,
          exit2: scheduleValues.exit2 || null
        });
      }
    }, [dialogSchedule]);

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

            setPersonaSchedule( data );
            setTipoHorario(data[0].tipo_horario.cat_descripcion);
        } catch (error){
            console.log('Error', error.message);
        }
    }

    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    }

    const handleGenerate = (form) => {
        setDaysWork([]);
        if(form && form.tipoHorario && form.fechaInicio && form.fechaFin){
            if(form.fechaInicio >= form.fechaFin){
                app.flashMsg('Error', 'La fecha de inicio debe ser menor a la fecha fin.', 'error');
                return;
            }

            const days = generateCalendar(form.fechaInicio, form.fechaFin);
            const groupedWeeks = groupDaysByWeek(days);
            
            setDataAssistance( generateObjectByWeek(form.fechaInicio, form.fechaFin) );

            setWeeks(groupedWeeks);

            const initialValues = {};
            days.forEach((day) => {
                const dateString = day.toDateString();
                initialValues[dateString] = {
                ingress1: null,
                exit1: null,
                ingress2: null,
                exit2: null,
                };
            });

            setScheduleValuesByDay(initialValues);
            setData(form);

            // hide table, dialog and show calendar
            setFirstCard(false);
            setIsWatching(false);
            setSecondCard(true);
            setDialogCalendar(false);
        }else {
            app.flashMsg('Error', 'Campos vacios.', 'error');
        }
    }

    const generateObjectByWeek = (startDate, endDate) => {
      const resultado = [];

      const firstMonday = new Date(startDate);
      const dayOfWeek = firstMonday.getDay(); // 0 es domingo, 1 es lunes, ..., 6 es sábado
      
      // Si no es lunes, entonces ajustamos para encontrar cuándo comenzó la semana (lunes)
      let currentWeekStart = new Date(startDate);
      if (dayOfWeek !== 1) {
        // Si es domingo (0), retrocedemos 6 días para llegar al lunes
        // Si es otro día, retrocedemos (día - 1) días
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        currentWeekStart.setDate(currentWeekStart.getDate() - daysToSubtract);
      }
      
      // Iterar por semanas hasta cubrir todo el rango
      while (currentWeekStart <= endDate) {
        // El último día de la semana es domingo (currentWeekStart + 6 días)
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
        
        // Ajustar fechas al rango solicitado
        const weekStartDate = currentWeekStart < startDate ? startDate : currentWeekStart;
        const weekEndDate = currentWeekEnd > endDate ? endDate : currentWeekEnd;
        
        // Crear objeto para la semana
        const semanaObj = {
          ah_fecha_inicial: formatDate(weekStartDate),
          ah_fecha_final: formatDate(weekEndDate),
          // Lunes
          ah_lun_ing1: null,
          ah_lun_sal1: null,
          ah_lun_ing2: null,
          ah_lun_sal2: null,
          // Martes
          ah_mar_ing1: null,
          ah_mar_sal1: null,
          ah_mar_ing2: null,
          ah_mar_sal2: null,
          // Miércoles
          ah_mie_ing1: null,
          ah_mie_sal1: null,
          ah_mie_ing2: null,
          ah_mie_sal2: null,
          // Jueves
          ah_jue_ing1: null,
          ah_jue_sal1: null,
          ah_jue_ing2: null,
          ah_jue_sal2: null,
          // Viernes
          ah_vie_ing1: null,
          ah_vie_sal1: null,
          ah_vie_ing2: null,
          ah_vie_sal2: null,
          // Sábado
          ah_sab_ing1: null,
          ah_sab_sal1: null,
          ah_sab_ing2: null,
          ah_sab_sal2: null,
          // Domingo
          ah_dom_ing1: null,
          ah_dom_sal1: null,
          ah_dom_ing2: null,
          ah_dom_sal2: null,
        };
        
        resultado.push(semanaObj);
        
        // Avanzar al siguiente lunes
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }
      
      return resultado;
    }

    const onCheckboxChange = (day) => {
        const dateString = day.toDateString();
        const newCheckedDays = { ...checkedDays };
        newCheckedDays[dateString] = !checkedDays[dateString];

        if (checkedDays[dateString]) {
          delete newCheckedDays[dateString];
        } else {
          newCheckedDays[dateString] = true;
        }

        setCheckedDays(newCheckedDays);
    };

    const renderDay = (day) => {
        if (!day) return null;
    
        const dateString = day.toDateString();
        const dayValues = scheduleValuesByDay[dateString] || {};
        const dayOfWeek = day
          .toLocaleDateString("es-ES", { weekday: "long" })
          .toLowerCase();
    
        return (
          <div key={dateString}>
            <div className="fecha-estilizada">{day.getDate()}</div>
            { switchChecked && (
              <Checkbox
                checked={checkedDays[dateString] || false}
                onChange={() => onCheckboxChange(day)}
                disabled={!switchChecked}
              />
            ) }
    
            {/* Siempre muestra la grilla de horario si existen valores */}
            {(dayValues.ingress1 ||
              dayValues.exit1 ||
              dayValues.ingress2 ||
              dayValues.exit2) && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        textAlign: "center",
                        fontSize: "8px",
                      }}
                    >
                      INGRESO
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        textAlign: "center",
                        fontSize: "8px"
                      }}
                    >
                      SALIDA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      {dayValues.ingress1
                        ? dayValues.ingress1.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      {dayValues.exit1
                        ? dayValues.exit1.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      {dayValues.ingress2
                        ? dayValues.ingress2.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      {dayValues.exit2
                        ? dayValues.exit2.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        );
    };

    const actionTemplate = (rowData) => {
      return (
        <div className="flex gap-2">
          <Button
            icon="pi pi-calendar-times"
            className="p-button-rounded p-button-success p-button-text"
            onClick={() => handleViewSchedule(rowData)}
          />
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-info p-button-text"
          //   onClick={() => handleDelete(rowData.id)}
          />
        </div>
      );
    };

    const handleViewSchedule = (rowData) => {
      const [yearInicio, monthInicio, dayInicio] = rowData.ah_fecha_inicial.split('-').map(Number);
      const [yearFin, monthFin, dayFin] = rowData.ah_fecha_final.split('-').map(Number);

      const form = {
        tipoHorario: rowData.tipo_horario,
        fechaInicio: new Date(yearInicio, monthInicio - 1, dayInicio),
        fechaFin: new Date(yearFin, monthFin - 1, dayFin),
      };

      const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const [h, m, s] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, s, 0);
        return date;
      };

      const days = generateCalendar(form.fechaInicio, form.fechaFin);
      const groupedWeeks = groupDaysByWeek(days);

      setWeeks(groupedWeeks);

      const initialValues = {};
      
      days.forEach((day) => {
        const dateString = day.toDateString();
        const weekday = day.toLocaleDateString('es-ES', { weekday: 'short' }).toLowerCase();

        const ingress1 = parseTime(rowData[`ah_${weekday}_ing1`]);
        const exit1 = parseTime(rowData[`ah_${weekday}_sal1`]);
        const ingress2 = parseTime(rowData[`ah_${weekday}_ing2`]);
        const exit2 = parseTime(rowData[`ah_${weekday}_sal2`]);

        initialValues[dateString] = {
          ingress1,
          exit1,
          ingress2,
          exit2,
        };
      });

      setScheduleValuesByDay(initialValues);

      setData(form);

      setFirstCard(false);
      setSwitchChecked(false);
      setIsWatching(true);
      setSecondCard(true);
    }

    // useEffect(() => {
    //   console.log(data)
    // }, [data]);

    const handleAccept = (selectedDays) => {
      const updatedValues = { ...scheduleValuesByDay };
      const updatedDataAssistance = [...dataAssistance];
      const weekdayMapEs = {
        "lunes": "lun",
        "martes": "mar",
        "miércoles": "mie",
        "jueves": "jue",
        "viernes": "vie",
        "sábado": "sab",
        "domingo": "dom"
      };

      if((editingScheduleValues.ingress1 >= editingScheduleValues.exit1) || (editingScheduleValues.ingress2 >= editingScheduleValues.exit2)){
        app.flashMsg('Error', "El horario de ingreso no puede ser mayor o igual al horario de salida.", 'error');
        return; 
      }
      
      // Si no hay días específicos seleccionados en checkedDays
      if (Object.keys(checkedDays).length === 0) {
        // Obtener todas las fechas del objeto weeks
        const allDates = [];
        Object.values(weeks).forEach((daysArray) => {
          daysArray.forEach((day) => {
            if (day) allDates.push(day);
          });
        });
        
        // Para cada fecha en el calendario
        allDates.forEach((date) => {
          // Obtener el día de la semana en español y mapear a inglés
          const dayOfWeekSpanish = date
            .toLocaleDateString("es-ES", { weekday: "long" })
            .toLowerCase();
          const dayOfWeek = weekdayMap[dayOfWeekSpanish];
          const dayCode = weekdayMapEs[dayOfWeekSpanish];
          
          // Si este día fue seleccionado en el diálogo
          if (selectedDays[dayOfWeek]) {
            const dateString = date.toDateString();
            // Actualizar valores para esta fecha con los valores de edición
            updatedValues[dateString] = {
              ingress1: editingScheduleValues.ingress1,
              exit1: editingScheduleValues.exit1,
              ingress2: editingScheduleValues.ingress2,
              exit2: editingScheduleValues.exit2,
            };
            for (let i = 0; i < updatedDataAssistance.length; i++) {
              const weekData = updatedDataAssistance[i];
              const weekStart = parseDate(weekData.ah_fecha_inicial);
              const weekEnd = parseDate(weekData.ah_fecha_final);
              
              // Si la fecha está dentro del rango de esta semana
              if (date >= weekStart && date <= weekEnd) {
                // Actualizar valores para esta fecha con los valores de edición
                updatedDataAssistance[i][`ah_${dayCode}_ing1`] = formatearHora(editingScheduleValues.ingress1);
                updatedDataAssistance[i][`ah_${dayCode}_sal1`] = formatearHora(editingScheduleValues.exit1);
                updatedDataAssistance[i][`ah_${dayCode}_ing2`] = formatearHora(editingScheduleValues.ingress2);
                updatedDataAssistance[i][`ah_${dayCode}_sal2`] = formatearHora(editingScheduleValues.exit2);
                break;
              }
            }
          }
        });
      } 
      // Si hay días específicos seleccionados en checkedDays
      else {
        // Actualiza solo las fechas específicas en checkedDays
        Object.keys(checkedDays).forEach((dateString) => {
          if (checkedDays[dateString]) {
            const date = new Date(dateString);
            const dayOfWeekSpanish = date
              .toLocaleDateString("es-ES", { weekday: "long" })
              .toLowerCase();
            const dayCode = weekdayMapEs[dayOfWeekSpanish];

            for (let i = 0; i < updatedDataAssistance.length; i++) {
              const weekData = updatedDataAssistance[i];
              const weekStart = parseDate(weekData.ah_fecha_inicial);
              const weekEnd = parseDate(weekData.ah_fecha_final);
              
              // Si la fecha está dentro del rango de esta semana
              if (date >= weekStart && date <= weekEnd) {
                // Actualizar valores para esta fecha con los valores de edición
                updatedDataAssistance[i][`ah_${dayCode}_ing1`] = formatearHora(editingScheduleValues.ingress1);
                updatedDataAssistance[i][`ah_${dayCode}_sal1`] = formatearHora(editingScheduleValues.exit1);
                updatedDataAssistance[i][`ah_${dayCode}_ing2`] = formatearHora(editingScheduleValues.ingress2);
                updatedDataAssistance[i][`ah_${dayCode}_sal2`] = formatearHora(editingScheduleValues.exit2);
                break;
              }
            }

            updatedValues[dateString] = {
              ingress1: editingScheduleValues.ingress1,
              exit1: editingScheduleValues.exit1,
              ingress2: editingScheduleValues.ingress2,
              exit2: editingScheduleValues.exit2,
            };
          }
        });
      }

      setDataAssistance(updatedDataAssistance);
      
      setScheduleValuesByDay(updatedValues);
      setDialogSchedule(false);
      setDaysWork(selectedDays);
    };

    function formatearHora(fechaISO) {
      if (!fechaISO) return fechaISO;
      
      const fecha = new Date(fechaISO);
      
      if (isNaN(fecha.getTime())) {
        if (typeof fechaISO === 'string' && /^\d{1,2}:\d{2}$/.test(fechaISO)) {
          return fechaISO;
        }
        return null;
      }
      
      // Extraer horas y minutos y formatear como HH:MM
      const horas = String(fecha.getHours()).padStart(2, '0');
      const minutos = String(fecha.getMinutes()).padStart(2, '0');
      
      return `${horas}:${minutos}`;
    }

    function parseDate(dateString) {
      const [day, month, year] = dateString.split('/');
      return new Date(year, month - 1, day);
    }

    const selectedDaysInSpanish = Object.keys(daysWork)
    .filter((day) => daysWork[day])
    .map((day) => weekdayMapInverted[day]);
    
    const handleSave = () => {
      if(dataAssistance.length == 0){
        app.flashMsg('Error', 'Debe de llenar horario.', 'error');
        return;
      }

      const payload = {
        tipoHorarioId: data.tipoHorario.cat_id,
        personaId: personaId,
        asistencias: dataAssistance
      }
      
      try {
        axios.post('asignacionhorario/store/perweek', payload);
        
        app.flashMsg('Exito', 'Horario registrado exitosamente.', 'success');
        setSecondCard(false);
        setFirstCard(true);

        fetchSchedule();
      } catch(error) {
        app.flashMsg('Error', `Ocurrio un error: ${error}`, 'error');
        console.error(error)
      }
    }

  return (
    <>
        <div className='card'>
            <Card>
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

        { firstCard && (
            <div className='card mt-3'>
              <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Historial de registros</h5>
              </div>

                { personaSchedule && personaSchedule.length > 0 ? (
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
                      <Column field="tipo_horario.cat_descripcion" header="TIPO" />
                      <Column field="ah_fecha_inicial" header="FECHA INICIO" />
                      <Column field="ah_fecha_final" header="FECHA FIN" />                    
                      <Column body={actionTemplate} header="Acciones" style={{width: '100px'}} />
                  </DataTable>
                ) : (
                  !loading && (
                    <div className="p-4 text-center text-gray-500 border rounded-md mt-4">
                      No hay horarios registrados para esta persona.
                    </div>
                  )
                ) }
            </div>
        ) }

        { secondCard && ( 
            <div className="card mt-3">
              <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Calendario</h5>
              </div>
              <Divider/>
              <h4 className="text-center text-gray-500 text-sm mb-2">
                DATOS HORARIO
              </h4>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                {/* Estilos personalizados */}
                <div style={{ paddingLeft: "1.5cm" }}>
                  <h6 className="text-center font-medium text-gray-600">
                    TIPO
                  </h6>
                  <p className="text-center">
                    {data.tipoHorario
                      ? data.tipoHorario.cat_descripcion
                      : "Ninguno"}
                  </p>
                </div>
                <div>
                  <h6 className="text-center font-medium text-gray-600">
                    FECHA INICIO
                  </h6>
                  <p className="text-center">
                    {data.fechaInicio
                      ? data.fechaInicio.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "01/02/2025"}
                  </p>
                </div>
                <div style={{ paddingRight: "1.5cm" }}>
                  <h6 className="text-center font-medium text-gray-600">
                    FECHA FIN
                  </h6>
                  <p className="text-center">
                    {data.fechaFin
                      ? data.fechaFin.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "28/02/2025"}
                  </p>
                </div>
              </div>
              <Divider/>

              <div className="mb-4 pt-4">
                { !isWatching && (
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-between gap-4 mb-6">
                      <div className='w-26rem'>
                        <Button
                          icon="pi pi-calendar"
                          label="LLENAR HORARIO"
                          className="w-full text-white"
                          onClick={() => setDialogSchedule(true)}
                        />
                      </div>
                      <div className='w-26rem'>
                        <Button
                          icon="pi pi-trash"
                          label="LIMPIAR HORARIO"
                          className="w-full bg-white text-gray-700 border border-gray-300"
                        />
                        </div>
                    </div>
                    <div className="flex flex-column ml-5 items-center justify-between gap-4 w-full max-w-[400px]">
                      <span className="text-sm font-medium">
                        ¿APLICAR CASILLAS?
                      </span>
                      <InputSwitch
                        checked={switchChecked}
                        onChange={(e) => {
                          setCheckedDays([]);
                          setSwitchChecked(e.value);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Segunda fila */}
                <div className="flex justify-between items-center mb-6">
                  {/* Contenedor de la izquierda */}
                  <div className="flex gap-4 flex-1">
                    <Button
                      icon="pi pi-times"
                      label="CANCELAR"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                      onClick={ () => {
                        setSecondCard(false);
                        setFirstCard(true);
                      }}
                    />
                    { !isWatching && (
                      <Button
                        icon="pi pi-save"
                        label="GUARDAR"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={ handleSave }
                      />
                    )}
                  </div>

                  {/* Espacio adicional entre los grupos */}
                  <div className="flex-1"></div>

                  {/* Contenedor de la derecha */}
                  <div className="flex gap-4">
                    <Button
                      label="HORARIO NO PRESENCIAL"
                      className="bg-red-400 text-white rounded-full py-1 px-4 text-sm"
                      style={{ borderRadius: "999px" }}
                    />
                    <Button
                      label="SIN TOLERANCIA HORARIA"
                      className="bg-white text-gray-700 border border-gray-300 rounded-full py-1 px-4 text-sm"
                      style={{ borderRadius: "999px" }}
                    />
                  </div>
                </div>
              </div>

              <table
                style={{
                  width: "100%",
                  marginTop: "20px",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "N Sem",
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                      "Domingo",
                    ].map((header, idx) => (
                      <th
                        key={idx}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          backgroundColor: "#f8f9fa",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(weeks).map(([weekNumber, days]) => {
                    const month = getMonthFromWeek(days);
                    return (
                      <tr key={weekNumber}>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            verticalAlign: "middle",
                            fontWeight: "bold",
                          }}
                        >
                          {`${weekNumber} - ${month}`}
                        </td>
                        {days.map((day, index) => (
                          <td
                            key={index}
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              height: "50px", 
                            }}
                          >
                            {day ? renderDay(day) : null}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          
          </div>
        )}

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

        <DialogCalendar visible={dialogCalendar} setVisible={setDialogCalendar} handleGenerate={handleGenerate}/>
        <DialogSchedule 
            visible={dialogSchedule} 
            setVisible={setDialogSchedule} 
            setScheduleValues={setScheduleValues} 
            scheduleValues={scheduleValues}
            handleAccept={handleAccept}
            checkedDays={checkedDays}
            editingScheduleValues={editingScheduleValues}
            setEditingScheduleValues={setEditingScheduleValues}/>
    </>
  )
}

export default TblCpAsigcionHorarioAdd