import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import { Card } from 'primereact/card';
import useApp from 'hooks/useApp';
import { useState, useEffect } from 'react';
import axios from 'axios';

const TblasignacionList = () => {
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

    const handleSearch = async (page = currentPage) => {
        try {
            setLoading(true);
            
            const response = await axios.get('/tblpersona', { 
                params: {
                    ...filters,
                    page: page + 1,
                    limit: pageSize
                }
            });
            
            if (response.data) {
                setPersonas(response.data.records);
                setTotalRecords(response.data.total_records);
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
        setCurrentPage(event.page);
        handleSearch(event.page);
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                {rowData.tiene_item ? (
                    <Button 
                        icon="pi pi-eye" 
                        className="p-button-rounded p-button-info p-button-text"
                        onClick={() => app.navigate(`/tblitems/view/${rowData.as_ca_id}`)}
                        tooltip="Ver Detalles del Item"
                    />
                ) : (
                    <Button 
                        icon="pi pi-user-edit" 
                        className="p-button-rounded p-button-text"
                        onClick={() => app.navigate(`/asignacionItems/asignar/${rowData.per_id}`)}
                        tooltip="Asignar Item"
                    />
                )}
            </div>
        );
    };

    const itemStatusTemplate = (rowData) => {
        return (
            <div className="flex align-items-center">
                {rowData.tiene_item ? (
                    <div className="cursor-pointer" 
                         onClick={() => app.navigate(`/tblitems/view/${rowData.as_ca_id}`)}
                         title="Click para ver detalles">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg flex align-items-center">
                            <i className="pi pi-check-circle mr-2"></i>
                            Tiene Item ({rowData.ca_ti_item}-{rowData.ca_num_item})
                            <i className="pi pi-external-link ml-2 text-xs"></i>
                        </span>
                    </div>
                ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg flex align-items-center">
                        <i className="pi pi-times-circle mr-2"></i>
                        Sin Item
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="card">
            <Title title="Asignación de Items" />
            
            <Card className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-4 mb-2">
                        <span className="p-float-label">
                            <InputText
                                id="nombres"
                                value={filters.nombres}
                                onChange={(e) => setFilters({...filters, nombres: e.target.value})}
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
                                onChange={(e) => setFilters({...filters, apellido_paterno: e.target.value})}
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
                                onChange={(e) => setFilters({...filters, apellido_materno: e.target.value})}
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
                                onChange={(e) => setFilters({...filters, num_doc: e.target.value})}
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
                                onChange={(e) => setFilters({...filters, codigo_funcionario: e.target.value})}
                                className="w-full"
                            />
                            <label htmlFor="codigo">Código de Funcionario</label>
                        </span>
                    </div>
                    <div className="col-12 md:col-6 lg:col-4 mb-2 flex align-items-end">
                        <Button 
                            label="Buscar" 
                            icon="pi pi-search" 
                            onClick={handleSearch}
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
                            "No se encontraron registros"
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
                rowsPerPageOptions={[10, 20, 30, 50]}
                onRowsPerPageChange={(e) => {
                    setPageSize(e.rows);
                    setCurrentPage(0);
                    handleSearch(0);
                }}
            >
                <Column field="per_nombres" header="Nombres" sortable />
                <Column field="per_ap_paterno" header="Apellido Paterno" sortable />
                <Column field="per_ap_materno" header="Apellido Materno" sortable />
                <Column field="per_ap_casada" header="Apellido Casada" sortable />
                <Column field="per_num_doc" header="CI" sortable />
                <Column header="Estado Item" body={itemStatusTemplate} />
                <Column body={actionTemplate} header="Acciones" style={{width: '100px'}} />
            </DataTable>
        </div>
    );
};

export default TblasignacionList;
