import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import useApi from "hooks/useApi";
import axios from "axios";
import LicensePopup from "./LicensePopup";

const LicenseValidation = () => {
  const api = useApi();
  //const [filters, setFilters] = useState({
  const [searchForm, setSearchForm] = useState({
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombre: "",
    carnetIdentidad: "",
    codigoFuncionario: "",
    papeleta: "",
  });
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [licenses, setLicenses] = useState([]); // La tabla inicia vacía
  const [loading, setLoading] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const toast = React.useRef(null);
  const [globalFilter, setGlobalFilter] = useState(""); // Estado para la búsqueda global
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 20, 50];

  // Manejar cambios en los filtros de búsqueda
  const handleFilterChange = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
  };

  // Buscar licencias en la API de Laravel
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/licencias/buscar",{
        params: searchForm,
    });
      console.log(response.data);
      // Transformar los datos para que sean planos
    const formattedData = response.data.map((item) => ({
        lj_id: item.lj_id,
        papeleta: item.lj_id, // Si `lj_id` es el número de papeleta
        codigo: item.lj_per_id, // ID del funcionario
        funcionario: `${item.persona.per_nombres} ${item.persona.per_ap_paterno} ${item.persona.per_ap_materno}`,
        ci: item.persona.per_num_doc,
        tipoLicencia: item.tipo_licencia.cat_descripcion,
        fechaLicencia: `${item.lj_fecha_inicial.split("T")[0]} - ${item.lj_fecha_final.split("T")[0]}`,
        horaLicencia: `${item.lj_hora_salida} - ${item.lj_hora_retorno}`,
        motivo: item.lj_motivo,
        lugar: item.lj_lugar,
        autorizadoPor: item.lj_per_id_autoriza,
        estado: item.lj_estado === "V" ? "VALIDADO" : "PENDIENTE",
      }));
      setLicenses(formattedData);

      toast.current.show({
        severity: "success",
        summary: "Búsqueda completada",
        detail: "Datos actualizados",
        life: 3000,
      });
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

  // Botón de la tabla para abrir el popup
  const openPopup = async (license) => {
    try {
      const urlBoleta = `http://localhost:8000/api/TblLicenciaJustificada/boleta/${license.papeleta}`;
      const urlPersona = `http://localhost:8000/api/TblLicenciaJustificada/persona/${license.codigo}`;

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
        item: personaData.item || "No especificado",
        fecha_alta: personaData.alta || "No especificado",
        fecha_baja: personaData.baja || "No especificado",
        ubi_admin: personaData.ubi_admin || "No especificado",
        ubi_prog: personaData.ubi_prog || "No especificado",
        lj_id: boletaData.lj_id || "No especificado",
        codigo: license.codigo,
        papeleta: license.papeleta || "No especificado",
        funcionario: `${boletaData.per_nombres || ""} ${
          boletaData.per_ap_paterno || ""
        } ${boletaData.per_ap_materno || ""}`.trim(),
        ci: boletaData.per_num_doc || "No especificado",
        tipoLicencia: boletaData.cat_descripcion || "No especificado",
        fechaLicencia: `${boletaData.lj_fecha_inicial || "No especificado"} - ${
          boletaData.lj_fecha_final || "No especificado"
        }`,
        horaLicencia: `${boletaData.lj_hora_salida || "No especificado"} - ${
          boletaData.lj_hora_retorno || "No especificado"
        }`,
        motivo: boletaData.lj_motivo || "No especificado",
        lugar: boletaData.lj_lugar || "No especificado",
        autorizadoPor: boletaData.lj_per_id_autoriza || "No especificado",
        estado: license.estado || "Pendiente",
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
 
  return (
    <div className="p-m-4">
      <Toast ref={toast} />

      {/* Card de Búsqueda de Personal */}
      <Card className="p-mb-3">
        <Panel header="Búsqueda de Personal">
          <p>
            En el siguiente formulario puede buscar un registro correspondiente
            a los parámetros ingresados.
          </p>
          <div className="grid formgrid p-fluid">
            {/* First row: Apellido Paterno, Apellido Materno, Nombres */}
            <div className="col-12 md:col-4 mb-4">
              <label className="block text-sm mb-1">APELLIDO PATERNO</label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText
                  name="apellidoPaterno"
                  value={searchForm.apellidoPaterno}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </span>
            </div>
            <div className="col-12 md:col-4 mb-4">
              <label className="block text-sm mb-1">APELLIDO MATERNO</label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText
                  name="apellidoMaterno"
                  value={searchForm.apellidoMaterno}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </span>
            </div>
            <div className="col-12 md:col-4 mb-4">
              <label className="block text-sm mb-1">NOMBRE(S)</label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText
                  name="nombre"
                  value={searchForm.nombre}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </span>
            </div>

            {/* Second row: Carnet de Identidad, Código de Funcionario, Buscar button */}
            <div className="col-12 md:col-4 mb-4">
              <label className="block text-sm mb-1">CARNET DE IDENTIDAD</label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText
                  name="carnetIdentidad"
                  value={searchForm.carnetIdentidad}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </span>
            </div>
            <div className="col-12 md:col-4 mb-4">
              <label className="block text-sm mb-1">
                CÓDIGO DE FUNCIONARIO
              </label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText
                  name="codigoFuncionario"
                  value={searchForm.codigoFuncionario}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </span>
            </div>
            <div className="col-12 md:col-4 mb-4">
              <label className="block text-sm mb-1">NÚMERO DE PAPELETA</label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText
                  name="papeleta"
                  value={searchForm.papeleta}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </span>
            </div>
            <div className="col-12 md:col-12 mb-4 flex align-items-end justify-content-end">
              <Button
                label="BUSCAR"
                icon="pi pi-search"
                className="p-button-info w-full md:w-auto"
                onClick={handleSearch}
              />
            </div>
          </div>
        </Panel>
      </Card>

      {/* Card de Lista de Licencias */}
      <Card className="p-mt-3">
        <Panel header="Lista de Licencias Justificadas">
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
            <div className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                placeholder="Buscar..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          </div>
          <DataTable
            value={licenses}
            paginator
            rows={rowsPerPage} // Usa el estado de filas por página
            emptyMessage="No hay licencias disponibles."
            globalFilter={globalFilter} // Activa la búsqueda en todas las columnas
            //header={header} // Se agrega el header personalizado
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
                  onClick={() => openPopup(rowData)}
                />
              )}
            />
          </DataTable>
        </Panel>
      </Card>
      {/* Popup de Validación */}
      {selectedLicense && (
        <LicensePopup
          visible={modalVisible}
          onHide={() => setModalVisible(false)}
          licenseData={selectedLicense}
          onValidate={handleValidate}
        />
      )}
    </div>
  );
};

export default LicenseValidation;
