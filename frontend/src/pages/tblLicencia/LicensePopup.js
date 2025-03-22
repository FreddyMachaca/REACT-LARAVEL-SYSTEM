import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import axios from "axios";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./LicenciaForm.css";
const LicensePopup = ({ visible, onHide, licenseData, onValidate }) => {
  //   const LicensePopup = ({ visible, onHide, licenseData, onValidate }) => {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const header = <h5 className="custom-title">DATOS LICENCIA JUSTIFICADA</h5>;
  // Function to validate the permission
  const handleValidate = async () => {
    try {
      setLoading(true);

      await axios.put(
        `http://localhost:8000/api/licencias/validate-permission/${licenseData.lj_id}`,
        {
          lj_estado: "V", // Enviar el dato correcto en el body
        }
      );

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Permiso validado correctamente",
        life: 3000,
      });

      // Cerrar el popup después de la validación
      setTimeout(() => {
        onHide();
      }, 1000);
    } catch (error) {
      console.error("Error al validar el permiso:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo validar el permiso",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Footer buttons
  const renderFooter = () => {
    return (
      <div>
        <Button
          label="VALIDAR"
          icon="pi pi-check"
          onClick={handleValidate}
          loading={loading}
          className="p-button-success"
        />
        <Button
          label="CANCELAR"
          icon="pi pi-times"
          onClick={onHide}
          className="p-button-text"
          disabled={loading}
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header={null}
        footer={renderFooter()}
        style={{ width: "550px" }}
        modal
        closeOnEscape={!loading}
        closable={!loading}
      >
        {licenseData && (
          <div className="grid">
            {/* Header with avatar */}

            <div className="user-profile-header">
              <div className="user-avatar-container">
                <img
                  src={licenseData.avatar}
                  alt="Profile"
                  className="user-avatar"
                />
              </div>
              <div className="status-badge">
                {licenseData.estado || "PASIVO"}
              </div>
            </div>

            {/* Información del usuario */}
            <div className="flex flex-column">
              <div className="user-profile-info">
                <h3>{licenseData.funcionario}</h3>
                <p>
                  C.I: {licenseData.ci} CODIGO: {licenseData.codigo} ITEM:{" "}
                  {licenseData.item}
                </p>
              </div>
            </div>

            {/* Más secciones de información */}
            <div className="col-12 p-0 info-section">
              <div className="info-header">INFORMACIÓN FICHA ESCALAFÓN</div>
              <div className="info-row">
                <div className="info-label">FECHA ALTA</div>
                <div className="info-label">FECHA BAJA</div>
              </div>
              <div className="info-row">
                <div className="info-value">{licenseData.fecha_alta}</div>
                <div className="info-value">{licenseData.fecha_baja}</div>
              </div>
            </div>

            <div className="col-6 p-0 info-section">
              <div className="info-header">CATEGORÍA ADMINISTRATIVA</div>
              <div className="info-row">
                <div className="info-label">UBICACIÓN</div>
              </div>
              <div className="info-row">
                <div className="info-value">{licenseData.ubi_admin}</div>
              </div>
            </div>

            <div className="col-6 p-0 info-section">
              <div className="info-header">CATEGORÍA PROGRAMÁTICA</div>
              <div className="info-row">
                <div className="info-label">UBICACIÓN</div>
              </div>
              <div className="info-row">
                <div className="info-value">{licenseData.ubi_prog}</div>
              </div>
            </div>

            <Card header={header} className="custom-card">
              <div className="grid">
                {/* Fila 1 */}
                <div className="col-6">
                  <label className="info-label">TIPO LICENCIA</label>
                  <div className="info-value">
                    {licenseData.tipoLicencia || "No Definida"}
                  </div>
                </div>
                <div className="col-6">
                  <label className="info-label">AUTORIZADO POR</label>
                  <div className="info-value">
                    {licenseData.autorizadoPor || "No Definida"}
                  </div>
                </div>

                {/* Fila 2 */}
                <div className="col-6">
                  <label className="info-label">FECHA LICENCIA</label>
                  <div className="info-value">
                    {licenseData.fechaLicencia || "No Definido"}
                  </div>
                </div>
                <div className="col-6">
                  <label className="info-label">HORA LICENCIA</label>
                  <div className="info-value">
                    {licenseData.horaLicencia || "Sin archivos"}
                  </div>
                </div>

                {/* Fila 3 */}
                <div className="col-6">
                  <label className="info-label">MOTIVO</label>
                  <div className="info-value">
                    {licenseData.motivo || "No Definida"}
                  </div>
                </div>
                <div className="col-6">
                  <label className="info-label">LUGAR</label>
                  <div className="info-value">
                    {licenseData.lugar || "No Especificado"}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default LicensePopup;
