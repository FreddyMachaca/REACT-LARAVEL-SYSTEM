import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'

function TblEducation({educationData}) {
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