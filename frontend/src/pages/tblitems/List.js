import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterTags } from 'components/FilterTags';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { PageRequestError } from 'components/PageRequestError';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SplitButton } from 'primereact/splitbutton';
import { Title } from 'components/Title';
import TblItemsEditPage from './Edit';
import useApp from 'hooks/useApp';
import useListPage from 'hooks/useListPage';

const TblItemsListPage = (props) => {
    const app = useApp();
    const filterSchema = {
        search: {
            tagTitle: "Search",
            value: '',
            valueType: 'single',
            options: [],
        }
    };
    const IdTemplate = (data) => <Link to={`/tblitems/view/${data.id}`}>{data.id}</Link>;

    const pageController = useListPage(props, filterSchema);
    const filterController = pageController.filterController;

    const {
        records,
        pageReady,
        loading,
        selectedItems,
        sortBy,
        sortOrder,
        apiRequestError,
        setSelectedItems,
        getPageBreadCrumbs,
        onSort,
        deleteItem,
        pagination
    } = pageController;

    const { filters, setFilterValue } = filterController;
    const {
        totalRecords,
        totalPages,
        recordsPosition,
        firstRow,
        limit,
        onPageChange
    } = pagination;

    const tableColumns = [
        { field: 'codigo_item', header: 'Código Item' },
        { field: 'cargo', header: 'Cargo' },
        { field: 'haber_basico', header: 'Haber Básico' },
        { field: 'unidad_organizacional', header: 'Unidad Organizacional' },
        {
            field: 'action',
            header: 'Acciones',
            template: (rowData) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-success"
                            onClick={() => app.navigate(`/tblitems/edit/${rowData.id}`)}
                        />
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger"
                            onClick={() => handleDelete(rowData)}
                        />
                    </div>
                );
            }
        }
    ];

    const handleDelete = (rowData) => {
        deleteItem(rowData.id, 'tblitem/delete');
    };

    function ActionButton(data) {
        const items = [
            {
                label: "Ver",
                command: (event) => { app.navigate(`/tblitems/view/${data.id}`); },
                icon: "pi pi-eye"
            },
            {
                label: "Editar",
                command: (event) => { 
                    app.navigate(`/tblitems/edit/${data.id}`);
                },
                icon: "pi pi-pencil"
            },
            {
                label: "Eliminar",
                command: (event) => { deleteItem(data.id, 'tblitem/delete'); },
                icon: "pi pi-trash"
            }
        ];
        return (<SplitButton dropdownIcon="pi pi-bars" className="dropdown-only p-button-text p-button-plain" model={items} />);
    }

    function PageLoading() {
        if (loading) {
            return (
                <div className="flex align-items-center justify-content-center text-gray-500 p-3">
                    <div><ProgressSpinner style={{ width: '30px', height: '30px' }} /></div>
                    <div className="font-bold text-lg">Cargando...</div>
                </div>
            );
        }
    }

    function EmptyRecordMessage() {
        if (pageReady && !records.length) {
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
                        onClick={() => deleteItem(selectedItems, 'tblitem/delete')} // Fix: Use correct API path
                        icon="pi pi-trash"
                        className="p-button-danger"
                        title="Eliminar seleccionados"
                    />
                </div>
            );
        }
    }

    function PagerControl() {
        if (props.paginate && totalPages > 1) {
            const pagerReportTemplate = {
                layout: pagination.layout,
                CurrentPageReport: (options) => {
                    return (
                        <span className="text-sm text-gray-500 px-2">
                            Registros <b>{recordsPosition} de {options.totalRecords}</b>
                        </span>
                    );
                }
            };
            return (
                <div className="flex-grow-1">
                    <Paginator
                        first={firstRow}
                        rows={limit}
                        totalRecords={totalRecords}
                        onPageChange={onPageChange}
                        template={pagerReportTemplate}
                    />
                </div>
            );
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
        if (pageReady && props.showFooter) {
            return (
                <div className="flex flex-wrap">
                    <PageActionButtons />
                    <PagerControl />
                </div>
            );
        }
    }

    if (apiRequestError) {
        return <PageRequestError error={apiRequestError} />;
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
                                <Link to={`/tblitems/estructura-organizacional`}>
                                    <Button
                                        label="Estructura Organizacional"
                                        icon="pi pi-sitemap"
                                        type="button"
                                        className="p-button bg-primary"
                                    />
                                </Link>
                            </div>
                            <div className="col-12 md:col-3">
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-search" />
                                    <InputText
                                        placeholder="Buscar"
                                        className="w-full"
                                        value={filters.search.value}
                                        onChange={(e) => setFilterValue('search', e.target.value)}
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
                            <FilterTags filterController={filterController} />
                            <div className="page-records">
                                <DataTable
                                    lazy={true}
                                    loading={loading}
                                    selectionMode="checkbox"
                                    selection={selectedItems}
                                    onSelectionChange={(e) => setSelectedItems(e.value)}
                                    value={records}
                                    dataKey="id"
                                    sortField={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={onSort}
                                    className="p-datatable-sm"
                                    stripedRows={true}
                                    showGridlines={false}
                                    rowHover={true}
                                    responsiveLayout="stack"
                                    emptyMessage={<EmptyRecordMessage />}
                                    columns={tableColumns}
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '2rem' }}></Column>
                                    <Column field="id" header="ID" body={IdTemplate} sortable></Column>
                                    <Column field="codigo_item" header="Código Item" sortable></Column>
                                    <Column field="cargo" header="Cargo" sortable></Column>
                                    <Column field="haber_basico" header="Haber Básico" sortable></Column>
                                    <Column field="unidad_organizacional" header="Unidad Organizacional" sortable></Column>
                                    <Column field="fecha_creacion" header="Fecha Creación" sortable></Column>
                                    <Column
                                        headerStyle={{ width: '2rem' }}
                                        headerClass="text-center"
                                        body={ActionButton}
                                    ></Column>
                                </DataTable>
                            </div>
                            <PageFooter />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

TblItemsListPage.defaultProps = {
    primaryKey: 'id',
    pageName: 'tblitem',         
    apiPath: 'tblitem', 
    routeName: 'tblitemslist',
    msgBeforeDelete: "¿Seguro que quieres borrar este registro?",
    msgTitle: "Eliminar el registro",
    msgAfterDelete: "Registro eliminado con éxito",
    showHeader: true,
    showFooter: true,
    paginate: false, 
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
    columns: [
        { field: 'codigo_item', header: 'Código Item' },
        { field: 'cargo', header: 'Cargo' },
        { field: 'haber_basico', header: 'Haber Básico' },
        { field: 'unidad_organizacional', header: 'Unidad Organizacional' }
    ]
};

export default TblItemsListPage;