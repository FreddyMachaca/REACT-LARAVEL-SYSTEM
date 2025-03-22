import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

const DetalleRegistroPopup = ({
  visible,
  onHide,
  onSave,
  currentData = null,
}) => {
  const [tipoServicio, setTipoServicio] = useState(currentData?.tipo_servicio || "");
  const [descripcionServicio, setDescripcionServicio] = useState(
    currentData?.descripcion_servicio || ""
  );
  const [desdeNumero, setDesdeNumero] = useState(currentData?.desde_numero || "");
  const [hastaNumero, setHastaNumero] = useState(currentData?.hasta_numero || "");
  const [loading, setLoading] = useState(false);
  const [tiposServicio, setTiposServicio] = useState([]);
  const [precioUnitario, setPrecioUnitario] = useState(currentData?.precio_unitario || 0);

  // Obtener los servicios desde la API
  useEffect(() => {
    if (visible) {
      fetchServicios();
    }
  }, [visible]);

  const fetchServicios = async () => {
    try {
      const response = await axios.get("/servicios");
      console.log("Servicios obtenidos:", response.data.data);
      if (response.data.success) {
        setTiposServicio(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching servicios:", error);
    }
  };

  useEffect(() => {
    if (currentData) {
      // Ensure we're using the correct property names
      setTipoServicio(currentData.tipo_servicio || "");
      setDescripcionServicio(currentData.descripcion_servicio || "");
      setDesdeNumero(currentData.desde_numero || "");
      setHastaNumero(currentData.hasta_numero || "");
      setPrecioUnitario(currentData.precio_unitario || 0);
    } else {
      resetForm();
    }
  }, [currentData, visible]);

  const resetForm = () => {
    setTipoServicio("");
    setDescripcionServicio("");
    setDesdeNumero("");
    setHastaNumero("");
    setPrecioUnitario(0);
  };

  // Calcular cantidad de boletos y importe total
  const calcularCantidadYImporte = () => {
    const desde = parseInt(desdeNumero, 10);
    const hasta = parseInt(hastaNumero, 10);

    if (isNaN(desde) || isNaN(hasta) || desde > hasta) {
      console.error("Valores de desdeNumero y hastaNumero no son válidos");
      return { cantidadBoletos: 0, importeTotal: 0 };
    }

    const cantidadBoletos = hasta - desde + 1;
    const importeTotal = cantidadBoletos * precioUnitario;

    return { cantidadBoletos, importeTotal };
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { cantidadBoletos, importeTotal } = calcularCantidadYImporte();

      // Create data object with field names matching the parent component's expectations
      const data = {
        id: currentData?.id, // Include id if editing an existing record
        tipo_servicio: tipoServicio,
        descripcion: descripcionServicio, // Match the field name in DataTable
        desde_numero: desdeNumero,
        hasta_numero: hastaNumero,
        vendido: "SI", // Default value for new records
        cantidad_boletos: cantidadBoletos,
        precio_unitario: precioUnitario,
        importe_total: importeTotal,
        estado: "ACTIVO" // Default value for new records
      };

      console.log("Datos a guardar:", data);

      // API call can be kept for server-side persistence
      let response;
      if (currentData?.id) {
        response = await axios.put(`/registros/${currentData.id}`, data);
      } else {
        response = await axios.post("/registros", data);
      }

      // Always call onSave and onHide regardless of API response to ensure UI updates
      onSave(data);
      onHide();
      resetForm();
      
    } catch (error) {
      console.error("Error saving record:", error);
      // Even on error, close the dialog but show an error message in the parent
      onHide();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onHide();
  };

  // Actualizar el precio unitario cuando se selecciona un servicio
  useEffect(() => {
    const selectedServicio = tiposServicio.find(
      (t) => t.value === tipoServicio
    );
    if (selectedServicio) {
      console.log("Servicio seleccionado:", selectedServicio);
      console.log(selectedServicio.preuni);
      setPrecioUnitario(selectedServicio.preuni || 0);
    } else {
      setPrecioUnitario(0);
    }
  }, [tipoServicio, tiposServicio]);

  // Actualizar la descripción del servicio cuando se selecciona un tipo
  useEffect(() => {
    const selectedTipo = tiposServicio.find((t) => t.value === tipoServicio);
    if (selectedTipo) {
      setDescripcionServicio(selectedTipo.label);
    }
  }, [tipoServicio, tiposServicio]);

  const footer = (
    <div className="flex justify-content-end">
      <Button
        label="GUARDAR"
        icon="pi pi-check"
        className="p-button-success mr-2"
        onClick={handleSave}
        loading={loading}
      />
      <Button
        label="CANCELAR"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={handleCancel}
        disabled={loading}
      />
    </div>
  );

  return (
    <Dialog
      header="Detalle Registro"
      visible={visible}
      style={{ width: "600px" }}
      footer={footer}
      onHide={handleCancel}
      modal
      closeOnEscape={!loading}
      closable={!loading}
    >
      <div className="grid p-fluid">
        <div className="col-12 md:col-5 mb-2">
          <label htmlFor="tipoServicio" className="block font-bold mb-2">
            TIPO SERVICIO
          </label>
          <Dropdown
            id="tipoServicio"
            value={tipoServicio}
            options={tiposServicio}
            onChange={(e) => setTipoServicio(e.value)}
            placeholder="Seleccione tipo de servicio"
            className="w-full"
            filter
            filterBy="label"
            showClear
            disabled={loading}
          />
        </div>

        <div className="col-12 md:col-3 mb-2">
          <label htmlFor="desdeNumero" className="block font-bold mb-2">
            DESDE NÚMERO
          </label>
          <InputText
            id="desdeNumero"
            value={desdeNumero}
            onChange={(e) => setDesdeNumero(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        </div>

        <div className="col-12 md:col-3 mb-2">
          <label htmlFor="hastaNumero" className="block font-bold mb-2">
            HASTA NÚMERO
          </label>
          <InputText
            id="hastaNumero"
            value={hastaNumero}
            onChange={(e) => setHastaNumero(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default DetalleRegistroPopup;