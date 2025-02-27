import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SplitButton } from 'primereact/splitbutton';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import useApi from 'hooks/useApi';

const TblItemsList = (props) => {
    const app = useApp();
    const api = useApi();
    const navigate = useNavigate();
    
    // Estados
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    
    // Cargar datos al montar el componente
    useEffect(() => {
        fetchRecords();
    }, []);
    
    const fetchRecords = async () => {
        try {
            setLoading(true);
            const response = await api.get('tblitem');
            console.log("API Response:", response);
            
            let dataRecords = [];
            if (Array.isArray(response)) {
                dataRecords = response;
            } else if (response && Array.isArray(response.data)) {
                dataRecords = response.data;
            } else if (response && Array.isArray(response.records)) {
                dataRecords = response.records;
            }
            
            setRecords(dataRecords);
            setError(null);
        } catch (error) {
            console.error("Error fetching records:", error);
            setError(error.message || "Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };
    
    // Función para buscar
    const handleSearch = () => {
        fetchRecords();
    };
    
    // Función para eliminar registro
    const deleteRecord = async (recordId) => {
        try {
            await app.confirmDelete(async () => {
                setLoading(true);
                await api.delete(`tblitem/delete/${recordId}`);
                app.flashMsg("Éxito", "Registro eliminado correctamente", "success");
                fetchRecords();
            });
        } catch (error) {
            console.error("Error deleting record:", error);
            app.flashMsg("Error", "No se pudo eliminar el registro", "error");
        }
    };
    
    // Renderizar acciones por fila
    const actionButtonTemplate = (rowData) => {
        const items = [
            {
                label: "Ver",
                command: (event) => { navigate(`/tblitems/view/${rowData.id}`) },
                icon: "pi pi-eye"
            },
            {
                label: "Editar",
                command: (event) => { navigate(`/tblitems/edit/${rowData.id}`) },
                icon: "pi pi-pencil"
            },
            {
                label: "Eliminar",
                command: (event) => { deleteRecord(rowData.id) },
                icon: "pi pi-trash"
            }
        ];
        
        return (
            <SplitButton dropdownIcon="pi pi-bars" className="dropdown-only p-button-text p-button-plain" model={items} />
        );
    };
    
    // Template para el ID con enlace
    function IdTemplate(data) {
        return (
            <Link to={`/tblitems/view/${data.id}`}>{data.id}</Link>
        );
    }
    
    // Formatear el valor monetario
    const currencyTemplate = (rowData) => {
        return `Bs. ${parseFloat(rowData.haber_basico).toFixed(2)}`;
    };
    
    function PageLoading() {
        if (loading) {
            return (
                <div className="flex align-items-center justify-content-center text-gray-500 p-3">
                    <div><ProgressSpinner style={{width:'30px', height:'30px'}} /></div>
                    <div className="font-bold text-lg">Cargando...</div>
                </div>
            );
        }
    }
    
    function EmptyRecordMessage() {
        if (!loading && records.length === 0) {
            return (
                <div className="text-lg mt-3 p-3 text-center text-400 font-bold">
                    No se encontraron registros
                </div>
            );
        }
    }
    
    function MultiDelete() {
        if (selectedItems.length) {
            return (
                <div className="m-2 flex-grow-0">
                    <Button 
                        onClick={() => {
                            app.confirmDelete(() => {
                                Promise.all(selectedItems.map(item => api.delete(`tblitem/delete/${item.id}`)))
                                    .then(() => {
                                        app.flashMsg("Éxito", "Registros eliminados correctamente", "success");
                                        fetchRecords();
                                        setSelectedItems([]);
                                    })
                                    .catch(error => {
                                        console.error("Error eliminando registros:", error);
                                        app.flashMsg("Error", "No se pudieron eliminar algunos registros", "error");
                                    });
                            });
                        }} 
                        icon="pi pi-trash" 
                        className="p-button-danger" 
                        title="Eliminar seleccionado"
                    />
                </div>
            );
        }
    }
    
    // Si hay un error, mostrar mensaje
    if (error) {
        return (
            <div className="card p-5 text-center">
                <i className="pi pi-exclamation-triangle text-5xl text-yellow-500 mb-3"></i>
                <h3>Error al cargar los datos</h3>
                <p className="text-600">{error}</p>
                <Button 
                    label="Reintentar" 
                    icon="pi pi-refresh" 
                    className="mt-3"
                    onClick={fetchRecords}
                />
            </div>
        );
    }
    
    return (
        <main id="TblItemsListPage" className="main-page">
            {props.showHeader && (
                <section className="page-section mb-3">
                    <div className="container-fluid">
                        <div className="grid justify-content-between align-items-center">
                            <div className="col">
                                <Title 
                                    title="Items" 
                                    titleClass="text-2xl text-primary font-bold" 
                                    subTitleClass="text-500"
                                    separator={false}
                                />
                            </div>
                            <div className="col-fixed">
                                <Link to="/tblitems/estructura-organizacional">
                                    <Button 
                                        label="Estructura Organizacional" 
                                        icon="pi pi-sitemap"
                                        type="button" 
                                        className="p-button w-full bg-primary"
                                    />
                                </Link>
                            </div>
                            <div className="col-12 md:col-3">
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-search" />
                                    <InputText 
                                        placeholder="Buscar" 
                                        className="w-full" 
                                        value={searchText} 
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        }}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            
            <section className="page-section">
                <div className="container-fluid">
                    <div className="grid">
                        <div className="col comp-grid">
                            <div>
                                <div className="page-records">
                                    <DataTable 
                                        lazy={true}
                                        loading={loading}
                                        selectionMode="checkbox"
                                        selection={selectedItems}
                                        onSelectionChange={(e) => setSelectedItems(e.value)}
                                        value={records}
                                        dataKey="id"
                                        className="p-datatable-sm"
                                        stripedRows={true}
                                        showGridlines={false}
                                        rowHover={true}
                                        responsiveLayout="stack"
                                        emptyMessage={<EmptyRecordMessage />}
                                    >
                                        <Column selectionMode="multiple" headerStyle={{width: '2rem'}}></Column>
                                        <Column field="id" header="ID" body={IdTemplate}></Column>
                                        <Column field="codigo_item" header="Código Item" sortable></Column>
                                        <Column field="cargo" header="Cargo" sortable></Column>
                                        <Column field="haber_basico" header="Haber Básico" body={currencyTemplate} sortable></Column>
                                        <Column field="unidad_organizacional" header="Unidad Organizacional" sortable></Column>
                                        <Column field="tiempo_jornada" header="Tiempo Jornada" sortable></Column>
                                        <Column field="cantidad" header="Cantidad" sortable></Column>
                                        <Column headerStyle={{width: '2rem'}} headerClass="text-center" body={actionButtonTemplate}></Column>
                                    </DataTable>
                                </div>
                                <div className="flex flex-wrap">
                                    <MultiDelete />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

TblItemsList.defaultProps = {
    showHeader: true,
    showFooter: true,
    paginate: false,
    isSubPage: false,
    showBreadcrumbs: true
};

export default TblItemsList;