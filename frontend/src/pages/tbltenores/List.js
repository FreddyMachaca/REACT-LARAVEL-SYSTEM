import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { SpeedDial } from 'primereact/speeddial';
import PageLoading from '../../components/PageLoading'
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 

function TbltenoresList() {
    const navigate = useNavigate();
    const [tenores, setTenores] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters, setFilters] = useState(null);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fillTable();

      initFilters();
    }, [])

    const fillTable = () => {
        axios.get("tblmtenor/index")
        .then(({data:{records}}) => {
            const data = records.map(({te_id, te_descripcion, te_tipo_reg, te_fecha_creacion}) => ({
                te_id, 
                te_descripcion, 
                te_tipo_reg,
                te_fecha_creacion
            }))
            setTenores(data);
        })
        .catch(err => console.error(`Error al obtener los datos: ${err}`))
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </span>
            </div>
        )
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilter(value);
    }

    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'representative': { value: null, matchMode: FilterMatchMode.IN },
            'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'balance': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'activity': { value: null, matchMode: FilterMatchMode.BETWEEN },
            'verified': { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilter('');
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="mr-2 p-button-rounded p-button-text p-button-success" onClick={() => handleEdit(rowData) } />
                <Button icon="pi pi-trash"  className="p-button-rounded p-button-text p-button-danger" onClick={() => handleDelete(rowData) }/>
            </React.Fragment>
        );
    }
    
    const handleEdit = ({te_id}) => {
        navigate(`/MovimientoPersonal/Tenor/${te_id}`); 
    }

    const handleDelete = ({te_id}) => {
        confirmDialog({
            message: '¿Está seguro de proceder con la acción?',
            header: 'Anular registro',
            icon: 'pi pi-exclamation-triangle',
            accept: () => accept(te_id)
        });
    }

    const accept = (te_id) => {
        setLoading(true);

        axios.get(`tblmtenor/delete/${te_id}`)
        .then(response => {
            toast.current.show({ severity: 'info', summary: '', detail: 'Registro anulado con exito!', life: 3000 });
        })
        .catch(err => {
            toast.current.show({ severity: 'error', summary: '', detail: 'Error al anular registro!', life: 3000 });
        })
        .finally(() => {
            setTimeout(() => {
                fillTable();
                setLoading(false); 
            }, 2000);
        });
    }

    const handleDirect = () => {
        navigate(`/MovimientoPersonal/Tenor/`);
    }

    const header = renderHeader();
  return (
    <>
        {loading && (<div className="page-loading-overlay"><PageLoading /></div>)}
        <Toast ref={toast} />
        <div>
            <h2>
                Creación de Tenores
            </h2>
        </div>

        <div>
            <Card className='w-9 m-auto'>
                <section>
                    <div className="border-left-2 border-primary-500 surface-overlay p-2 flex justify-content-start">
                        <div>
                            <strong>Lista Tenor</strong>
                            <p>En la siguiente lista puede editar o crear nuevos tenores.</p>
                        </div>
                    </div>
                </section>
                
                <Divider/>

                <section>
                    <DataTable value={tenores} responsiveLayout="scroll" paginator rows={10} rowsPerPageOptions={[10, 30, 50, 100]} header={header} filters={filters}>
                        <Column field="te_id" header="CÓDIGO" bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="te_descripcion" header="DESCRIPCIÓN TENOR"  bodyStyle={{ textAlign: 'center' }} headerStyle={{ display: 'flex', justifyContent: 'center' }} ></Column>
                        <Column field="te_tipo_reg" header="TIPO MOVIMIENTO"  bodyStyle={{ textAlign: 'center' }}  ></Column>
                        <Column field="te_fecha_creacion" header="FECHA CREACIÓN"  bodyStyle={{ textAlign: 'center' }} ></Column>
                        <Column header="OPCIONES" body={actionBodyTemplate} exportable={false}  bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                </section>
            </Card>
        </div>
        <SpeedDial onClick={handleDirect} direction="up" style={{ position: "fixed", bottom: "2rem", right: "2rem" }} showIcon="pi pi-cog" />
    </>
  )
}

export default TbltenoresList