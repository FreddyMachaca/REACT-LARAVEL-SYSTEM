import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
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
      
  const [bonos, setBonos] = useState([
    {
      cs_id: 1,
      cs_res_adm: '464/2016',
      cs_nro_cas: '459/2016',
      cs_fecha_cas: '10/10/2016',
      antiguedad: {
        cs_anos: 20,
        cs_meses: 0,
        cs_dias: 29
      },
      cs_tipo_reg: 'ACTUALIZACIÓN',
      cs_estado: 'VIGENTE'
    }
  ]);

  const handleGuardar = () => {
    const { nResolucion, nCas, fechaCas, anios, meses, dias } = formData;
  
    if (!nResolucion || !nCas || !fechaCas || anios === '') {
      app.flashMsg('Error', 'Por favor completa todos los campos obligatorios', 'error');
      return;
    }
  
    const nuevoBono = {
      cs_res_adm: nResolucion,
      cs_nro_cas: nCas,
      cs_fecha_cas: fechaCas,
      antiguedad: {
        cs_anos: parseInt(anios) || 0,
        cs_meses: parseInt(meses) || 0,
        cs_dias: parseInt(dias) || 0
      },
      cs_tipo_reg: 'NUEVO',
      cs_estado: 'VIGENTE'
    };
  
    console.log(nuevoBono);
  
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
  };

  const antiguedadTemplate = ({ antiguedad }) => {
    return (
        <p> {antiguedad.cs_anos} AÑOS, {antiguedad.cs_meses} MES(ES), {antiguedad.cs_dias} DÍA(S) </p>
    );
  }

  const confirmDelete = (rowData) => {

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
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => confirmDelete(rowData)}
                tooltip="Eliminar"
            />
        </div>
    );
  }

  const handleCalendarChange = (value) => {
    setFormData({
      ...formData,
      fechaCas: value
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
                    value={formData.nResolucion}
                    onChange={handleChange}
                    placeholder="Ej.: 001/2020"
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <label>N° CAS</label>
                    <InputText 
                    placeholder="Ej.: 001/2020"
                    value={formData.nCas}
                    onChange={handleChange}
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <label htmlFor='fecha_cas'>FECHA CAS</label>
                    <Calendar 
                    id='fecha_cas' 
                    value={formData.fechaCas}
                    onChange={(e) => handleCalendarChange(e.value)}
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <label htmlFor='fecha_cas'>AÑOS</label>
                    <InputText 
                    type="number" 
                    value={formData.anios}
                    onChange={handleChange}
                    />
                </div>
            </div>

            <div className="p-fluid flex justify-content-evenly">
                <div className="field col-12 md:col-3">
                    <label htmlFor='fecha_cas'>MESES</label>
                    <InputText 
                    type="number" 
                    value={formData.meses}
                    onChange={handleChange}
                    />
                </div>

                <div className="field col-12 md:col-3">
                    <label htmlFor='fecha_cas'>DÍAS</label>
                    <InputText 
                    type="number" 
                    value={formData.dias}
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
                <Column body={controlesTemplate} header='CONTROLES'/>
            </DataTable>
          </div>
        </div>
      </Card>
    </>
  );
}

export default BonoAntiguedad;