import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Panel } from "primereact/panel";
import { Link } from "react-router-dom";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const PersonalSearchSystem = () => {
  // State for search form
  const [searchForm, setSearchForm] = useState({
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombre: "",
    carnetIdentidad: "",
    codigoFuncionario: "",
  });

  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  // Sample data that will be shown when search is performed
  const mockData = [
    {
      codigo: 34,
      apellidoPaterno: "ASIN",
      apellidoMaterno: "SANDOVAL",
      nombre: "OSCAR GODOY",
      apellidoCasada: "",
      ci: "1754232",
      controles: "",
    },
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    setSearchResults(mockData);
    setShowResults(true);
  };

  // Action buttons template for the DataTable
  const actionBodyTemplate = (rowData) => {
    const idPer = rowData.codigo; // Usamos el campo "codigo" como ID_PER

    return (
      <div className="flex flex-row gap-1 justify-content-center">
        <Link to={`./edit/${idPer}`}>
          <Button
            icon="pi pi-id-card"
            className="p-button-info p-button-sm"
            tooltip="LICENCIA"
            tooltipOptions={{ position: "top" }}
          />
        </Link>
        <Link to={`./ubicacion/${idPer}`}>
          <Button
            icon="pi pi-map-marker"
            className="p-button-info p-button-sm"
            tooltip="UBICACIÓN"
            tooltipOptions={{ position: "top" }}
          />
        </Link>
        <Link to={`./add/${idPer}`}>
          <Button
            icon="pi pi-clock"
            className="p-button-info p-button-sm"
            tooltip="HORARIO"
            tooltipOptions={{ position: "top" }}
          />
        </Link>
      </div>
    );
  };

  // Rows per page options
  const rowsPerPageOptions = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-medium mb-4">
          Administración de Licencia Justificada
        </h2>
        {/* Search Form */}
        <Panel header="Búsqueda de Personal" className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
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
            <div className="col-12 md:col-4 mb-4 flex align-items-end justify-content-end">
              <Button
                label="BUSCAR"
                icon="pi pi-search"
                className="p-button-info w-full md:w-auto"
                onClick={handleSearch}
              />
            </div>
          </div>
        </Panel>

        {/* Results */}
        {showResults && (
          <Panel header="Lista de Personal" className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Lista con los resultados de la búsqueda
            </p>
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
              <div className="flex align-items-center">
              <span className="block mt-2 md:mt-0 p-input-icon-left">
                <InputText
                  type="search"
                  placeholder="Buscar..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <i className="pi pi-search" /> </span>
              </div>
            </div>
            <DataTable
              value={searchResults}
              paginator
              rows={rowsPerPage}
              globalFilter={globalFilter || ""}
              emptyMessage={
                searchResults.length === 0
                  ? "No hay registros (ver consola)"
                  : "No hay registros disponibles"
              }
              className="p-datatable-sm"
              stripedRows
            >
              <Column
                field="codigo"
                header="CÓDIGO"
                style={{ width: "70px" }}
              />
              <Column field="apellidoPaterno" header="APELLIDO PATERNO" />
              <Column field="apellidoMaterno" header="APELLIDO MATERNO" />
              <Column field="nombre" header="NOMBRE(S)" />
              <Column field="apellidoCasada" header="APELLIDO CASADA" />
              <Column field="ci" header="C.I." style={{ width: "100px" }} />
              <Column
                body={actionBodyTemplate}
                header="CONTROLES"
                style={{ width: "150px" }}
              />
            </DataTable>
            <div className="text-sm text-gray-600 mt-2">
              Mostrando registros del 1 al 1 de un total de 1 registros
            </div>
          </Panel>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-200 p-2 text-center text-gray-600 text-sm">
        <div>© 2020, Q-Magic Systems</div>
        <div>Transformando el futuro</div>
      </div>
    </div>
  );
};

export default PersonalSearchSystem;
