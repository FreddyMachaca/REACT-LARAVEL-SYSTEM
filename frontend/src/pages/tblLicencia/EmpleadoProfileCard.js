import React from 'react';
import { Card } from 'primereact/card';
import './EmpleadoProfileCard.css'; // We'll define styling separately

const EmpleadoProfileCard = ({ empleadoData }) => {
  return (
    <div className="flex user-profile-card">
      {empleadoData ? (
        <Card className="w-full">
          <div className="flex flex-column">
            {/* Contenedor de la imagen */}
            <div className="user-profile-header">
              <div className="user-avatar-container">
                <img
                  src={empleadoData.foto}
                  alt="Profile"
                  className="user-avatar"
                />
              </div>
              <div className="status-badge">
                {empleadoData.estado || "PASIVO"}
              </div>
            </div>

            {/* Información del usuario */}
            <div className="user-profile-info">
              <h3>{empleadoData.nombre}</h3>
              <p>
                C.I: {empleadoData.ci} CODIGO: {empleadoData.codigo} ITEM:{" "}
                {empleadoData.item}
              </p>
            </div>

            {/* Resto de la información */}
            <div className="info-section">
              <div className="info-header">ESCALAFÓN</div>
              <div className="info-grid">
                {/* Primera fila */}
                <div className="info-row">
                  <div className="info-label">CARGO</div>
                  <div className="info-label">PUESTO</div>
                  <div className="info-label">HABER BÁSICO (BS)</div>
                </div>
                <div className="info-row">
                  <div className="info-value">{empleadoData.cargo}</div>
                  <div className="info-value">{empleadoData.puesto}</div>
                  <div className="info-value">
                    {empleadoData.haber_basico}
                  </div>
                </div>

                {/* Segunda fila */}
                <div className="info-row">
                  <div className="info-label">CÓDIGO ESCALAFÓN</div>
                  <div className="info-label">CLASE</div>
                  <div className="info-label">NIVEL SALARIAL</div>
                </div>
                <div className="info-row">
                  <div className="info-value">
                    {empleadoData.codigo_escalafon}
                  </div>
                  <div className="info-value">{empleadoData.clase}</div>
                  <div className="info-value">
                    {empleadoData.nivel_salarial}
                  </div>
                </div>
              </div>
            </div>

            {/* Más secciones de información */}
            <div className="info-section">
              <div className="info-header">
                INFORMACIÓN FICHA ESCALAFÓN
              </div>
              <div className="info-row">
                <div className="info-label">FECHA ALTA</div>
                <div className="info-label">FECHA BAJA</div>
              </div>
              <div className="info-row">
                <div className="info-value">
                  {empleadoData.fecha_alta}
                </div>
                <div className="info-value">
                  {empleadoData.fecha_baja}
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-header">CATEGORÍA ADMINISTRATIVA</div>
              <div className="info-row">
                <div className="info-label">UBICACIÓN</div>
                <div className="info-label">CATEGORÍA</div>
              </div>
              <div className="info-row">
                <div className="info-value">
                  {empleadoData.ubicacion_admin}
                </div>
                <div className="info-value">
                  {empleadoData.categoria_admin}
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-header">CATEGORÍA PROGRAMÁTICA</div>
              <div className="info-row">
                <div className="info-label">UBICACIÓN</div>
                <div className="info-label">CATEGORÍA</div>
              </div>
              <div className="info-row">
                <div className="info-value">
                  {empleadoData.ubicacion_prog}
                </div>
                <div className="info-value">
                  {empleadoData.categoria_prog}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="empty-profile-message">
            <p>Seleccione un sujeto para ver su información</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmpleadoProfileCard;