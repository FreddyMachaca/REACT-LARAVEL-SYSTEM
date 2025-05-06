import React,{ useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';

function TblFuncionariosList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [dataPeople, setDataPeople] = useState();
    const [formData, setFormData] = useState(
        {
          per_ap_paterno: "",
          per_ap_materno: "",
          per_nombres: "",
          carnetIdentidad: "",
          per_id: ""
        }
      );

    const template = {
        layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
        'RowsPerPageDropdown': (options) => {
            const dropdownOptions = [
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 50, value: 50 }
            ];

            return (
                <React.Fragment>
                    <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Items per page: </span>
                    <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
                </React.Fragment>
            );
        },
        'CurrentPageReport': (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            )
        }
    };

    const ActionButtons = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => handleRedirect(rowData.per_id)}
                />
            </div>
        );
    }

    const handleRedirect = (per_id) => {
        navigate(`/Kardex/FiliacionFuncionario/${per_id}`);
    }

    const handleFind = () => {
        const fetchFindPerson = async () => {
          try {
              const params = {
                apellido_paterno: formData.per_ap_paterno || "",
                apellido_materno: formData.per_ap_materno || "",
                nombres: formData.per_nombres || "",
                num_doc: formData.carnetIdentidad || "",
              };
  
              const { data } = await axios.get('/tblpersona/index', { params });
              console.log(data)
              setDataPeople(data.records || []);
            } catch (err) {
              console.error('Error:', err);
              setDataPeople([]);
          }
        };
        fetchFindPerson();
    }

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value
    });
    };

    const safeDataPeople = Array.isArray(dataPeople) ? dataPeople : [];

  return (
    <>
    <div className="card">
        <h5>Búsqueda de Personal</h5>
        <div className="grid p-fluid mb-2 flex justify-content-start">
            <div className="col-12 md:col-4 mt-5">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-pencil"></i>
                    </span>
                    <span className="p-float-label">
                        <InputText id='per_ap_paterno' className="w-full" value={formData.per_ap_paterno} onChange={handleChange}/>
                    <label htmlFor='per_ap_paterno'>APELLIDO PATERNO</label>
                    </span>
                </div>
            </div>
            <div className="col-12 md:col-4 mt-5">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-pencil"></i>
                    </span>
                    <span className="p-float-label">
                        <InputText id='per_ap_materno' className="w-full"  value={formData.per_ap_materno} onChange={handleChange}/>
                    <label htmlFor='per_ap_materno'>APELLIDO MATERNO</label>
                    </span>
                </div>
            </div>
            <div className="col-12 md:col-4 mt-5">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-pencil"></i>
                    </span>
                    <span className="p-float-label">
                        <InputText id='per_nombres' className="w-full"/>
                    <label htmlFor='per_nombres' value={formData.per_nombres} onChange={handleChange}>NOMBRE(S)</label>
                    </span>
                </div>
            </div>
            <div className="col-12 md:col-4 mt-5">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-pencil"></i>
                    </span>
                    <span className="p-float-label">
                        <InputText id='per_id' className="w-full"/>
                    <label htmlFor='per_id' value={formData.per_id} onChange={handleChange}>CÓDIGO DE FUNCIONARIO</label>
                    </span>
                </div>
            </div>
        </div>

        <div className="flex justify-content-end">
            <Button label="Buscar" className="col-12 md:col-3" onClick={handleFind}/>
        </div>
      </div>
      {dataPeople && (
        <DataTable
          value={dataPeople}
          lazy
          paginator
          rows={10}
          first={first}
          totalRecords={dataPeople.length}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
          paginatorTemplate={template}
          paginatorClassName="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          className="mt-6"
          responsiveLayout="scroll"
          emptyMessage={
            <div className="p-4 text-center">
                {loading ? (
                    <ProgressSpinner style={{width:'50px', height:'50px'}} />
                ) : (
                    "No se encontraron registros válidos"
                )}
            </div>
        }
        >
          <Column field="per_id" header="CÓDIGO"></Column>
          <Column field="per_ap_paterno" header="APELLIDO PATERNO"></Column>
          <Column field="per_ap_materno" header="APELLIDO MATERNO"></Column>
          <Column field="per_nombres" header="NOMBRE(S)"></Column>
          <Column field="per_ap_casada" header="APELLIDO CASADA"></Column>
          <Column field="per_num_doc" header="C.I." ></Column>
          <Column field="per_estado" header="ESTADO" ></Column>
          <Column body={ActionButtons} header="ACCIONES"></Column>
        </DataTable>
      )}
    </>
  )
}

export default TblFuncionariosList