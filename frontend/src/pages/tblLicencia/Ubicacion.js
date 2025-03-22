import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import EmpleadoProfileCard from "./EmpleadoProfileCard";
import * as Yup from "yup";
import useApi from "hooks/useApi";
import axios from "axios";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./LicenciaForm.css";

const UbicacionForm = () => {
  const toast = React.useRef(null);
  const { idPer } = useParams();
  const api = useApi();
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    tipoUbicacion: null,
    piso: "",
    bloque: "",
    interno: "",
    fechaInicio: null,
    telefono: "",
    oficina: "",
  });

  // Estado para los datos del empleado
  const [empleadoData, setEmpleadoData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTipoUbicacion, setSelectedTipoUbicacion] = useState(null);
  const [tipoUbicacionOptions, setTipoUbicacionOptions] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  // Esquema de validación con Yup
  const schema = Yup.object().shape({
    uf_edificio: Yup.number().required("El edificio es obligatorio"),
    uf_piso: Yup.string().required("El piso es obligatorio"),
    uf_bloque: Yup.string().required("El bloque es obligatorio"),
    uf_fecha_inicio: Yup.date().required("La fecha de inicio es obligatoria"),
    uf_telefono_interno: Yup.number().required(
      "El teléfono interno es obligatorio"
    ),
    uf_telefono_oficina: Yup.number().required(
      "El teléfono de oficina es obligatorio"
    ),
    uf_nombre_oficina: Yup.string().required(
      "El nombre de la oficina es obligatorio"
    ),
  });

  const fetchRegistros = async () => {
    try {
      console.log(idPer);
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get(
        `http://localhost:8000/api/ubicaciones/buscar_reg/${idPer}`
      );

      if (response.data.success) {
        console.log("consulta de ubicaciones: ", response.data.data);
        setRegistros(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Ocurrió un error al obtener los datos.");
    } finally {
      setLoading(false);
    }
  };

  // Call API on component mount
  useEffect(() => {
    fetchRegistros();
  }, [idPer]);

  // Filter handling
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Cargar datos iniciales desde la API
  useEffect(() => {
    api
      .get(`/tipo-ubicacion`)
      .then((response) => {
        if (response.data.success && response.data.data) {
          const options = response.data.data.map((item) => ({
            label: item.cat_descripcion,
            value: item.cat_id,
          }));
          console.log(options);
          setTipoUbicacionOptions(options);
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

  // Cargar datos del empleado cuando se selecciona un sujeto
  useEffect(() => {
    api
      .get(`/empleado`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data); // Verifica la respuesta
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
  // Construir el payload
  const buildPayload = () => ({
    uf_edificio: selectedTipoUbicacion.value,
    uf_per_id: idPer,
    uf_piso: formData.piso,
    uf_bloque: formData.bloque,
    uf_fecha_inicio: formData.fechaInicio,
    uf_telefono_interno: formData.interno,
    uf_telefono_oficina: formData.telefono,
    uf_nombre_oficina: formData.oficina,
  });
  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      tipoUbicacion: null,
      piso: "",
      bloque: "",
      interno: "",
      fechaInicio: null,
      telefono: "",
      oficina: "",
    });
    setSelectedTipoUbicacion(null);
  };
  const formatDateForDisplay = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
  };
  // Manejar errores
  const handleError = (error) => {
    if (error instanceof Yup.ValidationError) {
      // Mostrar errores de validación
      error.inner.forEach((err) => {
        toast.current.show({
          severity: "warn",
          summary: "Advertencia",
          detail: err.message,
        });
      });
    } else if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error("Error en la respuesta:", error.response.data);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "Error al guardar ubicación",
      });
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error("No se recibió respuesta del servidor:", error.request);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se recibió respuesta del servidor",
      });
    } else {
      // Otro tipo de error
      console.error("Error:", error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al enviar la solicitud",
      });
    }
  };
  // Función para guardar la ubicación
  // Función para guardar la ubicación
  const handleSave = async () => {
    setIsLoading(true); // Activar estado de carga
    try {
      const payload = buildPayload();
      await schema.validate(payload, { abortEarly: false }); // Validar el payload

      // Enviar la solicitud al servidor
      const response = await axios.post(
        "http://localhost:8000/api/ubicaciones/store",
        payload
      );

      // Mostrar mensaje de éxito
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: response.data.message || "Ubicación guardada correctamente",
      });

      // Resetear el formulario
      resetForm();
    // Recargar los registros desde el servidor
    await fetchRegistros();
      // Actualizar la grilla con el nuevo registro
     /*  if (response.data.data) {
        setRegistros((prevRegistros) => [...prevRegistros, response.data.data]);
      } */
    
      // Ocultar el formulario después de guardar (opcional)
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false); // Desactivar estado de carga
    }
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
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

        <span className="p-input-icon-right">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader;
  const rowsPerPageOptions = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
  ];
  return (
    <div className="q-magic-layout">
      <Toast ref={toast} />
      {/* Main content */}
      <div className="q-magic-content">
        <div className="page-title">
          <h5>Administración de Ubicación</h5>
        </div>
        <div className="license-form-container">
          {/* Left side - Form */}
          <div className="license-form">
            {/* Contenedor para los Card con separación */}
            <div className="card-container">
              {/* Primer Card */}
              <Card
                header={
                  <h5 className="m-0">Datos para el registro de ubicacion</h5>
                }
                style={{
                  paddingTop: "5mm",
                  paddingLeft: "5mm",
                  paddingRight: "5mm",
                }}
              >
                <div className="form-row form-row-split">
                  <div className="col-12 md:col-6 mb-1">
                    <label>EDIFICIO</label>
                    <Dropdown
                      id="tipoUbicacion"
                      value={
                        selectedTipoUbicacion
                          ? selectedTipoUbicacion.value
                          : null
                      }
                      onChange={(e) => {
                        console.log("Edificio seleccionado:", e.value);
                        const selected = tipoUbicacionOptions.find(
                          (option) => option.value === e.value
                        );
                        setSelectedTipoUbicacion(selected); // Guardar el objeto completo { label, value }
                      }}
                      options={tipoUbicacionOptions}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccionar..."
                      className="w-full"
                      filter
                      filterBy="label"
                      showClear
                    />
                  </div>
                  <div className="col-12 md:col-6 mb-1">
                    <label className="block text-sm mb-1">
                      NÚMERO O NOMBRE DEL BLOQUE
                    </label>
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-pencil" />
                      <InputText
                        value={formData.bloque}
                        onChange={(e) =>
                          setFormData({ ...formData, bloque: e.target.value })
                        }
                      />
                    </span>
                  </div>
                </div>
                <div className="form-row form-row-split">
                  <div className="col-12 md:col-6 mb-1">
                    <label className="block text-sm mb-1">PISO</label>
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-pencil" />
                      <InputText
                        value={formData.piso}
                        onChange={(e) =>
                          setFormData({ ...formData, piso: e.target.value })
                        }
                      />
                    </span>
                  </div>
                  <div className="col-12 md:col-6 mb-1">
                    <label className="block text-sm mb-1">
                      NÚMERO DE TELÉFONO
                    </label>
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-pencil" />
                      <InputText
                        value={formData.telefono}
                        onChange={(e) =>
                          setFormData({ ...formData, telefono: e.target.value })
                        }
                      />
                    </span>
                  </div>
                </div>
                <div className="form-row form-row-split">
                  <div className="col-12 md:col-6 mb-1">
                    <label className="block text-sm mb-1">NÚMERO INTERNO</label>
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-pencil" />
                      <InputText
                        value={formData.interno}
                        onChange={(e) =>
                          setFormData({ ...formData, interno: e.target.value })
                        }
                      />
                    </span>
                  </div>
                  <div className="col-12 md:col-6 mb-1">
                    <label className="block text-sm mb-1">
                      NOMBRE DE OFICINA
                    </label>
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-pencil" />
                      <InputText
                        value={formData.oficina}
                        onChange={(e) =>
                          setFormData({ ...formData, oficina: e.target.value })
                        }
                      />
                    </span>
                  </div>
                </div>
                <div className="form-row form-row-split">
                  <div className="col-12 md:col-6 mb-1">
                    <label>FECHA</label>
                    <span className="p-input-icon-left w-full">
                      <Calendar
                        value={formData.fechaInicio}
                        onChange={(e) =>
                          setFormData({ ...formData, fechaInicio: e.value })
                        }
                        showIcon
                        dateFormat="dd/mm/yy"
                      />
                    </span>
                  </div>
                </div>

                <div className="col-12 md:col-12 mb-2 flex justify-content-end">
                  <Button
                    label="GUARDAR"
                    icon="pi pi-check"
                    onClick={handleSave}
                  />
                </div>
              </Card>

              {/* Segundo Card */}
              <Card
                header={<h5 className="m-0">Historial de registros</h5>}
                style={{
                  paddingTop: "10mm",
                  paddingLeft: "5mm",
                  paddingRight: "5mm",
                }}
              >
                <DataTable
                  value={registros}
                  paginator
                  rows={10}
                  dataKey="id"
                  filters={filters}
                  globalFilter={globalFilterValue || ""}
                  filterDisplay="menu"
                  loading={loading}
                  responsiveLayout="scroll"
                  emptyMessage="No se encontraron registros"
                  header={header}
                  style={{ backgroundColor: "#f8f9fa" }}
                  stripedRows
                >
                  <Column
                    field="cat_descripcion"
                    header="EDIFICIO"
                    style={{ width: "25%" }}
                  />
                  <Column
                    field="uf_fecha_inicio"
                    header="FECHA ASIGNACION"
                    body={(rowData) => formatDateForDisplay(rowData.uf_fecha_inicio)}
                    style={{ width: "25%" }}
                  />
                  <Column
                    field="uf_estado"
                    header="ESTADO"
                    style={{ width: "25%" }}
                    body={(rowData) => {
                      if (rowData.uf_estado === "V") {
                        return (
                          <div style={{ padding: "5px" }}>
                            <span
                              style={{
                                backgroundColor: "yellow",
                                padding: "3px",
                                borderRadius: "3px",
                              }}
                            >
                              VIGENTE
                            </span>
                          </div>
                        );
                      } else {
                        return <div style={{ padding: "5px" }}>CESANTE</div>;
                      }
                    }}
                  />
                  <Column
                    header="Detalle"
                    body={() => (
                      <Button
                        icon="pi pi-eye"
                        className="p-button-rounded p-button-text"
                      />
                    )}
                    style={{ width: "10%", textAlign: "center" }}
                  />
                  <Column
                    field="uf_id"
                    header="ID"
                    body={() => null} // No mostrar contenido en la celda
                    style={{ display: "none" }} // Ocultar la columna
                  />
                </DataTable>
              </Card>
            </div>
          </div>

          {/* Right side - User info card */}
          <div className="col-12 md:col-5">
            <EmpleadoProfileCard empleadoData={empleadoData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbicacionForm;
