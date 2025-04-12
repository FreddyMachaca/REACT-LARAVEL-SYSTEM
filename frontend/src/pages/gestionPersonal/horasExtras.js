import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import useApp from 'hooks/useApp';
import axios from 'axios';


const HorasExtras = ({ personaId }) => {
    const app = useApp();
    const [tieneHorasAsignadas, setTieneHorasAsignadas] = useState(false);
    const [horasInput, setHorasInput] = useState('');
    const [horasAsignadas, setHorasAsignadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tiposSancion, setTiposSancion] = useState([]); 

  const guardarHoras = () => {
    if (!horasInput) return;
    
    const nuevaHora = {
      id: Date.now(),
      horas: horasInput,
      fecha: new Date().toLocaleDateString()
    };
    
    setHorasAsignadas([...horasAsignadas, nuevaHora]);
    setTieneHorasAsignadas(true);
    setHorasInput('');
  };

  useEffect( () => {
    fetchTiposSancion()
  }, []);

    const fetchTiposSancion = async () => {
        try {
            const response = await axios.get('/tblcatalogo/getTiposSancion');
            setTiposSancion(response.data?.map(cat => ({
                id: cat.cat_id,
                descripcion: cat.cat_descripcion,
                abreviacion: cat.cat_abreviacion
            })) || []);
        } catch (error) {
            app.flashMsg('Error', 'No se pudieron cargar los tipos de sanción', 'error');
        }
    };

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
                <p>FEBRERO</p>
                </div>
            </div>
            </div>
            
            <div className="mt-4 flex justify-content-end">
                <div className='mr-2'>
                    <label htmlFor="tipo_sancion" className="font-bold block mb-2">Horas</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-clock" />
                        <InputText type='number' />
                    </span>
                </div>
                <div className='mr-2'>
                    <label htmlFor="tipo_sancion" className="font-bold block mb-2">Tipo Sanción</label>
                    <Dropdown
                        id="tipo_sancion"
                        options={tiposSancion.map(t => ({ label: t.descripcion, value: t.id }))}
                        placeholder="Seleccione un tipo"
                        className="w-full"
                        filter 
                    />
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
            
            {tieneHorasAsignadas ? (
            <div className="bg-blue-100 text-blue-800 p-2 rounded-md inline-block">
                EL FUNCIONARIO NO TIENE HORAS EXTRAS ASIGNADAS.
            </div>
            ) : (
            <div>
                <DataTable
                loading={loading}
                paginator
                rows={10}
                emptyMessage={loading ? <ProgressSpinner style={{width: '30px', height: '30px'}}/> : "No se encontraron sanciones."}
                className="p-datatable-sm"
                responsiveLayout="scroll"
                >
                    <Column field='' header='ID' sortable/>
                    <Column field='' header='Tipo sanción' sortable/>
                    <Column field='' header='Fecha inicio' sortable/>
                    <Column field='' header='Fecha fin' sortable/>
                    <Column field='' header='Monto' sortable/>
                </DataTable>
            </div>
            )}
        </div>
        </div>
    );
    };

export default HorasExtras;