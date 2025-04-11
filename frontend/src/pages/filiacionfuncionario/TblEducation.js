import { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axios from 'axios';


function TblEducation({ef_per_id, educationData, setEducationData, visibleDialog, fillData}) {
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
                    className="p-button-danger p-button-sm"
                    onClick={() => handleDelete(rowData) }
                />
            </div>   
        )
    }

    const handleDelete = ({ ef_id }) => {
        confirmDialog({
            message: '¿Está seguro de proceder con la acción?',
            header: 'Anular registro',
            icon: 'pi pi-exclamation-triangle',
            accept: () => accept(ef_id)
        });
    }

    const accept = async (ef_id) => {        
        await axios.get(`tblkdeducacionformal/delete/${ef_id}`)
        .then(response => {
            toast.current.show({ severity: 'info', summary: '', detail: 'Registro anulado con exito!', life: 3000 });
        })
        .catch(err => {
            toast.current.show({ severity: 'error', summary: '', detail: 'Error al anular registro!', life: 3000 });
        })

        const { data } = await axios.get(`tblkdeducacionformal/index/ef_per_id/${ef_per_id}`);
        setEducationData(data);
    }

    const handleEdit = (rowData) => {
        visibleDialog(true);
        fillData(rowData);
    }
    
  return (
    <>
        <Toast ref={toast} />
        <DataTable value={educationData} responsiveLayout="scroll">
            <Column field="ef_nivel_instruccion" header="NIVEL DE INSTRUCCIÓN"></Column>
            <Column field="ef_centro_form" header="CENTRO DE FORMACIÓN"></Column>
            <Column field="ef_carrera_especialidad" header="CARRERA/ESPECIALIDAD"></Column>
            <Column field="ef_anios_estudio" header="AÑOS DE ESTUDIO"></Column>
            <Column field="ef_titulo_obtenido" header="TITULO OBTENIDO"></Column>
            <Column body={actionButtons} header="OPCIONES"></Column>
        </DataTable>
    </>
  )
}

export default TblEducation