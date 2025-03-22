import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { InputSwitch } from "primereact/inputswitch";
import EmpleadoFileCard from './EmpleadoFileCard';
import { Toast } from 'primereact/toast';
import useApi from "hooks/useApi";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "./LicenciaForm.css";
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
const EmployeeManagementForm = () => {
  const { idPer } = useParams();
  const api = useApi();
  const toast = useRef(null); 
  const [empleadoData, setEmpleadoData] = useState(null);
  const [recordsDialog, setRecordsDialog] = useState(false);
  const [calendarDialog, setCalendarDialog] = useState(false);
  const [newActionDialog, setNewActionDialog] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tipoHorarioOptions, setTipoHorarioOptions] = useState([]);
  const [selectedTipoHorario, setSelectedTipoHorario] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [weeks, setWeeks] = useState({});
  const [displayScheduleDialog, setDisplayScheduleDialog] = useState(false);
  const [showFirstCard, setShowFirstCard] = useState(true);
  const [showSecondCard, setShowSecondCard] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [scheduleType, setScheduleType] = useState("weekAll");
  const [inPersonSchedule, setInPersonSchedule] = useState(false);
  const [records, setRecords] = useState([]);
  const [workDays, setWorkDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const navigate = useNavigate();
  const [checkedDays, setCheckedDays] = useState({});
  const [checkboxEnabled, setCheckboxEnabled] = useState(false);
  const [scheduleValues, setScheduleValues] = useState({
    ingress1: null,
    exit1: null,
    ingress2: null,
    exit2: null,
  });
  const [scheduleValuesByDay, setScheduleValuesByDay] = useState({});
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    tipoLicencia: "",
    sujeto: "",
    motivo: "",
    lugar: "",
    fechaInicio: null,
    fechaFin: null,
    horaInicio: null,
    horaFin: null,
    analizarTexto: "",
    autorizadoPor: "",
  });


  const fetchRecords = async () => {
    try {
      const response = await api.get(`asignacionhorario/show/${idPer}`);
      console.log("Registros obtenidos (API response):", response.data);

      if (!Array.isArray(response.data)) {
        console.error("Error: API no devolvió un array:", response.data);
        return;
      }

      // Formatear datos para la tabla
      const formattedRecords = response.data.map((item) => ({
        id: item.ah_id, 
        tipo: item.tipo_horario?.cat_descripcion || "N/A", 
        fechaInicio: item.ah_fecha_inicial || "N/A",
        fechaFin: item.ah_fecha_final || "N/A",
      }));

      console.log("Registros formateados:", formattedRecords);
      setRecords(formattedRecords);
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  };
 // Cargar datos del empleado cuando se selecciona un sujeto
  useEffect(() => {
    api
      .get(`/empleado`)
      .then((response) => {
        if (response.status === 200) {
          console.log("muestra resultado de consulta personal:",response.data); // Verifica la respuesta
          if (response.data) {
            setEmpleadoData(response.data);
          } else {
            setError("No se encontraron datos del empleado");
          }
        } else {
          console.error(`Error: ${response.status}`);
          setError("Error al cargar los datos del empleado");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar datos del empleado:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los datos del formulario",
        });
      });
  }, [formData.sujeto]);

  useEffect(() => {
    if (idPer) {
      console.log("Ejecutando fetchRecords() para idPer:", idPer);
      fetchRecords();
    } else {
      console.warn("idPer no está definido. No se puede obtener registros.");
    }
  }, [idPer]);

  useEffect(() => {
    console.log("Estado de records actualizado:", records);
  }, [records]);

  const toggleWorkDay = (day) => {
    setSelectedDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };

  const handleScheduleChange = (field, value) => {
    setScheduleValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const weekDays = [
    { label: "LUNES", value: "monday" },
    { label: "MARTES", value: "tuesday" },
    { label: "MIÉRCOLES", value: "wednesday" },
    { label: "JUEVES", value: "thursday" },
    { label: "VIERNES", value: "friday" },
    { label: "SÁBADO", value: "saturday" },
    { label: "DOMINGO", value: "sunday" },
  ];

  const handleGenerate = () => {
    if (startDate && endDate && startDate <= endDate) {
      setCalendarDialog(false);
      const days = generateCalendar(startDate, endDate);
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
      setShowFirstCard(false);
      setShowSecondCard(true);
    }
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => handleView(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };
  useEffect(() => {
    api
      .get(`/tipo-horario`)
      .then((response) => {
        if (response.data.success && response.data.data) {
          const options = response.data.data.map((item) => ({
            label: item.cat_descripcion,
            value: item.cat_id,
          }));
          console.log(options);
          setTipoHorarioOptions(options);
        } else {
          setError("No se encontraron datos");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tipo horario options:", error);
        setError("Error al cargar los tipos de horario");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga
  }

  if (error) {
    return <div>{error}</div>; // Muestra un mensaje de error
  }

  const rowsPerPageOptions = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
  ];

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
  // Mapeo de días en español a claves en inglés
  const weekdayMap = {
    lunes: "monday",
    martes: "tuesday",
    miércoles: "wednesday",
    jueves: "thursday",
    viernes: "friday",
    sábado: "saturday",
    domingo: "sunday",
  };
  const handleAccept = () => {
    const updatedValues = { ...scheduleValuesByDay };
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
      // Si este día fue seleccionado en el diálogo
      if (selectedDays[dayOfWeek]) {
        const dateString = date.toDateString();
        // Actualizar valores para esta fecha
        updatedValues[dateString] = {
          ingress1: scheduleValues.ingress1,
          exit1: scheduleValues.exit1,
          ingress2: scheduleValues.ingress2,
          exit2: scheduleValues.exit2,
        };
      }
    });

    setScheduleValuesByDay(updatedValues);
    setDisplayScheduleDialog(false);
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

  const selectedDaysInSpanish = Object.keys(selectedDays)
    .filter((day) => selectedDays[day])
    .map((day) => weekdayMapInverted[day]);

  const handleSave = async () => {
    const payload = {
      ah_per_id: idPer, 
      ah_tipo_horario: selectedTipoHorario ? selectedTipoHorario.value : null,
      ah_fecha_inicial: startDate
        ? startDate.toISOString().split("T")[0]
        : null,
      ah_fecha_final: endDate ? endDate.toISOString().split("T")[0] : null,
      selected_days: selectedDaysInSpanish,
      ah_estado: "V",
      ingress1: scheduleValues.ingress1
        ? scheduleValues.ingress1.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      exit1: scheduleValues.exit1
        ? scheduleValues.exit1.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      ingress2: scheduleValues.ingress2
        ? scheduleValues.ingress2.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      exit2: scheduleValues.exit2
        ? scheduleValues.exit2.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
    };
    console.log("Datos enviados al backend:", payload);
    try {
      const response = await api.post("asignacionhorario/store", payload);
      console.log("Horario guardado:", response.data);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Se guardo correctamente' });
      // Actualizar la tabla con el nuevo registro
      setRecords((prevRecords) => [
        ...prevRecords,
        {
          tipo: selectedTipoHorario ? selectedTipoHorario.label : "N/A",
          fechaInicio: startDate
            ? startDate.toLocaleDateString("es-ES")
            : "N/A",
          fechaFin: endDate ? endDate.toLocaleDateString("es-ES") : "N/A",
        },
      ]);

      resetForm();
      setCalendarDialog(false);
      setDisplayScheduleDialog(false);
      setShowFirstCard(true);
      setShowSecondCard(false);
    } catch (error) {
      console.error("Error al guardar el horario:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
    }
  };

  const resetForm = () => {
    setSelectedTipoHorario(null);
    setStartDate(null);
    setEndDate(null);
    setSelectedDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
    setScheduleValues({
      ingress1: null,
      exit1: null,
      ingress2: null,
      exit2: null,
    });
    setScheduleValuesByDay({});
  };
  const handleView = (rowData) => {
    console.log("👀 Ver registro:", rowData);

    // Establecer los valores en el formulario
    setSelectedTipoHorario({ label: rowData.tipo, value: rowData.tipo_id });
    setStartDate(new Date(rowData.fechaInicio));
    setEndDate(new Date(rowData.fechaFin));

    // Mostrar el segundo card (editar)
    setShowFirstCard(false);
    setShowSecondCard(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este horario?")) {
      return;
    }

    try {
      await api.delete(`tblcpasignacionhorario/${id}`);
      console.log("Registro eliminado:", id);
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    }
  };
  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    const date = new Date(dateString);
    if (isNaN(date)) return 'Fecha inválida';    
    return date.toLocaleDateString('es-ES', options);
  };
  return (
    <div className="q-magic-layout">
          <Toast ref={toast} />
          <div className="q-magic-content">    
          <div className="page-title">
          <h5>Administración de Licencia justificada</h5>
        </div>
      
      <div className="grid">
        <div className="col-12">
        <EmpleadoFileCard empleadoData={empleadoData} />
        </div>

        {showFirstCard && (
          <div className="col-12 mt-3">
            <Card>
              <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Historial de Registros</h5>
              </div>
              <div className="flex justify-content-between align-items-center mb-3">
                <div className="flex align-items-center">
                  <span className="mr-2">Mostrar:</span>
                  <Dropdown
                    value={rowsPerPage}
                    options={rowsPerPageOptions}
                    onChange={(e) => setRowsPerPage(e.value)}
                    className="mr-2"
                  />
                  <span>registros</span>
                </div>
                <div className="flex align-items-center">
                  <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <InputText  type="search"
                                      placeholder="Buscar..."
                                      value={globalFilter}
                                      onChange={(e) => setGlobalFilter(e.target.value)} />
                    <i className="pi pi-search" />                  
                  </span>
                </div>
              </div>
              <DataTable
                value={records}
                paginator
                rows={rowsPerPage}
                className="p-datatable-sm"
                globalFilter={globalFilter || ""}
                emptyMessage={
                  records.length === 0
                    ? "No hay registros (ver consola)"
                    : "No hay registros disponibles"
                }
              >
                <Column field="tipo" header="TIPO" style={{ width: "30%" }} />
                <Column
                  field="fechaInicio"
                  header="FECHA INICIO"
                  style={{ width: "30%" }}
                  body={(rowData) => formatDate(rowData.fechaInicio)}
                />
                <Column
                  field="fechaFin"
                  header="FECHA FIN"
                  style={{ width: "30%" }}
                  body={(rowData) => formatDate(rowData.fechaFin)}
                />
                <Column
                  header="CONTROLES"
                  body={actionBodyTemplate}
                  style={{ width: "10%" }}
                />
              </DataTable>
            </Card>
          </div>
        )}
        {showSecondCard && (
          <div className="col-12 mt-3">
            <Card>
              <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Calendario</h5>
              </div>
              <h4 className="text-center text-gray-500 text-sm mb-2">
                DATOS HORARIO
              </h4>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* Estilos personalizados */}
                <div style={{ paddingLeft: "1.5cm" }}>
                  <h6 className="text-center font-medium text-gray-600">
                    TIPO
                  </h6>
                  <p className="text-center">
                    {selectedTipoHorario
                      ? selectedTipoHorario.label
                      : "Ninguno"}
                  </p>
                </div>
                <div>
                  <h6 className="text-center font-medium text-gray-600">
                    FECHA INICIO
                  </h6>
                  <p className="text-center">
                    {startDate
                      ? startDate.toLocaleDateString("es-ES", {
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
                    {endDate
                      ? endDate.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "28/02/2025"}
                  </p>
                </div>
              </div>

              <div className="mb-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex justify-between gap-4 mb-6">
                    <div>
                      <Button
                        icon="pi pi-calendar"
                        label="LLENAR HORARIO"
                        className="w-full bg-blue-500 text-white"
                        onClick={() => setDisplayScheduleDialog(true)}
                      />
                    </div>
                    <div>
                      <Button
                        icon="pi pi-trash"
                        label="LIMPIAR HORARIO"
                        className="w-full bg-white text-gray-700 border border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 w-full max-w-[400px]">
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
                      onClick={handleSave}
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
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 right-0 p-3">
        <div className="flex flex-column align-items-center gap-2">
          <Button
            icon="pi pi-calendar custom-icon-xl"
            className="p-button-rounded p-button-info p-button-lg w-4rem h-4rem text-2xl" // Usa PrimeFlex para ajustar tamaño
            onClick={() => setCalendarDialog(true)}
          />
          <Button
            icon="pi pi-plus custom-icon-xl"
            className="p-button-rounded p-button-success p-button-lg w-4rem h-4rem text-2xl" // Usa PrimeFlex para ajustar tamaño
            onClick={() => navigate('/tbllicencia')} 
          />
        </div>
      </div>
      </div>
      {/* Calendar Dialog */}
      <Dialog
        header={
          <div style={{ textAlign: "center", padding: "10px" }}>
            DATOS HORARIO
          </div>
        }
        visible={calendarDialog}
        style={{ width: "30vw" }}
        onHide={() => setCalendarDialog(false)}
      >
        <div className="grid">
          <div className="col-12">
            <div className="field">
              <label htmlFor="type">TIPO HORARIO</label>
              <Dropdown
                id="tipoHorario"
                options={tipoHorarioOptions} // [{ label: "Horario Nocturno", value: 1 }, { label: "Horario Diurno", value: 2 }]
                optionLabel="label" // Muestra el label en la UI
                optionValue="value" // Lo que se usa internamente como valor único
                value={selectedTipoHorario ? selectedTipoHorario.value : null} // Solo pasar el value (ID)
                onChange={(e) => {
                  console.log("Horario seleccionado:", e.value);
                  const selected = tipoHorarioOptions.find(
                    (option) => option.value === e.value
                  );
                  setSelectedTipoHorario(selected); // Guardar el objeto completo { label, value }
                }}
                className="w-full"
                placeholder="Seleccione un tipo de horario"
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="startDate">FECHA INICIO</label>
              <Calendar
                value={startDate}
                onChange={(e) => setStartDate(e.value)}
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="endDate">FECHA FIN</label>

              <Calendar
                value={endDate}
                onChange={(e) => setEndDate(e.value)}
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>
          <div className="col-12 flex justify-content-end">
            <Button
              label="GENERAR CALENDARIO"
              icon="pi pi-plus"
              onClick={handleGenerate}
            />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text mr-2"
              onClick={() => setNewActionDialog(false)}
            />
          </div>
        </div>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog
        header={<div className="text-center w-full font-bold">HORARIO</div>}
        visible={displayScheduleDialog}
        style={{ width: "55vw" }}
        onHide={() => setDisplayScheduleDialog(false)}
        modal
        className="p-fluid"
        footer={
          <div className="justify-center space-x-4">
            <Button
              label="ACEPTAR"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleAccept}
            />
            <Button
              label="CANCELAR"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => setDisplayScheduleDialog(false)}
            />
          </div>
        }
      >
        <div className="mb-4 pt-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="ingress1" className="block mb-1 font-medium">
                INGRESO 1
              </label>
              <Calendar
                id="ingress1"
                timeOnly
                showIcon
                value={scheduleValues.ingress1}
                onChange={(e) => handleScheduleChange("ingress1", e.value)}
              />
            </div>
            <div>
              <label htmlFor="exit1" className="block mb-1 font-medium">
                SALIDA 1
              </label>
              <Calendar
                id="exit1"
                timeOnly
                showIcon
                value={scheduleValues.exit1}
                onChange={(e) => handleScheduleChange("exit1", e.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="ingress2" className="block mb-1 font-medium">
                INGRESO 2
              </label>
              <Calendar
                id="ingress2"
                timeOnly
                showIcon
                value={scheduleValues.ingress2}
                onChange={(e) => handleScheduleChange("ingress2", e.value)}
              />
            </div>
            <div>
              <label htmlFor="exit2" className="block mb-1 font-medium">
                SALIDA 2
              </label>
              <Calendar
                id="exit2"
                timeOnly
                showIcon
                value={scheduleValues.exit2}
                onChange={(e) => handleScheduleChange("exit2", e.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-nowrap gap-4 mb-4">
            {weekDays.map((day) => (
              <div key={day.value} className="flex items-center">
                <Checkbox
                  inputId={day.value}
                  checked={selectedDays[day.value]}
                  onChange={() => toggleWorkDay(day.value)}
                />
                <label htmlFor={day.value} className="ml-2">
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default EmployeeManagementForm;
