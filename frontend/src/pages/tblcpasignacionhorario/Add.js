import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Card } from 'primereact/card';
import { Checkbox } from "primereact/checkbox";
import { Tag } from 'primereact/tag';
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
    const [ switchChecked, setSwitchChecked ] = useState(true);    
    const [ scheduleValues, setScheduleValues ] = useState({
        ingress1: null,
        exit1: null,
        ingress2: null,
        exit2: null,
    });

    useEffect(() => {
        fetchPersonaDetails();
        fetchSchedule();
    }, [personaId, app]);

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

            setPersonaSchedule( transformSchedule(data[0]) );
            setTipoHorario(data[0].tipo_horario.cat_descripcion);
        } catch (error){
            app.flashMsg('Error', error.message, 'error');
        }
    }

    const transformSchedule = (registro) => {
        const dias = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
        return dias.map((dia) => {
            return {
                dia: dia.charAt(0).toUpperCase() + dia.slice(1),
                ingreso1: registro[`ah_${dia}_ing1`] || 'No registrado',
                salida1: registro[`ah_${dia}_sal1`] || 'No registrado',
                ingreso2: registro[`ah_${dia}_ing2`] || 'No registrado',
                salida2: registro[`ah_${dia}_sal2`] || 'No registrado',
            };
        });
    };

    const handleGenerate = (form) => {
        if(form && form.tipoHorario && form.fechaInicio && form.fechaFin){
            if(form.fechaInicio >= form.fechaFin){
                app.flashMsg('Error', 'La fecha de inicio debe ser menor a la fecha fin.', 'error');
                return;
            }

            const days = generateCalendar(form.fechaInicio, form.fechaFin);
            const groupedWeeks = groupDaysByWeek(days);

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
            setSecondCard(true);
            setDialogCalendar(false);
        }else {
            app.flashMsg('Error', 'Campos vacios.', 'error');
        }
    }
    const onCheckboxChange = (day) => {
        const dateString = day.toDateString();
        const newCheckedDays = { ...checkedDays };
        newCheckedDays[dateString] = !checkedDays[dateString];
        setCheckedDays(newCheckedDays);
    
        // Si la casilla está marcada, aplica los valores de horario actuales a este día
        if (!checkedDays[dateString]) {
          setScheduleValuesByDay((prev) => ({
            ...prev,
            [dateString]: { ...scheduleValues },
          }));
        } else {
          // Si está desmarcada, limpia el horario para este día
          setScheduleValuesByDay((prev) => {
            const updated = { ...prev };
            updated[dateString] = {
              ingress1: null,
              exit1: null,
              ingress2: null,
              exit2: null,
            };
            return updated;
          });
        }
    };

    useEffect(() => {
        console.log(data)
    }, [data])

    const renderDay = (day) => {
        if (!day) return null;
    
        const dateString = day.toDateString();
        const dayValues = scheduleValuesByDay[dateString] || {};
        const dayOfWeek = day
          .toLocaleDateString("es-ES", { weekday: "long" })
          .toLowerCase();
    
        return (
          <div key={dateString} style={{ padding: "5px", margin: "5px" }}>
            <div className="fecha-estilizada">{day.getDate()}</div>
            <Checkbox
              checked={checkedDays[dateString] || false}
              onChange={() => onCheckboxChange(day)}
              disabled={!switchChecked}
            />
    
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
                      }}
                    >
                      ING
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      SAL
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
              icon="pi pi-eye"
              className="p-button-rounded p-button-success p-button-text"
            //   onClick={() => handleView(rowData)}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger p-button-text"
            //   onClick={() => handleDelete(rowData.id)}
            />
          </div>
        );
      };
    
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
                <Tag className="m-2 py-2 px-4" value={`Tipo: ${tipoHorario}`}/>

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
                    <Column field="dia" header="Día" />
                    <Column field="ingreso1" header="Ingreso 1" />
                    <Column field="salida1" header="Salida 1" />
                    <Column field="ingreso2" header="Ingreso 2" />
                    <Column field="salida2" header="Salida 2" />
                    
                    <Column body={actionTemplate} header="Acciones" style={{width: '100px'}} />
                </DataTable>
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
                      onChange={(e) => setSwitchChecked(e.value)}
                    />
                  </div>
                </div>
                {/* Segunda fila */}
                <div className="flex justify-between items-center mb-6">
                  {/* Contenedor de la izquierda */}
                  <div className="flex gap-4 flex-1">
                    <Button
                      icon="pi pi-times"
                      label="CANCELAR"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                    />
                    <Button
                      icon="pi pi-save"
                      label="GUARDAR"
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    //   onClick={handleSave}
                    />
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
                              height: "50px", // Altura mínima para mejor visualización
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
        <DialogSchedule visible={dialogSchedule} setVisible={setDialogSchedule} setScheduleValues={setScheduleValues} scheduleValues={scheduleValues}/>
    </>
  )
}

export default TblCpAsigcionHorarioAdd