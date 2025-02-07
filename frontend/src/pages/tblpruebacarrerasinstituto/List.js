import { BreadCrumb } from 'primereact/breadcrumb';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterTags } from 'components/FilterTags';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';

import useListPage from 'hooks/useListPage';
const TblpruebacarrerasinstitutoListPage = (props) => {
	
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
	const { records, pageReady, loading, sortBy, sortOrder, apiRequestError, getPageBreadCrumbs, onSort, pagination } = pageController;
	const { filters, setFilterValue } = filterController;
	const { totalRecords, totalPages, recordsPosition, firstRow, limit, onPageChange } =  pagination;
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
<main id="TblpruebacarrerasinstitutoListPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container-fluid">
            <div className="grid justify-content-between align-items-center">
                <div className="col " >
                    <Title title="Tbl Prueba Carreras Instituto"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
                </div>
                <div className="col-fixed " >
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
                                value={records} 
                                dataKey="carrera_inst" 
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
                                <Column  field="carrera_inst" header="Carrera Inst"   ></Column>
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
TblpruebacarrerasinstitutoListPage.defaultProps = {
	primaryKey: '',
	pageName: 'tblpruebacarrerasinstituto',
	apiPath: 'tblpruebacarrerasinstituto/index',
	routeName: 'tblpruebacarrerasinstitutolist',
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
	multiCheckbox: false,
	search: '',
	fieldName: null,
	fieldValue: null,
	sortField: '',
	sortDir: '',
	pageNo: 1,
	limit: 10,
}
export default TblpruebacarrerasinstitutoListPage;
