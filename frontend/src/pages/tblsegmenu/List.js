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
import useApp from 'hooks/useApp';

import useListPage from 'hooks/useListPage';
const TblsegmenuListPage = (props) => {
		const app = useApp();
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
	const { records, pageReady, loading, selectedItems, sortBy, sortOrder, apiRequestError, setSelectedItems, getPageBreadCrumbs, onSort, deleteItem, pagination } = pageController;
	const { filters, setFilterValue } = filterController;
	const { totalRecords, totalPages, recordsPosition, firstRow, limit, onPageChange } =  pagination;
	function ActionButton(data){
		const items = [
		{
			label: "View",
			command: (event) => { app.navigate(`/tblsegmenu/view/${data.me_id}`) },
			icon: "pi pi-eye"
		},
		{
			label: "Edit",
			command: (event) => { app.navigate(`/tblsegmenu/edit/${data.me_id}`) },
			icon: "pi pi-pencil"
		},
		{
			label: "Delete",
			command: (event) => { deleteItem(data.me_id) },
			icon: "pi pi-trash"
		}
	]
		return (<SplitButton dropdownIcon="pi pi-bars" className="dropdown-only p-button-text p-button-plain" model={items} />);
	}
	function MeIdTemplate(data){
		if(data){
			return (
				<Link to={`/tblsegmenu/view/${data.me_id}`}> { data.me_id }</Link>
			);
		}
	}
	function PageLoading(){
		if(loading){
			return (
				<>
					<div className="flex align-items-center justify-content-center text-gray-500 p-3">
						<div><ProgressSpinner style={{width:'30px', height:'30px'}} /> </div>
						<div  className="font-bold text-lg">Cargando...</div>
					</div>
				</>
			);
		}
	}
	function EmptyRecordMessage(){
		if(pageReady && !records.length){
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
		if (pageReady && props.showFooter) {
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
			<PageRequestError error={apiRequestError} />
		);
	}
	return (
<main id="TblsegmenuListPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container-fluid">
            <div className="grid justify-content-between align-items-center">
                <div className="col " >
                    <Title title="Tbl Seg Menu"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
                </div>
                <div className="col-fixed " >
                    <Link to={`/tblsegmenu/add`}>
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
                                <DataTable 
                                    lazy={true} 
                                    loading={loading} 
                                    selectionMode="checkbox" selection={selectedItems} onSelectionChange={e => setSelectedItems(e.value)}
                                    value={records} 
                                    dataKey="me_id" 
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
                                    <Column  field="me_id" header="Me Id" body={MeIdTemplate}  ></Column>
                                    <Column  field="me_descripcion" header="Me Descripcion"   ></Column>
                                    <Column  field="me_url" header="Me Url"   ></Column>
                                    <Column  field="me_icono" header="Me Icono"   ></Column>
                                    <Column  field="me_id_padre" header="Me Id Padre"   ></Column>
                                    <Column  field="me_vista" header="Me Vista"   ></Column>
                                    <Column  field="me_orden" header="Me Orden"   ></Column>
                                    <Column  field="me_estado" header="Me Estado"   ></Column>
                                    <Column  field="me_usuario_creacion" header="Me Usuario Creacion"   ></Column>
                                    <Column  field="me_fecha_creacion" header="Me Fecha Creacion"   ></Column>
                                    <Column headerStyle={{width: '2rem'}} headerClass="text-center" body={ActionButton}></Column>
                                    {/*PageComponentEnd*/}
                                </DataTable>
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
TblsegmenuListPage.defaultProps = {
	primaryKey: 'me_id',
	pageName: 'tblsegmenu',
	apiPath: 'tblsegmenu/index',
	routeName: 'tblsegmenulist',
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
export default TblsegmenuListPage;
