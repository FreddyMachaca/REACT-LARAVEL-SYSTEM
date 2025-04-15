import { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axios from 'axios';

function TblFamily({familyData, setFamilyData, pf_per_id, visibleDialog, fillData}) {
    const toast = useRef(null);
    
    const actionButtons = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-file-edit"
                    className="p-button-warning p-button-sm"
                    onClick={() => handleEdit(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData) }
                />
            </div>   
        )
    }

    const handleEdit = (rowData) => {
        visibleDialog(true);
        fillData(rowData);
    }

    const handleDelete = ({ pf_id }) => {
        confirmDialog({
            message: '¿Está seguro de proceder con la acción?',
            header: 'Anular registro',
            icon: 'pi pi-exclamation-triangle',
            accept: () => accept(pf_id)
        });
    }

    const accept = async (pf_id) => {
        await axios.get(`tblpersonafamiliares/delete/${pf_id}`)
        .then(response => {
            toast.current.show({ severity: 'info', summary: '', detail: 'Registro anulado con exito!', life: 3000 });
        })
        .catch(err => {
            toast.current.show({ severity: 'error', summary: '', detail: 'Error al anular registro!', life: 3000 });
        })

        const { data } = await axios.get(`tblpersonafamiliares/index/pf_per_id/${pf_per_id}`);
        setFamilyData(data);
    }

  return (
    <>
        <Toast ref={toast} />
        <DataTable value={familyData} responsiveLayout="scroll">
            <Column field="parentesco" header="TIPO PARENTESTO"></Column>
            <Column field="pf_paterno" header="APELLIDO PATERNO"></Column>
            <Column field="pf_materno" header="APELLIDO MATERNO"></Column>
            <Column field="pf_nombres" header="NOMBRE(S)"></Column>
            <Column field="pf_ap_esposo" header="APELLIDO ESPOSO"></Column>
            <Column body={actionButtons} header="OPCIONES"></Column>
        </DataTable>
    </>
  )
}

export default TblFamily