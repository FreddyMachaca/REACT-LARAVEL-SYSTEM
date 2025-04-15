import React,{ useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useNavigate } from 'react-router-dom';
import { SpeedDial } from 'primereact/speeddial';
import axios from 'axios';

function TblPersonaList() {
    const navigate = useNavigate();
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

    const onCustomPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }

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

    const handleFind = () => {
        const fetchFindPerson = async () => {
          try {
              const params = {
                search: formData.per_nombres || formData.per_ap_materno || formData.per_ap_paterno || "",
              };
  
              const { data: {records} } = await axios.get('/tblpersona/index', { params });
              setDataPeople(records);
            } catch (err) {
              console.error('Error:', err);
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
    
    const ActionButtons = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-warning p-button-sm"
                    onClick={() => handleClick(rowData.per_id, "aceptar")}
                />
                <Button
                    icon="pi pi-users"
                    className="blue-900 p-button-sm"
                    onClick={() => handleClick(rowData.per_id, "rechazar")}
                />
            </div>
        );
    }

    const handleClick = (id, action) => {
        console.log(``);
    };

    const handleDirect = () => {
        navigate(`/MovimientoPersonal/Persona/add`);
    }

    return (
    <>
        <div className="card">
        <h5>Búsqueda de Personal</h5>
        <div className="grid p-fluid mb-2">
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
            <Button label="Buscar" className="col-12 md:col-3" onClick={handleFind} />
        </div>

        </div>
        { dataPeople && (
        <DataTable
            value={dataPeople}
            paginator
            first={first} rows={10} onPage={onCustomPage}
            paginatorTemplate={template}
            paginatorClassName="justify-content-end"
            className="mt-6"
            responsiveLayout="scroll"
        >
            <Column field="per_id" header="CÓDIGO"></Column>
            <Column field="per_ap_paterno" header="APELLIDO PATERNO"></Column>
            <Column field="per_ap_materno" header="APELLIDO MATERNO"></Column>
            <Column field="per_nombres" header="NOMBRE(S)"></Column>
            <Column field="per_ap_casada" header="APELLIDO CASADA"></Column>
            <Column field="ci" header="C.I." ></Column>
            <Column body={ActionButtons} header="controles"></Column>
        </DataTable>
        ) }

        <SpeedDial onClick={handleDirect} direction="up" style={{ position: "fixed", bottom: "2rem", right: "2rem" }} showIcon="pi pi-plus" />
    </>
    );
}

export default TblPersonaList