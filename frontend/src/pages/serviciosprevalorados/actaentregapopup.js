import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import DetalleRegistroPopup from "./detalleregistropopup";
import axios from "axios";

const ActaEntregaPopup = ({ visible, onHide, actaData }) => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [observacion, setObservacion] = useState("");
  const [recaudacionTotal, setRecaudacionTotal] = useState("0.00");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registros, setRegistros] = useState([]);
  const toast = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [totalImporte, setTotalImporte] = useState(0);
  const [puntoRecaudacion, setPuntoRecaudacion] = useState("");
  const [operador1erTurno, setOperador1erTurno] = useState("");
  const [operador2doTurno, setOperador2doTurno] = useState("");
  const [cambio, setCambio] = useState("0");
  const [cajaChica, setCajaChica] = useState("0");
  const [llaves, setLlaves] = useState("0");
  const [fechero, setFechero] = useState("0");
  const [tampo, setTampo] = useState("0");
  const [candados, setCandados] = useState("0");
  /* const operadores = [
    { label: "TORO IBAÑEZ VLADIMIR", value: "TORO IBAÑEZ VLADIMIR" },
  ];

  const tiposPunto = [
    { label: "BUSES PUERTA 1 SALIDA", value: "BUSES PUERTA 1 SALIDA" },
  ]; */

  // Load data initially and calculate totals
  useEffect(() => {
    fetchRegistros();
  }, []);

  // Calculate total recaudacion
  useEffect(() => {
    const total = registros.reduce(
      (sum, item) => sum + (parseFloat(item.importe_total) || 0),
      0
    );
    setTotalImporte(total);
    setRecaudacionTotal(total.toFixed(2));
  }, [registros]);

  const fetchRegistros = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/registros");
      if (response.data && Array.isArray(response.data)) {
        setRegistros(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setRegistros(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setRegistros([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      /*  toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los registros",
        life: 3000,
      }); */
    } finally {
      setLoading(false);
    }
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex justify-content-center">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => handleEditRecord(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => handleDeleteRecord(rowData)}
        />
      </div>
    );
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setDialogVisible(true);
  };

  const handleDeleteRecord = async (record) => {
    try {
      await axios.delete(`/registros/${record.id}`);
      // Remove from local state immediately for better UX
      setRegistros(registros.filter((r) => r.id !== record.id));
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Registro eliminado correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el registro",
        life: 3000,
      });
    }
  };

  const openNewRegistroDialog = () => {
    setSelectedRecord(null);
    setDialogVisible(true);
  };

  // Function to handle saving a record
  const handleSave = (nuevoRegistro) => {
    console.log("Datos recibidos del popup secundario:", nuevoRegistro);

    if (nuevoRegistro.id) {
      // Update existing record
      setRegistros((prevRegistros) =>
        prevRegistros.map((reg) =>
          reg.id === nuevoRegistro.id ? nuevoRegistro : reg
        )
      );

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Registro actualizado correctamente",
        life: 3000,
      });
    } else {
      // Add new record with temporary ID
      const newRegistroWithId = {
        ...nuevoRegistro,
        id: Date.now(), // Use timestamp as temporary ID
      };

      setRegistros((prevRegistros) => [...prevRegistros, newRegistroWithId]);

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Registro agregado correctamente",
        life: 3000,
      });
    }
  };

  const handleGuardarActa = async () => {
    try {
      const acta = {
        observacion,
        recaudacion_total: recaudacionTotal,
        punto_recaudacion: tiposPunto[0]?.value || "",
        fecha: startDate ? startDate.toISOString().split("T")[0] : "",
        grupo: document.getElementById("grupo")?.value || "",
        operador_1er_turno:
          document.getElementById("operador1erturno")?.value || "",
        operador_2do_turno:
          document.getElementById("operador2doturno")?.value || "",
        cambio_bs: document.getElementById("cambio")?.value || "0",
        caja_chica_bs: document.getElementById("cajachica")?.value || "0",
        llaves: document.getElementById("llaves")?.value || "0",
        fechero: document.getElementById("fechero")?.value || "0",
        tampo: document.getElementById("tampo")?.value || "0",
        candados: document.getElementById("candados")?.value || "0",
        registros: registros.map((r) => ({
          id: r.id,
          tipo_servicio: r.tipo_servicio,
          descripcion: r.descripcion,
          desde_numero: r.desde_numero,
          hasta_numero: r.hasta_numero,
          vendido: r.cantidad_boletos,
          cantidad_boletos: r.cantidad_boletos,
          precio_unitario: r.precio_unitario,
          importe_total: r.importe_total,
          estado: r.estado || "A",
        })),
      };
      console.log("datos a ser almacenados:", acta);

      await axios.post("/actas", acta);

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Acta guardada correctamente",
        life: 3000,
      });

      onHide(); // Close main popup after successful save
    } catch (error) {
      console.error("Error saving acta:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el acta",
        life: 3000,
      });
    }
  };

  const handleCancelarActa = () => {
    // Reset form and hide dialog
    setObservacion("");
    onHide();
  };

  const header = (
    <div className="flex justify-content-between">
      <div className="flex align-items-center">
        <span>Mostrar</span>
        <Dropdown
          value={rows}
          options={[10, 20, 30]}
          onChange={(e) => setRows(e.value)}
          className="mx-2"
          style={{ width: "4rem" }}
        />
        <span>registros</span>
      </div>
      <div>
        <span className="mr-2">Buscar:</span>
        <InputText type="search" />
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-content-between">
      <div>
        <span>
          Mostrando registros del {first + 1} al{" "}
          {Math.min(first + rows, registros.length)} de un total de{" "}
          {registros.length} registros
        </span>
      </div>
      <div className="flex">
        <Button icon="pi pi-angle-left" className="p-button-text" />
        <Button label="1" className="p-button-text p-button-secondary" />
        <Button icon="pi pi-angle-right" className="p-button-text" />
      </div>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Crear Acta de Entrega"
        style={{ width: "85vw" }}
        modal
      >
        <Card title="Acta de Entrega" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="grid">
            <div className="col-12 md:col-3">
              <label htmlFor="puntoRecaudacion">Punto de Recaudación</label>
              <InputText
                id="puntoRecaudacion"
                value={puntoRecaudacion}
                onChange={(e) => setPuntoRecaudacion(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-12 md:col-3">
              <label htmlFor="fecha">Fecha</label>
              <Calendar
                value={startDate}
                onChange={(e) => setStartDate(e.value)}
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
            <div className="col-12 md:col-2">
              <label htmlFor="grupo">Grupo</label>
              <InputText id="grupo" className="w-full" />
            </div>
            <div className="col-12 md:col-3">
              <label htmlFor="operador1erturno">Operador 1er Turno</label>
              <InputText
                id="operador1erturno"
                value={operador1erTurno}
                onChange={(e) => setOperador1erTurno(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid mt-3">
            <div className="col-12 md:col-3">
              <label htmlFor="operador2doturno">Operador 2do. Turno</label>
              <InputText
                id="operador2doturno"
                value={operador2doTurno}
                onChange={(e) => setOperador2doTurno(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-12 md:col-2">
              <label htmlFor="cambio">Cambio BS</label>
              <InputText
                id="cambio"
                value={cambio}
                onChange={(e) => setCambio(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-12 md:col-2">
              <label htmlFor="cajachica">Caja Chica BS</label>
              <InputText
                id="cajachica"
                value={cajaChica}
                onChange={(e) => setCajaChica(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-12 md:col-2">
              <label htmlFor="llaves">Llaves</label>
              <InputText
                id="llaves"
                value={llaves}
                onChange={(e) => setLlaves(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-12 md:col-2">
              <label htmlFor="fechero">Fechero</label>
              <InputText
                id="fechero"
                value={fechero}
                onChange={(e) => setFechero(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid mt-3">
            <div className="col-12 md:col-2">
              <label htmlFor="tampo">Tampo</label>
              <InputText
                id="tampo"
                value={tampo}
                onChange={(e) => setTampo(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-12 md:col-2">
              <label htmlFor="candados">Candados</label>
              <InputText
                id="candados"
                value={candados}
                onChange={(e) => setCandados(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <DataTable
            value={registros}
            header={header}
            footer={footer}
            paginator
            rows={rows}
            first={first}
            onPage={(e) => setFirst(e.first)}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            className="mt-3"
            stripedRows
            responsiveLayout="scroll"
            style={{ backgroundColor: "#f8f9fa" }}
            loading={loading}
            emptyMessage="No hay registros disponibles"
          >
            <Column field="id" header="#" style={{ width: "3rem" }} />
            <Column
              field="tipo_servicio"
              header="TIPO SERVICIO"
              style={{ width: "6rem" }}
            />
            <Column field="descripcion" header="DESCRIPCION DEL SERVICIO" />
            <Column
              field="desde_numero"
              header="DESDE NÚMERO"
              style={{ width: "8rem" }}
            />
            <Column
              field="hasta_numero"
              header="HASTA NÚMERO"
              style={{ width: "8rem" }}
            />
            <Column
              field="vendido"
              header="VENDIDO"
              style={{ width: "5rem" }}
            />
            <Column
              field="cantidad_boletos"
              header="CANTIDAD"
              style={{ width: "5rem" }}
            />
            <Column
              field="precio_unitario"
              header="PRECIO UNITARIO"
              style={{ width: "7rem" }}
            />
            <Column
              field="importe_total"
              header="IMPORTE BS"
              style={{ width: "7rem" }}
            />
            <Column field="estado" header="ESTADO" style={{ width: "5rem" }} />
            <Column body={actionTemplate} style={{ width: "8rem" }} />
          </DataTable>

          <div className="grid mt-3">
            <div className="col-12 md:col-8">
              <label htmlFor="observacion">Observación</label>
              <InputTextarea
                id="observacion"
                name="ae_observacion"
                className="w-full"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
              />
            </div>
            <div className="col-12 md:col-2">
              <label htmlFor="recaudacionTotal">Recaudación Total BS</label>
              <InputText
                id="totalImporte"
                className="w-full"
                value={totalImporte.toFixed(2)}
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-content-between mt-3">
            <div className="flex">
              <Button
                label="GUARDAR"
                icon="pi pi-save"
                className="p-button-success mr-2"
                onClick={handleGuardarActa}
              />
              <Button
                label="CANCELAR"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={handleCancelarActa}
              />
            </div>
            <div>
              <Button
                icon="pi pi-bars"
                className="p-button-rounded p-button-info"
                style={{ width: "3.5rem", height: "3.5rem" }}
                onClick={openNewRegistroDialog}
              />
            </div>
          </div>
        </Card>
      </Dialog>

      <DetalleRegistroPopup
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        currentData={selectedRecord} // Fixed property name (was 'urrentData')
        onSave={handleSave}
      />
    </>
  );
};

export default ActaEntregaPopup;
