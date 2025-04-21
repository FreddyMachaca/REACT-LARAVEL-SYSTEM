import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { confirmDialog } from 'primereact/confirmdialog'; 
import { Dropdown } from 'primereact/dropdown';
import useApp from 'hooks/useApp';
import axios from 'axios';


const HorasExtras = ({ personaId }) => {
    const app = useApp();
    const [horasInput, setHorasInput] = useState('');
    const [horasAsignadas, setHorasAsignadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async() => {
        try {
            const response = await axios.get(`/tblplatransacciones/index/tr_per_id/${personaId}`);
            if(response.data.data){
                setHorasAsignadas(response.data.data);
            }
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
        }
    }

  const guardarHoras = () => {
    if (!horasInput) return;
    
    if(horasInput <= 36){
        handleSubmit(horasInput);
    }else {
        console.log('no se puede registrar')
        app.flashMsg('Error', 'Error, no se puede proceder con el registro.', 'error');
    }
  };

  const handleSubmit = async (horas) => {
    const data = {
        tr_per_id: personaId,
        tr_fa_id: 1,
        tr_monto: horas, 
        tr_estado: 'V',
        tr_pc_id: 0,
    }
    try{
        const response = await axios.post('tblplatransacciones/store', data);
        app.flashMsg('Éxito', 'Horas extras registradas exitosamente.', 'success');
        fetchData();
    }catch(error){
        console.log(`Error el registrar horas extras: ${error}`)
    }
  }

  const controlesTemplate = (rowData) => {
    return (
        <div>
          {rowData.tr_estado === "V" && (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => confirmDelete(rowData)}
                tooltip="Eliminar"
            />
          )}
        </div>
    );
  }

  const confirmDelete = ({tr_id}) => {
    confirmDialog({
      message: '¿Esta seguro de eliminar el registro?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(tr_id)
    });
  }

  const handleDelete = async (tr_id) => {
    try {
        await axios.post(`tblplatransacciones/delete/${tr_id}`);
        
        app.flashMsg('Éxito', 'Registro eliminado correctamente', 'success');

        fetchData();
    } catch(error) {
        console.log(error)
    }
  }

    return (
        <div className="p-3">
        <div className="mb-2">
            <div className="border-l-4 border-blue-500 pl-2 mb-2">
            <h4 className="text-lg font-medium text-blue-800">Datos de la Transacción</h4>
            <p className="text-sm text-gray-600">Detalle de las horas extras que asignará al funcionario seleccionado.</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
            <div className="flex justify-content-evenly">
                <div>
                <p className="text-xs uppercase font-medium text-green-800">TIPO TRANSACCIÓN</p>
                <p>HORAS EXTRAS</p>
                </div>
                <div>
                <p className="text-xs uppercase font-medium text-green-800">MÁXIMO HORAS/MES</p>
                <p>36</p>
                </div>
                <div>
                <p className="text-xs uppercase font-medium text-green-800">MES</p>
                <p>{currentMonth}</p>
                </div>
            </div>
            </div>
            
            <div className="mt-4 flex justify-content-end">
                <div className='mr-2'>
                    <label htmlFor="tipo_sancion" className="font-bold block mb-2">Horas</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-clock" />
                        <InputText type='number' onChange={({target: {value}}) => setHorasInput(value)} />
                    </span>
                </div>
                
                <Button 
                    onClick={guardarHoras}
                    className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center mt-5"
                    label='GUARDAR'
                    icon='pi pi-save'
                />
            </div>
        </div>
        
        {/* Sección Horas Extras del Funcionario */}
        <div>
            <div className="border-l-4 border-blue-500 pl-2">
            <h4 className="text-lg font-medium text-blue-800">Horas Extras del Funcionario</h4>
            <p className="text-sm text-gray-600">Detalle de las horas extra asignada al funcionario seleccionado.</p>
            </div>
            <div>
                <DataTable
                loading={loading}
                value={horasAsignadas}
                paginator
                rows={10}
                emptyMessage={loading ? <ProgressSpinner style={{width: '30px', height: '30px'}}/> : "No se encontraron sanciones."}
                className="p-datatable-sm"
                responsiveLayout="scroll"
                >
                    <Column field='tr_fa_id' header='Codigo' sortable/>
                    <Column field='tr_fecha_creacion' header='Fecha creación' sortable/>
                    <Column field='tr_monto' header='Monto' sortable/>
                    <Column body={controlesTemplate} header='ACCIONES' sortable/>
                </DataTable>
            </div>
        </div>
        </div>
    );
    };

export default HorasExtras;