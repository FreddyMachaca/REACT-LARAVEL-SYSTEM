import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import { Card } from 'primereact/card';
import useApp from 'hooks/useApp';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';

function tblCpAsignacionHorarioList() {
  const app = useApp();
  const [loading, setLoading] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [filters, setFilters] = useState({
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      num_doc: '',
      codigo_funcionario: ''
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const toast = useRef(null);

  const actionTemplate = (rowData) => {
      return (
          <div className="flex gap-2">
              <Button 
                  icon="pi pi-id-card" 
                  className="p-button-rounded p-button-success p-button-text"
                  onClick={() => app.navigate(`/tblcplicenciajustificada/add/${rowData.per_id}`)}
                  tooltip="Gestionar"
              />
              <Button 
                  icon="pi pi-clock" 
                  className="p-button-rounded p-button-primary p-button-text"
                  // onClick={() => app.navigate(`/gestionPersonal/configuracion/${rowData.per_id}`)}
                  tooltip="Gestionar"
              />
          </div>
      );
  };

  const handleSearch = async (page = 0) => {
      try {
          setLoading(true);
          setCurrentPage(page);
          
          const response = await axios.get('/tblpersona', { 
              params: {
                  ...filters,
                  page: page + 1,
                  limit: pageSize
              }
          });
          
          if (response.data) {
              setPersonas(response.data.records || []);
              setTotalRecords(response.data.total_records || 0);
          } else {
              setPersonas([]);
              setTotalRecords(0);
          }
          
          setLoading(false);
      } catch (error) {
          console.error('Error searching personas:', error);
          app.flashMsg('Error', 'Error al buscar personas: ' + error.message, 'error');
          setLoading(false);
          setPersonas([]);
          setTotalRecords(0);
      }
  };

  const onPageChange = (event) => {
      handleSearch(event.page);
  };

  useEffect(() => {
      handleSearch(0);
  }, []);

  const handleFilterChange = (field, value) => {
      setFilters(prev => ({...prev, [field]: value}));
  };

  const handleKeyDown = (e) => {
      if (e.key === "Enter") {
          handleSearch(0);
      }
  };

  return (
      <div className="card">
          <Toast ref={toast} />
          <Title title="Asignación de horario" />
          
          <Card className="mb-4">
              <div className="grid">
                  <div className="col-12 md:col-6 lg:col-4 mb-2">
                      <span className="p-float-label">
                          <InputText
                              id="nombres"
                              value={filters.nombres}
                              onChange={(e) => handleFilterChange('nombres', e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full"
                          />
                          <label htmlFor="nombres">Nombres</label>
                      </span>
                  </div>
                  <div className="col-12 md:col-6 lg:col-4 mb-2">
                      <span className="p-float-label">
                          <InputText
                              id="ap_paterno"
                              value={filters.apellido_paterno}
                              onChange={(e) => handleFilterChange('apellido_paterno', e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full"
                          />
                          <label htmlFor="ap_paterno">Apellido Paterno</label>
                      </span>
                  </div>
                  <div className="col-12 md:col-6 lg:col-4 mb-2">
                      <span className="p-float-label">
                          <InputText
                              id="ap_materno"
                              value={filters.apellido_materno}
                              onChange={(e) => handleFilterChange('apellido_materno', e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full"
                          />
                          <label htmlFor="ap_materno">Apellido Materno</label>
                      </span>
                  </div>
                  <div className="col-12 md:col-6 lg:col-4 mb-2">
                      <span className="p-float-label">
                          <InputText
                              id="ci"
                              value={filters.num_doc}
                              onChange={(e) => handleFilterChange('num_doc', e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full"
                          />
                          <label htmlFor="ci">Carnet de Identidad</label>
                      </span>
                  </div>
                  <div className="col-12 md:col-6 lg:col-4 mb-2">
                      <span className="p-float-label">
                          <InputText
                              id="codigo"
                              value={filters.codigo_funcionario}
                              onChange={(e) => handleFilterChange('codigo_funcionario', e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full"
                          />
                          <label htmlFor="codigo">Código de Funcionario</label>
                      </span>
                  </div>
                  <div className="col-12 md:col-6 lg:col-4 mb-2 flex align-items-end">
                      <Button 
                          label="Buscar" 
                          icon="pi pi-search" 
                          onClick={() => handleSearch(0)}
                          className="w-full"
                      />
                  </div>
              </div>
          </Card>

          <DataTable
              value={personas}
              loading={loading}
              emptyMessage={
                  <div className="p-4 text-center">
                      {loading ? (
                          <ProgressSpinner style={{width:'50px', height:'50px'}} />
                      ) : (
                          "No se encontraron registros válidos"
                      )}
                  </div>
              }
              className="p-datatable-sm"
              responsiveLayout="scroll"
              stripedRows
              lazy
              paginator
              rows={pageSize}
              totalRecords={totalRecords}
              first={currentPage * pageSize}
              onPage={onPageChange}
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
              rowsPerPageOptions={[10, 20, 30, 50, 100]}
              onRowsPerPageChange={(e) => {
                  setPageSize(e.rows);
                  setCurrentPage(0);
                  handleSearch(0);
              }}
          >
              <Column 
                  field="per_nombres" 
                  header="Nombres" 
                  sortable
                  body={(rowData) => (
                      <span className={!rowData.per_nombres ? 'text-500' : ''}>
                          {rowData.per_nombres || 'Sin nombre'}
                      </span>
                  )}
              />
              <Column 
                  field="per_ap_paterno" 
                  header="Apellido Paterno" 
                  sortable
                  body={(rowData) => (
                      <span className={!rowData.per_ap_paterno ? 'text-500' : ''}>
                          {rowData.per_ap_paterno || 'Sin apellido'}
                      </span>
                  )}
              />
              <Column 
                  field="per_ap_materno" 
                  header="Apellido Materno" 
                  sortable
                  body={(rowData) => (
                      <span className={!rowData.per_ap_materno ? 'text-500' : ''}>
                          {rowData.per_ap_materno || 'Sin apellido'}
                      </span>
                  )}
              />
              <Column 
                  field="per_num_doc" 
                  header="CI" 
                  sortable
                  body={(rowData) => (
                      <span className={!rowData.per_num_doc ? 'text-500' : ''}>
                          {rowData.per_num_doc || 'Sin CI'}
                      </span>
                  )}
              />
              <Column body={actionTemplate} header="Acciones" style={{width: '100px'}} />
          </DataTable>
      </div>
  );
}

export default tblCpAsignacionHorarioList