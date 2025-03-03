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
import { useEffect, useState } from 'react';
import axios from 'axios';

import useListPage from 'hooks/useListPage';
const TblitemsListPage = (props) => {
    const app = useApp();
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiRequestError, setApiRequestError] = useState(null);
    const [loadedRecords, setLoadedRecords] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    
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
    const { selectedItems, sortBy, sortOrder, setSelectedItems, getPageBreadCrumbs, onSort, deleteItem, pagination } = pageController;
    const { filters, setFilterValue } = filterController;
    const { totalRecords, totalPages, recordsPosition, firstRow, limit, onPageChange } =  pagination;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const cargoResponse = await axios.get('/tblmpcargo/index');
                const cargoRecords = cargoResponse.data.records || [];
                
                console.log('Cargo records loaded:', cargoRecords.length);
                console.log('Sample cargo record:', cargoRecords[0]);
                
                setTotalItems(cargoRecords.length);
                
                if (!cargoRecords.length) {
                    setLoading(false);
                    setCombinedData([]);
                    return;
                }
                
                console.log('Sample cargo IDs:', cargoRecords.slice(0, 5).map(c => c.ca_id));
                console.log('Sample escala IDs from cargo:', cargoRecords.slice(0, 5).map(c => c.ca_es_id));
                console.log('Sample estructura IDs from cargo:', cargoRecords.slice(0, 5).map(c => c.ca_eo_id));
                
                console.log('Fetching related data...');
                const [escalaResponse, nivelResponse, estructuraResponse] = await Promise.all([
                    axios.get('/tblmpescalasalarial/index'),
                    axios.get('/tblmpnivelsalarial/index'),
                    axios.get('/tblmpestructuraorganizacional/index')
                ]);
                
                const escalaRecords = escalaResponse.data.records || [];
                const nivelRecords = nivelResponse.data.records || [];
                const estructuraRecords = estructuraResponse.data.records || [];
                
                console.log('Escala records loaded:', escalaRecords.length);
                console.log('Nivel records loaded:', nivelRecords.length);
                console.log('Estructura records loaded:', estructuraRecords.length);
                
                if (escalaRecords.length > 0) {
                    console.log('Sample escala record:', escalaRecords[0]);
                    console.log('Sample nivel IDs from escalas:', escalaRecords.slice(0, 5).map(e => e.es_ns_id));
                }
                
                if (nivelRecords.length > 0) {
                    console.log('Sample nivel record:', nivelRecords[0]);
                }
                
                if (estructuraRecords.length > 0) {
                    console.log('Sample estructura record:', estructuraRecords[0]);
                }
                
                const escalaMap = {};
                const nivelMap = {};
                const estructuraMap = {};
                
                escalaRecords.forEach(escala => {
                    if (escala && escala.es_id) {
                        escalaMap[escala.es_id] = escala;
                    }
                });
                
                nivelRecords.forEach(nivel => {
                    if (nivel && nivel.ns_id) {
                        nivelMap[nivel.ns_id] = nivel;
                    }
                });
                
                estructuraRecords.forEach(estructura => {
                    if (estructura && estructura.eo_id) {
                        estructuraMap[estructura.eo_id] = estructura;
                    }
                });
                
                console.log('Data maps created successfully');
                console.log('Escala map size:', Object.keys(escalaMap).length);
                console.log('Nivel map size:', Object.keys(nivelMap).length);
                console.log('Estructura map size:', Object.keys(estructuraMap).length);
                
                console.log('Processing cargo records with lookup data...');
                const processedData = [];
                let missingEscala = 0;
                let missingNivel = 0;
                let missingEstructura = 0;
                
                for (const cargo of cargoRecords) {
                    let item = {
                        id: cargo.ca_id,
                        codigo: `${cargo.ca_ti_item || ''}-${cargo.ca_eo_id || ''}`,
                        cargo: '',
                        haber_basico: '',
                        unidad_organizacional: '',
                        fecha_creacion: cargo.ca_fecha_creacion || ''
                    };
                    
                    if (cargo.ca_es_id && escalaMap[cargo.ca_es_id]) {
                        const escala = escalaMap[cargo.ca_es_id];
                        item.cargo = escala.es_descripcion || '';
                        
                        if (escala.es_ns_id && nivelMap[escala.es_ns_id]) {
                            const nivel = nivelMap[escala.es_ns_id];
                            item.haber_basico = nivel.ns_haber_basico || '';
                        } else {
                            missingNivel++;
                        }
                    } else {
                        missingEscala++;
                    }
                    
                    if (cargo.ca_eo_id && estructuraMap[cargo.ca_eo_id]) {
                        const estructura = estructuraMap[cargo.ca_eo_id];
                        item.unidad_organizacional = estructura.eo_descripcion || '';
                    } else {
                        missingEstructura++;
                    }
                    
                    processedData.push(item);
                }
                
                console.log('Processing complete. Records processed:', processedData.length);
                console.log('Records with missing escala:', missingEscala);
                console.log('Records with missing nivel:', missingNivel);
                console.log('Records with missing estructura:', missingEstructura);
                
                console.log('Sample processed records:', processedData.slice(0, 3));
                
                setLoadedRecords(processedData.length);
                setCombinedData(processedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setApiRequestError(error.message || "Error al cargar los datos");
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const searchFilteredData = filters.search?.value 
        ? combinedData.filter(item => {
            const searchTerm = filters.search.value.toLowerCase();
            return (
                (item.codigo && item.codigo.toLowerCase().includes(searchTerm)) ||
                (item.cargo && item.cargo.toLowerCase().includes(searchTerm)) ||
                (item.unidad_organizacional && item.unidad_organizacional.toLowerCase().includes(searchTerm))
            );
        })
        : combinedData;

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
            command: (event) => { deleteItem(data.id) },
            icon: "pi pi-trash"
        }
    ]
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
        if(!loading && !combinedData.length){
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
                    <Button onClick={() => deleteItem(selectedItems)} icon="pi pi-trash" className="p-button-danger" title="Eliminar seleccionado"/>
                </div>
            )
        }
    }

    function PagerControl() {
        if (props.paginate && totalPages > 1) {
        const pagerReportTemplate = {
            layout: pagination.layout,
            CurrentPageReport: (options) => {
                return (
                    <>
                        <span className="text-sm text-gray-500 px-2">Archivos <b>{ recordsPosition } de { options.totalRecords }</b></span>
                    </>
                );
            }
        }
        return (
            <div className="flex-grow-1">
                <Paginator first={firstRow} rows={limit} totalRecords={totalRecords}  onPageChange={onPageChange} template={pagerReportTemplate} />
            </div>
        )
        }
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
                                        <div className="font-bold text-lg">Cargando datos...</div>
                                    </div>
                                ) : (
                                <>
                                    {!loading && loadedRecords > 0 && (
                                        <div className="text-sm text-gray-500 mb-2">
                                            Mostrando {loadedRecords} registros
                                        </div>
                                    )}
                                    <DataTable 
                                        value={searchFilteredData} 
                                        lazy={false} 
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
                                        <Column selectionMode="multiple" headerStyle={{width: '2rem'}}></Column>
                                        <Column field="codigo" header="Código" body={CodigoTemplate} sortable></Column>
                                        <Column field="cargo" header="Cargo" sortable></Column>
                                        <Column field="haber_basico" header="Haber Básico" sortable></Column>
                                        <Column field="unidad_organizacional" header="Unidad Organizacional" sortable></Column>
                                        <Column field="fecha_creacion" header="Fecha Creación" body={FechaTemplate} sortable></Column>
                                        <Column headerStyle={{width: '2rem'}} headerClass="text-center" body={ActionButton}></Column>
                                    </DataTable>
                                </>
                                )}
                            </div>
                            <PageFooter />
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
    limit: 10,
}

export default TblitemsListPage;
