import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { useParams, useNavigate } from "react-router-dom";
import EmpleadoProfileCard from './EmpleadoProfileCard';
import useApi from "hooks/useApi";
import axios from "axios";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./LicenciaForm.css";

const LicenciaForm = () => {
  const toast = React.useRef(null);
  const { idPer } = useParams();
  const api = useApi();
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

  // Estado para los datos del empleado
  const [empleadoData, setEmpleadoData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTipoLicencia, setSelectedTipoLicencia] = useState(null);
  const [selectedTipoUbicacion, setSelectedTipoUbicacion] = useState(null);
  const [selectedAutorizador, setSelectedAutorizador] = useState(null);
  const [tipoLicenciaOptions, setTipoLicenciaOptions] = useState([]);
  const [tipoUbicacionOptions, setTipoUbicacionOptions] = useState([]);
  const [autorizadoresOptions, setAutorizadoresOptions] = useState([]);
  const [switchChecked, setSwitchChecked] = useState(true);
  // Estado para las opciones de los dropdowns
  const [options, setOptions] = useState({
    tiposLicencia: [],
    sujetos: [],
    autorizadores: [],
  });

  // Cargar datos iniciales desde la API
  useEffect(() => {
    api
      .get(`/tipo-licencia`)
      .then((response) => {
        if (response.data.success && response.data.data) {
          const options = response.data.data.map((item) => ({
            label: item.cat_descripcion,
            value: item.cat_id,
          }));
          console.log(options);
          setTipoLicenciaOptions(options);
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

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/opciones");
        console.log("Datos recibidos:", response.data);
        setAutorizadoresOptions(response.data); // Almacena directamente la lista de autorizadores
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los datos del formulario",
        });
      }
    };

    fetchDropdownData();
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
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Para mantener el formato 24 horas
    });
  };
  const handleSave = async () => {
    try {
      console.log("muestra datos lado derecho: ",formData.sujeto);
            // Validaciones básicas
      if (
        !formData.tipoLicencia ||
        !formData.horaInicio ||
        !formData.horaFin ||
        !formData.fechaInicio ||
        !formData.fechaFin ||
        !formData.motivo ||
        !formData.lugar ||
        !selectedAutorizador
      ) {
        toast.current.show({
          severity: "warn",
          summary: "Advertencia",
          detail: "Por favor complete todos los campos obligatorios",
        });
        return;
      }
       // Convertir las horas al formato correcto
    const horaSalidaFormatted = formatTime(formData.horaInicio);
    const horaRetornoFormatted = formatTime(formData.horaFin);
      const payload = {
        lj_tipo_licencia: formData.tipoLicencia,
        lj_per_id: idPer,
        lj_motivo: formData.motivo,
        lj_lugar: formData.lugar,
        lj_fecha_inicial: formData.fechaInicio,
        lj_fecha_final: formData.fechaFin,
        lj_hora_salida: horaSalidaFormatted,
        lj_hora_retorno: horaRetornoFormatted,
        lj_per_id_autoriza: selectedAutorizador.label,
      };
      console.log("Datos enviados al backend:", payload);
      const response = await axios.post(
        "http://localhost:8000/api/licencias/add",
        payload
      );
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Licencia guardada correctamente",
      });
      console.log(response.data);//muestra respuesta del servidor
      setFormData({      
        tipoLicencia: null,
        motivo: "",
        lugar: "",
        fechaInicio: null,
        fechaFin: null,
        horaInicio: null,
        horaFin: null,
        analizarTexto: "",
        autorizadoPor: null,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Error al guardar licencia",
      });
    }
  };

  return (
    <div className="q-magic-layout">
      <Toast ref={toast} />
      {/* Main content */}
      <div className="q-magic-content">
        <div className="page-title">
          <h5>Administración de Licencia justificada</h5>
        </div>
        <div className="license-form-container">
          {/* Left side - Form */}
          <div className="license-form">
            <Card
              header={
                <h5 className="m-0">Datos para el registro de la Licencia</h5>
              }
              style={{
                paddingTop: "5mm",
                paddingLeft: "5mm",
                paddingRight: "5mm",
              }}
            >
              <div className="form-row form-row-split">
                <div className="col-12 md:col-12 mb-1">
                  <label>TIPO LICENCIA</label>
                  <Dropdown
                    id="tipoLicencia"
                    value={
                      selectedTipoLicencia ? selectedTipoLicencia.value : null
                    }
                    onChange={(e) => {
                      console.log("Horario seleccionado:", e.value);
                      const selected = tipoLicenciaOptions.find(
                        (option) => option.value === e.value
                      );

                      setSelectedTipoLicencia(selected);

                      // Actualizar formData
                      setFormData((prevData) => ({
                        ...prevData,
                        tipoLicencia: e.value, // Aquí asignamos el valor seleccionado
                      }));
                    }}
                    options={tipoLicenciaOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccionar..."
                    className="w-full"
                    filter
                    filterBy="label"
                    showClear
                  />
                </div>
              </div>
              {/*   <div className="form-row form-row-split">
                <div className="col-12 md:col-12 mb-1">
                  <label>UBICACION</label>
                  <Dropdown
                    id="tipoUbicacion"
                    value={
                      selectedTipoUbicacion ? selectedTipoUbicacion.value : null
                    }
                    onChange={(e) => {
                      console.log("Horario seleccionado:", e.value);
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
              </div> */}
              <div className="form-row form-row-split">
                <div className="col-12 md:col-6 mb-1">
                  <label className="block text-sm mb-1">MOTIVO</label>
                  <span className="p-input-icon-left w-full">
                    <i className="pi pi-pencil" />
                    <InputText
                      value={formData.motivo}
                      onChange={(e) =>
                        setFormData({ ...formData, motivo: e.target.value })
                      }
                    />
                  </span>
                </div>
                <div className="col-12 md:col-6 mb-1">
                  <label className="block text-sm mb-1">LUGAR</label>
                  <span className="p-input-icon-left w-full">
                    <i className="pi pi-pencil" />
                    <InputText
                      value={formData.lugar}
                      onChange={(e) =>
                        setFormData({ ...formData, lugar: e.target.value })
                      }
                    />
                  </span>
                </div>
              </div>

              <div className="form-row form-row-split">
                <div className="col-12 md:col-6 mb-1">
                  <label>FECHA INICIO</label>
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
                <div className="col-12 md:col-6 mb-1">
                  <label>FECHA FIN</label>
                  <Calendar
                    value={formData.fechaFin}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaFin: e.value })
                    }
                    showIcon
                    dateFormat="dd/mm/yy"
                  />
                </div>
              </div>

              <div className="form-row form-row-split">
                <div className="col-12 md:col-6 mb-1">
                  <label>HORA INICIO</label>
                  <Calendar
                    timeOnly
                    hourFormat="24"
                    value={formData.horaInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, horaInicio: e.value })
                    }
                    showIcon
                  />
                </div>
                <div className="col-12 md:col-6 mb-1">
                  <label>HORA FIN</label>
                  <Calendar
                    timeOnly
                    hourFormat="24"
                    value={formData.horaFin}
                    onChange={(e) =>
                      setFormData({ ...formData, horaFin: e.value })
                    }
                    showIcon
                  />
                </div>
              </div>
              <div className="form-row form-row-split">
                <div className="col-12 md:col-3 mb-1">
                  <div className="flex flex-column gap-2 w-full max-w-[400px]">
                    {/* Leyenda */}
                    <span className="text-sm font-medium text-center">
                      ¿HABILITAR TEXTO?
                    </span>

                    {/* InputSwitch */}
                    <div className="flex justify-center">
                      <InputSwitch
                        checked={switchChecked}
                        onChange={(e) => setSwitchChecked(e.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 md:col-9 mb-1">
                  <label>AUTORIZADO POR</label>
                  <Dropdown
                    id="autorizador"
                    value={
                      selectedAutorizador ? selectedAutorizador.value : null
                    }
                    onChange={(e) => {
                      console.log("autorizador seleccionado:", e.value);
                      const selected = autorizadoresOptions.find(
                        (option) => option.value === e.value
                      );
                      setSelectedAutorizador(selected); // Guardar el objeto completo { label, value }
                    }}
                    options={autorizadoresOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccionar autorizador"
                    className="w-full"
                    filter
                    filterBy="label"
                    showClear
                  />
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

export default LicenciaForm;
