import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { confirmDialog } from 'primereact/confirmdialog'; 
import useApp from 'hooks/useApp';
import axios from 'axios';

function BonoAntiguedad({ personaId }) {
    const app = useApp();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cs_res_adm: '',
        cs_nro_cas: '',
        cs_fecha_cas: '',
        cs_anos: '',
        cs_meses: '',
        cs_dias: '',
        cs_tipo_reg: '',
        cs_estado: '',
      });
      
  const [bonos, setBonos] = useState();

  useEffect(() => {
    fetchData();
  }, [])
  
  const fetchData = async () => {
    const { data: { records } } = await axios.get(`tblplacas/index/cs_per_id/${personaId}`);

    const transformados = records.map(item => ({
    cs_id: item.cs_id,
    cs_res_adm: item.cs_res_adm,
    cs_nro_cas: item.cs_nro_cas,
    cs_fecha_cas: new Date(item.cs_fecha_cas).toLocaleDateString(),
    antiguedad: {
        cs_anos: item.cs_anos,
        cs_meses: item.cs_meses,
        cs_dias: item.cs_dias
    },
    cs_tipo_reg: item.cs_tipo_reg === 'N' ? 'NUEVO' : 'ACTUALIZACIÓN',
    cs_estado: item.cs_estado === 'V' ? 'VIGENTE' : 'HISTORICO' 
    }));

    setBonos(transformados);
  }

  const handleGuardar = () => {
    const { cs_res_adm, cs_nro_cas, cs_fecha_cas, cs_anos, cs_meses, cs_dias } = formData;
  
    if (!cs_res_adm || !cs_nro_cas || !cs_fecha_cas || cs_anos==='' || cs_meses==='' || cs_dias==='') {
      app.flashMsg('Error', 'Por favor completa todos los campos obligatorios', 'error');
      return;
    }
  
    const nuevoBono = {
      cs_res_adm: cs_res_adm,
      cs_nro_cas: cs_nro_cas,
      cs_fecha_cas: cs_fecha_cas,
      cs_per_id: personaId,
      antiguedad: {
        cs_anos: parseInt(cs_anos) || 0,
        cs_meses: parseInt(cs_meses) || 0,
        cs_dias: parseInt(cs_dias) || 0
      },
      cs_tipo_reg: 'N',
      cs_estado: 'V'
    };

    handleSubmit(nuevoBono)
  };

  const handleSubmit = async (newRecord) => {
    try {
        const response = await axios.post('tblplacas/add', newRecord);
        
        app.flashMsg('Éxito', 'Bono registrado correctamente', 'success');

        fetchData();
        cleanForm();
    } catch(error) {
        console.log(error)
    }
  }

  const cleanForm = () => {
    setFormData({
        cs_res_adm: '',
        cs_nro_cas: '',
        cs_fecha_cas: '',
        cs_anos: '',
        cs_meses: '',
        cs_dias: '',
        cs_tipo_reg: '',
        cs_estado: '',
    });
  }

  const antiguedadTemplate = ({ antiguedad }) => {
    return (
        <p> {antiguedad.cs_anos} AÑOS, {antiguedad.cs_meses} MES(ES), {antiguedad.cs_dias} DÍA(S) </p>
    );
  }

  const confirmDelete = ({cs_id}) => {
    confirmDialog({
      message: '¿Esta seguro de eliminar el registro?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(cs_id)
    });
  }

  const handleDelete = async (cs_id) => {
    try {
        await axios.post(`tblplacas/delete/${cs_id}`);
        
        app.flashMsg('Éxito', 'Bono eliminado correctamente', 'success');

        fetchData();
    } catch(error) {
        console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };  

  const controlesTemplate = (rowData) => {
    return (
        <div>
          {rowData.cs_estado === "VIGENTE" && (
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

  const handleCalendarChange = (value) => {
    setFormData({
      ...formData,
      cs_fecha_cas: value
    });
  };

  return (
    <>
      <Card title="Datos del Bono" className='mb-4'>        
        <div className="bg-white rounded-md shadow-sm">
            <div className="p-fluid grid formgrid">
                <div className="field col-12 md:col-3">
                    <label>N° RESOLUCIÓN ADM.</label>
                    <InputText 
                    name='cs_res_adm'
                    value={formData.cs_res_adm}
                    onChange={handleChange}
                    placeholder="Ej.: 001/2020"
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <label>N° CAS</label>
                    <InputText 
                    name='cs_nro_cas'
                    placeholder="Ej.: 001/2020"
                    value={formData.cs_nro_cas}
                    onChange={handleChange}
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <label htmlFor='fecha_cas'>FECHA CAS</label>
                    <Calendar 
                    name='cs_fecha_cas' 
                    value={formData.cs_fecha_cas}
                    onChange={(e) => handleCalendarChange(e.value)}
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <label htmlFor='fecha_cas'>AÑOS</label>
                    <InputText 
                    type="number" 
                    name='cs_anos'
                    value={formData.cs_anos}
                    onChange={handleChange}
                    />
                </div>
            </div>

            <div className="p-fluid flex justify-content-evenly">
                <div className="field col-12 md:col-3">
                    <label htmlFor='fecha_cas'>MESES</label>
                    <InputText 
                    type="number" 
                    name='cs_meses'
                    value={formData.cs_meses}
                    onChange={handleChange}
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <label htmlFor='fecha_cas'>DÍAS</label>
                    <InputText 
                    type="number" 
                    name='cs_dias'
                    value={formData.cs_dias}
                    onChange={handleChange}
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <Button 
                    onClick={handleGuardar}
                    className="bg-green-500 hover:bg-green-600 mt-4"
                    label='GUARDAR'
                    />
                </div>
            </div>
        </div>
      </Card>
      
      <Card title="Lista de Bonos">        
        <div className="bg-white rounded-md shadow-sm">
          <div className="overflow-x-auto">
            <DataTable
            value={bonos}
            loading={loading}
            paginator
            rows={10}
            emptyMessage={loading ? <ProgressSpinner style={{width: '30px', height: '30px'}}/> : "No se encontraron sanciones."}
            className="p-datatable-sm"
            responsiveLayout="scroll"
            >
                <Column field='cs_res_adm' header='N° RESOLUCIÓN ADM.' sortable/>
                <Column field='cs_nro_cas' header='N° CAS' sortable/>
                <Column field='cs_fecha_cas' header='FECHA CAS' sortable/>
                <Column body={antiguedadTemplate} header='ANTIGÜEDAD' sortable/>
                <Column field='cs_tipo_reg' header='TIPO REGISTRO' sortable/>
                <Column field='cs_estado' header='ESTADO' sortable/>
                <Column body={controlesTemplate} header='ACCIONES'/>
            </DataTable>
          </div>
        </div>
      </Card>
    </>
  );
}

export default BonoAntiguedad;