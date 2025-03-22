import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import ActaEntregaPopup from "./actaentregapopup"; // Importar el componente del popup
import axios from "axios";


const ActaEntregaSystem = () => {
  const dt = useRef(null);
  const [actas, setActas] = useState("");

  const [dialogVisible, setDialogVisible] = useState(false);
  const [correlativo, setCorrelativo] = useState("");
  const [fecha, setFecha] = useState(null);
  const [estado, setEstado] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del popup
  const [seleccion, setSeleccion] = useState(null);
  const [newActa, setNewActa] = useState({
    actaId: 0,
    correlativo: 0,
    punto: "",
    fecha: "",
    grupo: 4,
    operador1: "",
    operador2: "",
    observacion: "",
    recaudacion: 0,
    estado: "M",
  });

  const toast = useRef(null);

  const exportarActaPDF = (formData) => {
     // Create a new window with just this record's data
     const printWindow = window.open('', '_blank');
     printWindow.document.write(`
         <html>
             <head>
                 <title>Acta Entrega - ${formData.ae_actaid}</title>
                 <style>
                     body { font-family: Arial, sans-serif; }
                     table { width: 100%; border-collapse: collapse; }
                     th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                     th { background-color: #f2f2f2; }
                     .header { text-align: center; margin-bottom: 20px; }
                 </style>
             </head>
             <body>
                 <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
          <div ref={pdfContentRef} className="p-4 bg-white">
            {/* Contenido del PDF */}
            <div className="border border-gray-300 p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
              <div className="text-center font-bold mb-4">
                ENTIDAD DESCENTRALIZADA TERMINAL METROPOLITANA EL ALTO - ACTA DE ENTREGA
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>PUNTO DE RECAUDACIÓN:</strong> ${formData.punto_recaud_id}
                </div>
                <div>
                  <strong>FECHA:</strong> ${formatDateForDisplay(formData.ae_fecha)}
                </div>
                <div>
                  <strong>OPERADOR(A) 1ER TURNO:</strong> ${formData.ae_operador1erturno}
                </div>
                <div>
                  <strong>OPERADOR(A) 2DO TURNO:</strong> ${formData.ae_operador2doturno}
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mb-4 text-center">
                <div>
                  <strong>GRUPO:</strong><br/>
                  ${formData.ae_grupo}
                </div>
                <div>
                  <strong>CAMBIO Bs:</strong><br/>
                  ${parseFloat(formData.ae_cambiobs)}
                </div>
                <div>
                  <strong>CAJA CHICA Bs:</strong><br/>
                  ${parseFloat(formData.ae_cajachicabs)}
                </div>
                <div>
                  <strong>LLAVES:</strong><br/>
                  ${formData.ae_llaves}
                </div>
                <div>
                  <strong>FECHERO:</strong><br/>
                 ${formData.ae_fechero}
                </div>
              </div>
              
              <div className="text-xs mb-4">
                Mediante esta Acta queda establecido toda la responsabilidad de los talonarios de facturas de cada uso de servicios,
                entregado al grupo de turno a la cabeza del supervisor siendo ellos los principales responsables por cualquier daño,
                extravio de las mismas una vez firmada el acta hasta su retorno a recaudaciones.
              </div>
              
              <div className="mb-4">
                <div className="font-bold">▼ ENTREGA DE PREVALORADAS (DE CAJERO A OPERADOR 1ER TURNO)</div>
                <div className="text-xs mb-1">COSTOS SEGÚN TIPO DE PRE VALORADA: UTP=2,50.- GE=10,00.- PV=4,00.-</div>
                
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-1">N°</th>
                      <th className="border border-gray-400 p-1">TIPO DE PRE VALORADA</th>
                      <th className="border border-gray-400 p-1">DESDE EL NÚMERO</th>
                      <th className="border border-gray-400 p-1">HASTA EL NÚMERO</th>
                      <th className="border border-gray-400 p-1">VENDIDO HASTA EL</th>
                      <th className="border border-gray-400 p-1">CANTIDAD (C-A+1)</th>
                      <th className="border border-gray-400 p-1">IMPORTE Bs.- (D*COSTO)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prevaloradas.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 p-1 text-center">{item.numero}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.tipo}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.desde}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.hasta}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.vendido || ''}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.cantidad}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.importe.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" className="border border-gray-400 p-1 text-right font-bold">UTP SUB TOTAL:</td>
                      <td colSpan="2" className="border border-gray-400 p-1 text-center font-bold">{subtotales.utpTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="border border-gray-400 p-1 text-right font-bold">GE SUB TOTAL:</td>
                      <td colSpan="2" className="border border-gray-400 p-1 text-center font-bold">{subtotales.geTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="border border-gray-400 p-1 text-right font-bold">PV SUB TOTAL:</td>
                      <td colSpan="2" className="border border-gray-400 p-1 text-center font-bold">{subtotales.pvTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="border border-gray-400 p-1 text-right font-bold">INF SUB TOTAL:</td>
                      <td colSpan="2" className="border border-gray-400 p-1 text-center font-bold">{subtotales.infTotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border-t border-black pt-2 text-center">
                  ENTREGUE CONFORME - Cajero de turno - firma y sello
                </div>
                <div className="border-t border-black pt-2 text-center">
                  RECIBI CONFORME - Operador de 1er turno - firma y sello
                </div>
              </div>
              
              <div className="mb-4">
                <div className="font-bold">▼ ENTREGA DE PREVALORADAS (DE OPERADOR 1ER TURNO A OPERADOR 2DO TURNO)</div>
                <div className="text-xs mb-1">COSTOS SEGÚN TIPO DE PRE VALORADA: UTP=2,50.- GE=10,00.- PV=4,00.-</div>
                
                {/* Segunda tabla - misma estructura que la primera */}
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-1">N°</th>
                      <th className="border border-gray-400 p-1">TIPO DE PRE VALORADA</th>
                      <th className="border border-gray-400 p-1">DESDE EL NÚMERO</th>
                      <th className="border border-gray-400 p-1">HASTA EL NÚMERO</th>
                      <th className="border border-gray-400 p-1">VENDIDO HASTA EL</th>
                      <th className="border border-gray-400 p-1">CANTIDAD (C-A+1)</th>
                      <th className="border border-gray-400 p-1">IMPORTE Bs.- (D*COSTO)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Aquí se puede usar los mismos datos u otros específicos para el segundo turno */}
                    {prevaloradas.slice(0, 3).map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 p-1 text-center">{item.numero}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.tipo}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.desde}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.hasta}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.vendido || ''}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.cantidad}</td>
                        <td className="border border-gray-400 p-1 text-center">{item.importe.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" className="border border-gray-400 p-1 text-right font-bold">UTP SUB TOTAL:</td>
                      <td colSpan="2" className="border border-gray-400 p-1 text-center font-bold">{subtotales.utpTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="border border-gray-400 p-1 text-right font-bold">GE SUB TOTAL:</td>
                      <td colSpan="2" className="border border-gray-400 p-1 text-center font-bold">{subtotales.geTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="border border-gray-400 p-1 text-right font-bold">PV SUB TOTAL:</td>
                      <td colSpan="2" className="border border-gray-400 p-1 text-center font-bold">{subtotales.pvTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="border border-gray-400 p-1 text-right font-bold">INF SUB TOTAL:</td>
                      <td colSpan="2" className="border border-gray-400 p-1 text-center font-bold">{subtotales.infTotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border-t border-black pt-2 text-center">
                  ENTREGUE CONFORME - Operador de 1er turno - firma y sello
                </div>
                <div className="border-t border-black pt-2 text-center">
                  RECIBI CONFORME - Operador de 2do turno - firma y sello
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border-t border-black pt-2 text-center">
                  ENTREGUE CONFORME - Operador de 2do turno - firma y sello
                </div>
                <div className="border-t border-black pt-2 text-center">
                  RECIBI CONFORME - Cajero de turno - firma y sello
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="font-bold">▲ 1ER TURNO - RECAUDACIÓN TOTAL Bs.-</div>
                  <div className="border border-gray-400 p-2 mt-1 h-8"></div>
                </div>
                <div className="text-center">
                  <div className="font-bold">▲ 2DO TURNO - RECAUDACIÓN TOTAL Bs.-</div>
                  <div className="border border-gray-400 p-2 mt-1 h-8"></div>
                </div>
              </div>
              
              <div className="text-xs mt-4">
                <strong>OBSERVACIÓN:</strong><br/>
                Nota importante: La entrega de talonarios debe de estar en un estado aceptable, no deteriorado, no roto, no mojado, intacto la parte de N° de factura y N° de Autorización, caso contrario dar
                solución o asumir las sanciones correspondientes.
              </div>
            </div>
          </div>
        </div>             </body>
         </html>
     `);
     printWindow.document.close();
     printWindow.print();};

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
        />

        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
        />
        <Button
          icon="pi pi-file"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => exportarActaPDF(rowData)}
        />
      </div>
    );
  };

  // Search function
  const searchActa = async () => {
    try {
      const response = await axios.get("/actas/buscar", {
        params: {
          correlativo: correlativo || "",
          fecha: fecha ? fecha.toISOString().split("T")[0] : "",
          estado: estado || "",
        },
      });

      setActas(response.data); // Cargar los datos en la tabla

      toast.current.show({
        severity: "success",
        summary: "Búsqueda Exitosa",
        detail: `Se encontraron ${response.data.length} actas.`,
      });
    } catch (error) {
      console.error("Error al buscar actas:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron obtener los datos.",
      });
    }
  };

  // Abrir el popup
  const openPopup = () => {
    setModalVisible(true); // Abre el popup
  };

  // Handle pagination
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const formatDateForDisplay = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
  };
  return (
    <div className="sistema-integrado-qmagic">
      <Toast ref={toast} />
      {/* {actaDialog} */}
      <div className="h-50 bg-gray-500 pb-4">
        {" "}
        {/* Fondo gris claro para toda la pantalla */}
        {/* Panel del título */}
        <div className="bg-gray-500 text-white p-3 w-full">
          <h5>Creación de Acta Entrega</h5>
        </div>
        {/* Contenido principal */}
        <div className="p-2">
          {" "}
          {/* Espaciado alrededor del contenido */}
          {/* Search Section */}
          <Card className="m-3 mt-0">
            <h5>Búsqueda de Acta Entrega</h5>
            <p className="text-sm text-gray-600">
              En el siguiente formulario puede buscar un registro
              correspondiente a los parámetros ingresados.
            </p>

            <div className="flex flex-nowrap gap-4 align-items-end">
              <div className="w-20rem">
                <span className="block font-bold text-sm mb-1">
                  CORRELATIVO
                </span>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    <Checkbox checked={true} />
                  </span>
                  <InputText
                    value={correlativo}
                    onChange={(e) => setCorrelativo(e.target.value)}
                    className="p-inputtext-sm"
                  />
                </div>
              </div>

              <div className="w-20rem">
                <span className="block font-bold text-sm mb-1">FECHA</span>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    <Checkbox checked={true} />
                  </span>
                  <Calendar
                    value={fecha}
                    onChange={(e) => setFecha(e.value)}
                    showIcon
                    className="p-inputtext-sm"
                  />
                </div>
              </div>

              <div className="w-20rem">
                <span className="block font-bold text-sm mb-1">ESTADO</span>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    <Checkbox checked={true} />
                  </span>
                  <InputText
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="p-inputtext-sm"
                  />
                </div>
              </div>

              <div className="w-20rem">
                <Button
                  label="BUSCAR DATOS DE ACTA ENTREGA"
                  icon="pi pi-search"
                  className="p-button-rounded p-button-info p-button-sm w-full"
                  onClick={searchActa}
                />
              </div>
            </div>
          </Card>
          {/* DataTable */}
          <Card className="m-3 mt-3">
            {" "}
            {/* Añadido margen superior (mt-5) */}
            <div className="mt-2 mb-4 flex align-items-center text-sm">
              <div className="mr-2">Mostrar</div>
              <Dropdown
                value={rows}
                options={[5, 10, 20, 50]}
                onChange={(e) => setRows(e.value)}
                className="w-6rem mr-2 text-sm p-dropdown-sm"
              />
              <div>registros</div>
              <div className="ml-auto flex align-items-center">
                <span className="mr-2">Buscar:</span>
                <InputText className="w-10rem text-sm p-inputtext-sm" />
              </div>
            </div>
            {/* DataTable */}
            <DataTable
            ref={dt} 
              value={actas}
              responsiveLayout="scroll"
              className="p-datatable-sm text-xs"
              showGridlines
              onSelectionChange={e => setSeleccion(e.value)}
            >
              <Column
                field="ae_actaid"
                header="ACTA ID"
                className="text-xs py-1 px-2"
              />
              <Column
                field="ae_correlativo"
                header="CORRELATIVO"
                className="text-xs py-1 px-2"
              />
              <Column
                field="punto_recaud_id"
                header="PUNTO RECAUDACIÓN"
                className="text-xs py-1 px-2"
              />
              <Column
                field="ae_fecha"
                header="FECHA"
                body={(rowData) => formatDateForDisplay(rowData.ae_fecha)}
                className="text-xs py-1 px-2"
              />
              <Column
                field="ae_grupo"
                header="GRUPO"
                className="text-xs py-1 px-2"
              />
              <Column
                field="ae_operador1erturno"
                header="OPERADOR 1ER TURNO"
                className="text-xs py-1 px-2"
              />
              <Column
                field="ae_operador2doturno"
                header="OPERADOR 2DO TURNO"
                className="text-xs py-1 px-2"
              />
              <Column
                field="ae_observacion"
                header="OBSERVACIÓN"
                className="text-xs py-1 px-2"
              />
              <Column
                field="ae_recaudaciontotalbs"
                header="RECAUDACIÓN TOTAL BS"
                className="text-xs py-1 px-2"
                // body={(rowData) => rowData.recaudacion.toFixed(2)}
              />
              <Column
                field="ae_estado"
                header="ESTADO"
                className="text-xs py-1 px-2"
              />
              <Column
                body={actionTemplate}
                header=""
                className="text-xs py-1 px-2"
              />
            </DataTable>
            <div className="mt-2 flex justify-content-between align-items-center text-sm">
              <span>
                Mostrando registros del 1 al 6 de un total de {actas.length}{" "}
                registros.
              </span>
              <Paginator
                first={first}
                rows={rows}
                totalRecords={actas.length}
                onPageChange={onPageChange}
                template="PrevPageLink PageLinks NextPageLink"
                className="p-paginator-rounded text-sm"
              />
            </div>
          </Card>
          {/* Floating Action Button */}
          <div style={{ position: "fixed", bottom: "2rem", right: "2rem" }}>
            <Button
              icon="pi pi-plus"
              className="p-button-rounded p-button-info shadow-8"
              style={{ width: "3rem", height: "3rem", fontSize: "1.5rem" }} // Tamaño personalizado
              onClick={openPopup} // Abre el popup
            />
          </div>
          <div>
            {/* <button onClick={addNewActa}>Agregar Nueva Acta</button> */}

            {/* Renderizar el popup condicionalmente */}
            {modalVisible && (
              <ActaEntregaPopup
                visible={modalVisible}
                onHide={() => setModalVisible(false)} // Cierra el popup
                actaData={newActa} // Pasar los datos del acta si es necesario
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActaEntregaSystem;
