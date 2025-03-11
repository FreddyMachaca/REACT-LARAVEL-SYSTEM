import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterTags } from 'components/FilterTags';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SplitButton } from 'primereact/splitbutton';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ConfirmDialog } from 'primereact/confirmdialog';

import useListPage from 'hooks/useListPage';
const TblitemsListPage = (props) => {
    const app = useApp();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiRequestError, setApiRequestError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const filterSchema = {
        search: {
            tagTitle: "Search",
            value: '',
            valueType: 'single',
            options: [],
        }
    }
    
    const pageController = useListPage(props, filterSchema);
    const filterController = pageController.filterController;
    const { selectedItems, sortBy, sortOrder, setSelectedItems, getPageBreadCrumbs, onSort, deleteItem } = pageController;
    const { filters, setFilterValue } = filterController;
    
    const fetchPageData = useCallback(async (page = 1, size = 20, search = '') => {
        try {
            setLoading(true);
            
            const response = await axios.get(`/tblitems/index?page=${page}&limit=${size}&search=${search}`);
            const { records, total_records } = response.data;
            
            setItems(records);
            setTotalRecords(total_records);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setApiRequestError(error.message || "Error al cargar los datos");
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        const searchTerm = filters.search?.value || '';
        fetchPageData(currentPage, pageSize, searchTerm);
    }, [fetchPageData, currentPage, pageSize, filters.search?.value]);
    
    const handlePageChange = (event) => {
        const newPage = event.page + 1;
        setCurrentPage(newPage);
        fetchPageData(newPage, pageSize, filters.search?.value || '');
    };
    
    const handleRowsPerPageChange = (event) => {
        const newSize = event.rows;
        setPageSize(newSize);
        setCurrentPage(1);
        fetchPageData(1, newSize, filters.search?.value || '');
    };

    const searchFilteredData = filters.search?.value 
        ? items.filter(item => {
            const searchTerm = filters.search.value.toLowerCase();
            return (
                (item.codigo && item.codigo.toLowerCase().includes(searchTerm)) ||
                (item.cargo && item.cargo.toLowerCase().includes(searchTerm)) ||
                (item.haber_basico && item.haber_basico.toString().toLowerCase().includes(searchTerm)) ||
                (item.unidad_organizacional && item.unidad_organizacional.toLowerCase().includes(searchTerm)) ||
                (item.fecha_creacion && new Date(item.fecha_creacion).toLocaleString().toLowerCase().includes(searchTerm))
            );
        })
        : items;

    const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);
    const [itemsToDelete, setItemsToDelete] = useState(null);

    const confirmMultiDelete = (selectedIds) => {
        if (selectedIds && selectedIds.length) {
            setItemsToDelete(selectedIds);
            setDisplayConfirmDialog(true);
        }
    };
    
    const handleMultiDelete = async () => {
        try {
            const plainIds = Array.isArray(itemsToDelete) 
                ? itemsToDelete.map(item => typeof item === 'object' && item.id ? item.id : item)
                : [itemsToDelete];
                
            const idsString = plainIds.join(',');
            
            console.log("Deleting IDs:", idsString);
            
            await axios.delete(`/tblitems/delete/${idsString}`);
            
            app.flashMsg(props.msgTitle, props.msgAfterDelete);
            
            fetchPageData(currentPage, pageSize, filters.search?.value || '');
            
            setSelectedItems([]);
            setItemsToDelete(null);
        } catch (err) {
            console.error("Error deleting records:", err);
            app.flashMsg("Error", "No se pudieron eliminar los registros", "error");
        }
    };

    function ActionButton(data){
        const items = [
            {
                label: "View",
                command: (event) => { app.navigate(`/tblitems/view/${data.id}`) },
                icon: "pi pi-eye"
            },
            {
                label: "Edit",
                command: (event) => { app.navigate(`/tblitems/edit/${data.id}`) },
                icon: "pi pi-pencil"
            },
            {
                label: "Delete",
                command: (event) => { 
                    confirmMultiDelete([data.id]);
                },
                icon: "pi pi-trash"
            }
        ];
        return (<SplitButton dropdownIcon="pi pi-bars" className="dropdown-only p-button-text p-button-plain" model={items} />);
    }

    function CodigoTemplate(data){
        if(data){
            return (
                <Link to={`/tblitems/view/${data.id}`}> { data.codigo }</Link>
            );
        }
    }

    function FechaTemplate(data){
        if(data && data.fecha_creacion) {
            return new Date(data.fecha_creacion).toLocaleString();
        }
        return '';
    }

    function EmptyRecordMessage(){
        if(!loading && !items.length){
            return (
                <div className="text-lg mt-3 p-3 text-center text-400 font-bold">
                    ningún record fue encontrado
                </div>
            );
        }
    }

    function MultiDelete() {
        if (selectedItems.length) {
            return (
                <div className="m-2 flex-grow-0">
                    <Button 
                        onClick={() => confirmMultiDelete(selectedItems)} 
                        icon="pi pi-trash" 
                        className="p-button-danger" 
                        title="Eliminar seleccionado"
                    />
                </div>
            )
        }
    }

    function PagerControl() {
        return (
            <div className="flex-grow-1">
                <Paginator 
                    first={(currentPage - 1) * pageSize} 
                    rows={pageSize} 
                    totalRecords={totalRecords} 
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    onPageChange={handlePageChange}
                    rowsPerPage={pageSize}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                />
            </div>
        );
    }

    function PageActionButtons() {
        return (
            <div className="flex flex-wrap">
                <MultiDelete />
            </div>
        );
    }

    function PageFooter() {
        if (!loading && props.showFooter) {
            return (
                <div className="flex flex-wrap">
                    <PageActionButtons />
                    <PagerControl />
                </div>
            );
        }
    }

    function PageBreadcrumbs(){
        if(props.showBreadcrumbs) {
            const items = getPageBreadCrumbs();
            return (items.length > 0 && <BreadCrumb className="mb-3" model={items} />);
        }
    }

    if(apiRequestError){
        return (
            <div className="p-3 text-center">
                <div className="text-xl text-red-500 mb-3">Error de carga</div>
                <div>{apiRequestError.toString()}</div>
                <Button 
                    label="Intentar nuevamente" 
                    icon="pi pi-refresh" 
                    className="mt-3"
                    onClick={() => window.location.reload()} 
                />
            </div>
        );
    }

    return (
<main id="TblitemsListPage" className="main-page">
    <ConfirmDialog 
        visible={displayConfirmDialog} 
        onHide={() => setDisplayConfirmDialog(false)}
        message={props.msgBeforeDelete}
        header={props.msgTitle}
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={handleMultiDelete}
        reject={() => setDisplayConfirmDialog(false)}
        acceptLabel="Sí, eliminar"
        rejectLabel="No, cancelar"
    />
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container-fluid">
            <div className="grid justify-content-between align-items-center">
                <div className="col " >
                    <Title title="Items"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
                </div>
                <div className="col-fixed " >
                    <Link to={`/tblitems/add`}>
                        <Button label="Agregar nuevo" icon="pi pi-plus" type="button" className="p-button w-full bg-primary "  />
                        </Link>
                    </div>
                    <div className="col-12 md:col-3 " >
                        <span className="p-input-icon-left w-full">
                        <i className="pi pi-search" />
                        <InputText placeholder="Buscar" className="w-full" value={filters.search.value}  onChange={(e) => setFilterValue('search', e.target.value)} />
                        </span>
                    </div>
                </div>
            </div>
        </section>
        }
        <section className="page-section " >
            <div className="container-fluid">
                <div className="grid ">
                    <div className="col comp-grid" >
                        <FilterTags filterController={filterController} />
                        <div >
                            <PageBreadcrumbs />
                            <div className="page-records">
                                {loading ? (
                                    <div className="flex align-items-center justify-content-center text-gray-500 p-3">
                                        <div><ProgressSpinner style={{width:'30px', height:'30px'}} /> </div>
                                        <div className="font-bold text-lg">Cargando...</div>
                                    </div>
                                ) : (
                                <DataTable 
                                    value={searchFilteredData} 
                                    lazy={true} 
                                    loading={loading} 
                                    selectionMode="checkbox" 
                                    selection={selectedItems} 
                                    onSelectionChange={e => setSelectedItems(e.value)}
                                    dataKey="id" 
                                    sortField={sortBy} 
                                    sortOrder={sortOrder} 
                                    onSort={onSort}
                                    className=" p-datatable-sm" 
                                    stripedRows={true}
                                    showGridlines={false} 
                                    rowHover={true} 
                                    responsiveLayout="stack" 
                                    emptyMessage={<EmptyRecordMessage />} 
                                    >
                                    {/*PageComponentStart*/}
                                    <Column selectionMode="multiple" headerStyle={{width: '2rem'}}></Column>
                                    <Column field="codigo" header="Código" body={CodigoTemplate} sortable></Column>
                                    <Column field="cargo" header="Cargo" sortable></Column>
                                    <Column field="haber_basico" header="Haber Básico" sortable></Column>
                                    <Column field="unidad_organizacional" header="Unidad Organizacional" sortable></Column>
                                    <Column field="fecha_creacion" header="Fecha Creación" body={FechaTemplate} sortable></Column>
                                    <Column headerStyle={{width: '2rem'}} headerClass="text-center" body={ActionButton}></Column>
                                    {/*PageComponentEnd*/}
                                </DataTable>
                                )}
                            </div>
                            <div className="flex flex-wrap mt-3">
                                <PageActionButtons />
                                <PagerControl />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    );
}

TblitemsListPage.defaultProps = {
    primaryKey: 'ca_id',
    pageName: 'tblitems',
    apiPath: 'tblmpcargo/index',
    routeName: 'tblitemslist',
    msgBeforeDelete: "¿Seguro que quieres borrar este registro?",
    msgTitle: "Eliminar el registro",
    msgAfterDelete: "Grabar eliminado con éxito",
    showHeader: true,
    showFooter: true,
    paginate: true,
    isSubPage: false,
    showBreadcrumbs: true,
    exportData: false,
    importData: false,
    keepRecords: false,
    multiCheckbox: true,
    search: '',
    fieldName: null,
    fieldValue: null,
    sortField: '',
    sortDir: '',
    pageNo: 1,
    limit: 20,
}

export default TblitemsListPage;
