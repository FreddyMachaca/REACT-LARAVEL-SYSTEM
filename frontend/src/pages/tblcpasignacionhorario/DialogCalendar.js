import React, { useState, useEffect } from 'react';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import useApp from 'hooks/useApp';
import axios from 'axios';

function DialogCalendar({ visible, setVisible }) {
    const app = useApp();
    const [ tipoHorarioOptions, setTipoHorarioOptions ] = useState();
    const [formData, setFormData] = useState({
        tipoHorario: null,
        fechaInicio: null,
        fechaFin: null,
    });
      

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get('tblcatalogo/get-tipo-horario');
            setTipoHorarioOptions(data);
        }

        fetchData();
    }, []);

    const handleGenerarCalendario = () => {
        try {
          const payload = new FormData();
          payload.append('tipo_horario', formData.tipoHorario);
          payload.append(
            'fecha_inicio',
            formData.fechaInicio?.toISOString().split('T')[0] || ''
          );
          payload.append(
            'fecha_fin',
            formData.fechaFin?.toISOString().split('T')[0] || ''
          );
      
          console.log('exito')
      
        } catch (error) {
          app.flashMsg('Error', error.message, 'error');
        }
    };

  return (
    <Dialog
        header={
          <div style={{ textAlign: "center", padding: "10px" }}>
            DATOS HORARIO
          </div>
        }
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="grid">
          <div className="col-12">
            <div className="field">
              <label htmlFor="type">TIPO HORARIO</label>
              <Dropdown
                id="tipoHorario"
                options={tipoHorarioOptions} 
                optionLabel="cat_descripcion" 
                optionValue="cat_id" 
                value={formData.tipoHorario}
                className="w-full"
                placeholder="Seleccione un tipo de horario"
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tipoHorario: e.value }))
                  }
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="startDate">FECHA INICIO</label>
              <Calendar
                value={formData.fechaInicio}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fechaInicio: e.value }))
                }
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="endDate">FECHA FIN</label>

              <Calendar
                value={formData.fechaFin}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fechaFin: e.value }))
                }
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>
          <div className="col-12 flex justify-content-end">
            <Button
              label="GENERAR CALENDARIO"
              icon="pi pi-plus"
              onClick={handleGenerarCalendario}
            />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text mr-2"
              onClick={() => setVisible(false)}
            />
          </div>
        </div>
      </Dialog>
  )
}

export default DialogCalendar