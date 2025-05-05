import React from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css"; // We'll define styling separately

const EmpleadoFileCard = ({ empleadoData }) => {

      const cardHeaderStyle = {
        fontSize: "0.8rem",
        fontWeight: "bold",
        padding: "0.5rem",
        backgroundColor: "#f8f9fa",
      };
    
      const labelStyle = {
        fontSize: "0.8rem",
        fontWeight: "bold",
        marginBottom: "0.2rem",
      };
    
      const valueStyle = {
        fontSize: "0.8rem",
      };
  return (
    <div>
      {empleadoData ? (
        <Card className="w-full">
          <h5 className="ml-3">Administración de horarios</h5>
          <div className="grid">
            <div className="col-4 md:col-3 flex flex-column align-items-center justify-content-center">
              <Avatar
                image={empleadoData.foto}
                style={{ width: "120px", height: "120px" }}
                shape="circle"
              />
              <h6 className="mt-2 mb-0">{empleadoData.nombre}</h6>
              <p className="mt-1 mb-0">
                C.I: {empleadoData.ci}   CÓDIGO: {empleadoData.codigo}   ITEM: {empleadoData.item}
              </p>
              <Button
                label={empleadoData.estado || "PASIVO"}
                className="p-button-success p-button-sm mt-2"
              />
              
            </div>

            <div className="col-8 md:col-9">
              <div className="grid">
                {/* First row: Escalafón and Fecha Asignación */}
                <div className="col-12">
                  <div className="grid">
                    <div className="col-12 md:col-6 pr-1">
                      <div className="card mb-0" style={{ height: "100%" }}>
                        <div style={cardHeaderStyle}>ESCALAFÓN</div>
                        <div className="p-2">
                          <div className="grid">
                            <div className="col-6">
                              <div className="field mb-2">
                                <label style={labelStyle}>CARGO</label>
                                <div style={valueStyle}>
                                {empleadoData.cargo}
                                </div>
                              </div>
                              <div className="field">
                                <label style={labelStyle}>
                                  HABER BÁSICO (BS)
                                </label>
                                <div style={valueStyle}>{empleadoData.haber_basico}</div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="field mb-2">
                                <label style={labelStyle}>PUESTO</label>
                                <div style={valueStyle}>
                                  ASISTENTE ADMINISTRATIVO I DE SALARIOS
                                </div>
                              </div>
                              <div className="field">
                                <label style={labelStyle}>ESCALAFÓN</label>
                                <div style={valueStyle}>401 - D - 07</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 md:col-6 pl-1">
                      <div className="grid">
                        <div className="col-12 pr-1">
                          <div className="card mb-0" style={{ height: "100%" }}>
                            <div style={cardHeaderStyle}>FECHA ASIGNACIÓN</div>
                            <div className="p-2">
                              <div className="grid">
                                <div className="col-6">
                                  <div className="field">
                                    <label style={labelStyle}>FECHA ALTA</label>
                                    <div style={valueStyle}>{empleadoData.fecha_alta}</div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="field">
                                    <label style={labelStyle}>FECHA BAJA</label>
                                    <div style={valueStyle}>{empleadoData.fecha_baja}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second row: Categoría Administrativa and Categoría Programática */}
                <div className="col-12 mt-2">
                  <div className="grid">
                    {/* Categoría Administrativa */}
                    <div className="col-12 md:col-6 pr-1">
                      <div className="card mb-0" style={{ height: "100%" }}>
                        <div style={cardHeaderStyle}>
                          CATEGORÍA ADMINISTRATIVA
                        </div>
                        <div className="p-2">
                          <div className="grid">
                            <div className="col-6">
                              <div className="field">
                                <label style={labelStyle}>UBICACIÓN</label>
                                <div style={valueStyle}>
                                {empleadoData.ubicacion_admin}
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="field">
                                <label style={labelStyle}>CATEGORÍA</label>
                                <div style={valueStyle}>{empleadoData.categoria_admin}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Categoría Programática */}
                    <div className="col-12 md:col-6 pl-1">
                      <div className="card mb-0" style={{ height: "100%" }}>
                        <div style={cardHeaderStyle}>
                          CATEGORÍA PROGRAMÁTICA
                        </div>
                        <div className="p-2">
                          <div className="grid">
                            <div className="col-6">
                              <div className="field">
                                <label style={labelStyle}>UBICACIÓN</label>
                                <div style={valueStyle}>
                                {empleadoData.ubicacion_prog}
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="field">
                                <label style={labelStyle}>CATEGORÍA</label>
                                <div style={valueStyle}>
                                {empleadoData.categoria_prog}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default EmpleadoFileCard;
