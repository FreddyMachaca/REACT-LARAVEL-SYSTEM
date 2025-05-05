// AuthorizationPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import axios from "axios";
import LicensePopup from "./LicensePopup";
import useAuth from 'hooks/useAuth';
import "./AuthorizationPopup.css";

const AuthorizationPopup = ({ onClose, onOpenAuthDetail }) => {
   const { user, logout } = useAuth();
    const autorizaId = user?.us_per_id;
  const [visible, setVisible] = useState(true);
  const [pendingAuthorizations, setPendingAuthorizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
 const [modalVisible, setModalVisible] = useState(false);
 const [selectedLicense, setSelectedLicense] = useState(null);
  
  useEffect(() => {
    if (autorizaId) {
      fetchPendingAuthorizations(autorizaId);
    }
  }, [autorizaId]);
  
  const fetchPendingAuthorizations = async (autorizaId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/licencias/autorizador/${autorizaId}`);
      const records = response.data;
      console.log("muestra los datos de permisos....",response.data);
      const formattedData = records.map((item) => ({
        lj_id: item.lj_id,
        papeleta: item.lj_id,
        codigo: item.per_id,
        funcionario: `${item.per_nombres} ${item.per_ap_paterno} ${item.per_ap_materno}`,
        ci: item.per_num_doc,
        tipoLicencia: item.cat_descripcion,
        fechaLicencia: `${formatoFecha(item.lj_fecha_inicial.split("T")[0])} - ${formatoFecha(item.lj_fecha_final.split("T")[0])}`,
        horaLicencia: `${item.lj_hora_salida} - ${item.lj_hora_retorno}`,
        motivo: item.lj_motivo,
        lugar: item.lj_lugar,
        autorizadoPor: item.lj_per_id_autoriza,
        estado: item.lj_estado === "V" ? "VALIDADO" : "PENDIENTE",
      }));
  
      setPendingAuthorizations(formattedData);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los datos",
        life: 3000,
      });
    }
    setLoading(false);
  };
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
 
// Botón de la tabla para abrir el popup
const openPopup = async (license) => {
  try {
  
    const urlBoleta = `http://localhost:8000/api/licencias/boleta/${license.papeleta}`;
    const urlPersona = `http://localhost:8000/api/tbllicenciajustificada/persona/${license.codigo}`;
     
    console.log("Consultando API:", urlBoleta, urlPersona);

    const [boletaResponse, personaResponse] = await Promise.all([
      axios.get(urlBoleta),
      axios.get(urlPersona),
    ]);

    console.log("Boleta Data:", boletaResponse.data);
    console.log("Persona Data:", personaResponse.data);

    const boletaData = boletaResponse.data;
    const personaData = personaResponse.data;

    const popupData = {
      avatar:personaData.avatar,
      item: `${personaData.ca_ti_item || "" }${personaData.ca_num_item || "" }`.trim(),
      fecha_alta: formatoFecha(personaData.as_fecha_inicio) || "No especificado",
      fecha_baja: formatoFecha(personaData.as_fecha_fin) || "No especificado",
      ubi_admin: personaData.codigo_administrativo || "No especificado",
      ubi_prog: personaData.codigo_programatico || "No especificado",
      lj_id: boletaData.lj_id || "No especificado",
      codigo: boletaData.per_id,
      papeleta: boletaData.lj_id || "No especificado",
      funcionario: `${boletaData.per_nombres || ""} ${
        boletaData.per_ap_paterno || ""
      } ${boletaData.per_ap_materno || ""}`.trim(),
      ci: boletaData.per_num_doc || "No especificado",
      tipoLicencia: boletaData.cat_descripcion || "No especificado",
      fechaLicencia: `${formatoFecha(boletaData.lj_fecha_inicial) || "No especificado"} - ${
        formatoFecha(boletaData.lj_fecha_final) || "No especificado"
      }`,
      horaLicencia: `${boletaData.lj_hora_salida || "No especificado"} - ${
        boletaData.lj_hora_retorno || "No especificado"
      }`,
      motivo: boletaData.lj_motivo || "No especificado",
      lugar: boletaData.lj_lugar || "No especificado",
      autorizadoPor: boletaData.lj_per_id_autoriza || "No especificado",
      estado: boletaData.estado || "Pendiente",
    };

    console.log("Datos combinados para popup:", popupData);

    setSelectedLicense(popupData);
    setModalVisible(true);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
  }
};
// Validar licencia y actualizar la tabla
const handleValidate = (codigo) => {
  setLicenses((prevLicenses) =>
    prevLicenses.map((lic) =>
      lic.codigo === codigo ? { ...lic, estado: "VALIDADO" } : lic
    )
  );
  toast.current.show({
    severity: "success",
    summary: "Éxito",
    detail: "Licencia validada",
    life: 3000,
  });  
};

function formatoFecha(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear()
  ].join('/');
}
  return (
    <>
      <Toast ref={toast} />
      
      <Dialog
        header={
          <div className="authorization-header blue-gradient-bar">
            <div className="authorization-title">
              <i className="pi pi-envelope"></i>
              <span>Solicitudes pendientes por autorizar</span>
            </div>
            <Button 
              icon="pi pi-times" 
              className="p-button-rounded p-button-text p-button-plain close-button" 
              onClick={handleClose}
            />
          </div>
        }
        visible={visible}
        style={{ width: "80vw" }}
        contentClassName="authorization-popup-content"
        headerClassName="authorization-popup-header"
        className="authorization-popup"
        closable={false}  // Esta es la propiedad clave que desactiva el botón de cerrar
        modal={true}      // Evita que se cierre haciendo clic fuera
        showHeader={true}
        footer={
          <div className="authorization-footer">
            <Button
              label="Aceptar"
              className="accept-button"
              onClick={handleClose}
            />
          </div>
        }
      >
        <div className="transaction-title">
          Transacciones pendientes de autorizar licencias justificadas
        </div>

        <DataTable
          value={pendingAuthorizations}
          className="authorization-table"
          paginator
          rows={rowsPerPage}
          loading={loading}
          emptyMessage="No hay licencias disponibles."
          globalFilter={globalFilter}
        >
          <Column field="papeleta" header="N° Papeleta" sortable />
          <Column field="codigo" header="Código" sortable />
          <Column field="funcionario" header="Funcionario" />
          <Column field="ci" header="C.I." />
          <Column field="tipoLicencia" header="Tipo Licencia" />
          <Column field="fechaLicencia" header="Fecha Licencia" />
          <Column field="horaLicencia" header="Hora Licencia" />
          <Column
            field="estado"
            header="Estado"
            body={(rowData) => (
              <span
                className={`p-tag p-tag-${
                  rowData.estado === "VALIDADO" ? "success" : "warning"
                }`}
              >
                {rowData.estado}
              </span>
            )}
          />
          <Column
            header="Controles"
            body={(rowData) => (
              <Button
                icon="pi pi-check"
                className="p-button-primary"
                disabled={rowData.estado === "VALIDADO"}
                // onClick={() => openAuthorizationDetail(rowData)}
                onClick={() => openPopup(rowData)}
              />
            )}
          />
        </DataTable>
        
        <div className="file-count">... ({pendingAuthorizations.length}) Fila(s)</div>
        {/* Popup de Validación */}
      {selectedLicense && (
        <LicensePopup
          visible={modalVisible}
          onHide={() => setModalVisible(false)}
          licenseData={selectedLicense}
          onValidate={handleValidate}
        />
      )}
      </Dialog>
    </>
  );
};

export default AuthorizationPopup;