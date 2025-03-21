import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'

function TblFamily({familyData}) {
    
    const actionButtons = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-file-edit"
                    className="p-button-warning p-button-sm"
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm"
                />
            </div>   
        )
    }

  return (
    <>
        <DataTable value={familyData} responsiveLayout="scroll">
            <Column field="pf_tipo_parentesco" header="TIPO PARENTESTO"></Column>
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