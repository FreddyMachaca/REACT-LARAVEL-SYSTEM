import "@fortawesome/fontawesome-free/css/all.min.css";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FilterTags } from "components/FilterTags";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import { PageRequestError } from "components/PageRequestError";
import { Paginator } from "primereact/paginator";
import { ProgressSpinner } from "primereact/progressspinner";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { TreeTable } from "primereact/treetable";
import { Title } from "components/Title";
import { useState, useEffect } from "react";
import useApp from "hooks/useApp";
import useApi from "hooks/useApi";
import useListPage from "hooks/useListPage";

let jsonData = {};
let colors = ["blue", "green", "yellow"];

const transformToTreeNodes = (obj, parentKey = "") => {
  return Object.entries(obj).map(([key, value], index) => {
    const nodeKey = parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`;
    const [id, text, icon, checked] = key.split("|");
    const position = nodeKey.split("-").length - 1;

	  const isChecked = checked === '1' ? true : false;

    if (typeof value === "object" && value !== null) {
      return {
        key: id,
        data: { name: text, icon: icon, color: colors[position], checked: isChecked },
        children: transformToTreeNodes(value, id),
      };
    }

    return {
      key: id,
      data: { name: text, icon: icon, color: colors[position], checked: isChecked },
    };
  });
};

const TblsegrolListPage = (props) => {
  const app = useApp();
  const api = useApi();

  const filterSchema = {
    search: {
      tagTitle: "Search",
      value: "",
      valueType: "single",
      options: [],
    },
  };
  const [rolSelected, setRolSelected] = useState(null);
  const [dialogRol, setDialogRol] = useState(false);
  const [nodes, setNodes] = useState(transformToTreeNodes(jsonData));
  const [selection, setSelection] = useState({});

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
    pagination,
  } = pageController;
  const { filters, setFilterValue } = filterController;
  const {
    totalRecords,
    totalPages,
    recordsPosition,
    firstRow,
    limit,
    onPageChange,
  } = pagination;

  useEffect(() => {
    if (!rolSelected) return;
    api.get(`tblsegmenu/rol/${rolSelected.rol_id}`).then((response) => {
      jsonData = response.data;
      console.log(jsonData);
      const nodes = transformToTreeNodes(jsonData);
    
      const initialSelection = {};
      const buildSelectionKeys = (nodes) => {
        nodes.forEach((node) => {
          if(node.data.checked){
            initialSelection[node.key] = { checked: true };
          }
          if(node.children){
            buildSelectionKeys(node.children);
          }
        });
      };
      buildSelectionKeys(nodes);
    
      setNodes(nodes);
      setSelection(initialSelection);
    });

  }, [rolSelected]);

  const onSelectionChange = (e) => {
    const selectedKeys = Object.keys(e.value).filter(
      (key) => e.value[key].checked === true
    );
    setSelection(e.value);
    // TODO actualizar en la BD
    console.log(selectedKeys);
  };

  function ActionButton(data) {
    const items = [
      {
        label: "View",
        command: (event) => {
          app.navigate(`/tblsegrol/view/${data.rol_id}`);
        },
        icon: "pi pi-eye",
      },
      {
        label: "Edit",
        command: (event) => {
          app.navigate(`/tblsegrol/edit/${data.rol_id}`);
        },
        icon: "pi pi-pencil",
      },
      {
        label: "Delete",
        command: (event) => {
          deleteItem(data.rol_id);
        },
        icon: "pi pi-trash",
      },
      {
        label: "Permissions",
        command: () => {
          setRolSelected(data);
          setDialogRol(!dialogRol);
        },
        icon: "pi pi-lock",
      },
    ];
    return (
      <SplitButton
        dropdownIcon="pi pi-bars"
        className="dropdown-only p-button-text p-button-plain"
        model={items}
      />
    );
  }

  function RolIdTemplate(data) {
    if (data) {
      return <Link to={`/tblsegrol/view/${data.rol_id}`}> {data.rol_id}</Link>;
    }
  }
  function PageLoading() {
    if (loading) {
      return (
        <>
          <div className="flex align-items-center justify-content-center text-gray-500 p-3">
            <div>
              <ProgressSpinner style={{ width: "30px", height: "30px" }} />{" "}
            </div>
            <div className="font-bold text-lg">Cargando...</div>
          </div>
        </>
      );
    }
  }
  function EmptyRecordMessage() {
    if (pageReady && !records.length) {
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
            onClick={() => deleteItem(selectedItems)}
            icon="pi pi-trash"
            className="p-button-danger"
            title="Eliminar seleccionado"
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
            <>
              <span className="text-sm text-gray-500 px-2">
                Archivos{" "}
                <b>
                  {recordsPosition} de {options.totalRecords}
                </b>
              </span>
            </>
          );
        },
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
  function PageBreadcrumbs() {
    if (props.showBreadcrumbs) {
      const items = getPageBreadCrumbs();
      return items.length > 0 && <BreadCrumb className="mb-3" model={items} />;
    }
  }
  if (apiRequestError) {
    return <PageRequestError error={apiRequestError} />;
  }
  return (
    <>
      <main id="TblsegrolListPage" className="main-page">
        {props.showHeader && (
          <section className="page-section mb-3">
            <div className="container-fluid">
              <div className="grid justify-content-between align-items-center">
                <div className="col ">
                  <Title
                    title="Tbl Seg Rol"
                    titleClass="text-2xl text-primary font-bold"
                    subTitleClass="text-500"
                    separator={false}
                  />
                </div>
                <div className="col-fixed ">
                  <Link to={`/tblsegrol/add`}>
                    <Button
                      label="Agregar nuevo"
                      icon="pi pi-plus"
                      type="button"
                      className="p-button w-full bg-primary "
                    />
                  </Link>
                </div>
                <div className="col-12 md:col-3 ">
                  <span className="p-input-icon-left w-full">
                    <i className="pi pi-search" />
                    <InputText
                      placeholder="Buscar"
                      className="w-full"
                      value={filters.search.value}
                      onChange={(e) => setFilterValue("search", e.target.value)}
                    />
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
        <section className="page-section ">
          <div className="container-fluid">
            <div className="grid ">
              <div className="col comp-grid">
                <FilterTags filterController={filterController} />
                <div>
                  <PageBreadcrumbs />
                  <div className="page-records">
                    <DataTable
                      lazy={true}
                      loading={loading}
                      selectionMode="checkbox"
                      selection={selectedItems}
                      onSelectionChange={(e) => setSelectedItems(e.value)}
                      value={records}
                      dataKey="rol_id"
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
                      <Column
                        selectionMode="multiple"
                        headerStyle={{ width: "2rem" }}
                      ></Column>
                      <Column
                        field="rol_id"
                        header="Rol Id"
                        body={RolIdTemplate}
                      ></Column>
                      <Column
                        field="rol_descripcion"
                        header="Rol Descripcion"
                      ></Column>
                      <Column field="rol_estado" header="Rol Estado"></Column>
                      <Column
                        field="rol_fecha_creacion"
                        header="Rol Fecha Creacion"
                      ></Column>
                      <Column
                        field="rol_usuario_creacion"
                        header="Rol Usuario Creacion"
                      ></Column>
                      <Column
                        headerStyle={{ width: "2rem" }}
                        headerClass="text-center"
                        body={ActionButton}
                      ></Column>
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
      <Dialog
        header="Asignar Menú"
        visible={dialogRol}
        style={{ width: "50vw", height: "100vm" }}
        onHide={() => setDialogRol(!dialogRol)}
      >
        <div>
          <TreeTable
            value={nodes}
            selectionMode="checkbox"
            selectionKeys={selection}
            onSelectionChange={onSelectionChange}
          >
            <Column
              field="name"
              header={rolSelected ? rolSelected.rol_descripcion : null}
              body={(rowData) => (
                <>
                  <i
                    style={{ color: rowData.data.color }}
                    className={rowData.data.icon}
                  ></i>
                  &nbsp;<span>{rowData.data.name}</span>
                </>
              )}
              expander
            ></Column>
          </TreeTable>
        </div>
      </Dialog>
    </>
  );
};
TblsegrolListPage.defaultProps = {
  primaryKey: "rol_id",
  pageName: "tblsegrol",
  apiPath: "tblsegrol/index",
  routeName: "tblsegrollist",
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
  search: "",
  fieldName: null,
  fieldValue: null,
  sortField: "",
  sortDir: "",
  pageNo: 1,
  limit: 10,
};
export default TblsegrolListPage;
