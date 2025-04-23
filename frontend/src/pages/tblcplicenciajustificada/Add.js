import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import axios from "axios";

function TtblCpLicenciaJustificadaAdd() {
    const [tiposLicencia, setTiposLicencia] = useState(null);
    const [autorizadores, setAutorizadores] = useState(null);
    const [habilitarTexto, setHabilitarTexto] = useState(true);


    useEffect(() => {
      fetchData();

    }, []);
    
    const fetchData = async () => {
        try {
            const [resLicencias, resAutorizadores] = await Promise.all([
                axios.get('/tblcatalogo/get-tipo-licencia'),
                axios.get('/tblpersona/getoptions')
            ]);

            const tiposLicencia = resLicencias.data;
            const autorizadores = resAutorizadores.data;

            setTiposLicencia(tiposLicencia);
            setAutorizadores(autorizadores);

        } catch(error){
            console.error(error);
        }
    };

    useEffect(() => {
      console.log(autorizadores)
    }, [autorizadores])
    

    return (
        <>
        <div className="flex flex-wrap gap-5">
            <div className="p-4 surface-card border-round shadow-2 md:col-7">
                <h5 className="mb-4">Datos para el registro de la Licencia</h5>
                <div className="grid formgrid">
                    <div className="field col-12">
                        <label htmlFor="tipoLicencia">Tipo Licencia</label>
                        <Dropdown options={tiposLicencia} optionValue='cat_id' optionLabel="cat_descripcion" placeholder="Seleccionar..." className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="motivo">Motivo</label>
                        <InputText className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="lugar">Lugar</label>
                        <InputText className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="fechaInicio">Fecha Inicio</label>
                        <Calendar showIcon className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="fechaFin">Fecha Fin</label>
                        <Calendar showIcon className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="horaInicio">Hora Inicio</label>
                        <Calendar timeOnly showIcon className="w-full" />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="horaFin">Hora Fin</label>
                        <Calendar timeOnly showIcon className="w-full" />
                    </div>

                    <div className="field col-6 flex align-items-center gap-2">
                        <label htmlFor="habilitarTexto" className="mb-0">¿Habilitar texto?</label>
                        <InputSwitch checked={habilitarTexto} />
                    </div>

                    <div className="field col-6">
                        <label htmlFor="autorizador">Autorizado por</label>
                        <Dropdown options={autorizadores} optionValue='per_id' 
                        optionLabel={(option) => `${option.per_nombres} ${option?.per_ap_materno} ${option?.per_ap_paterno}`}
                        placeholder="Seleccionar autorizador" className="w-full" />
                    </div>

                    <div className="field col-12 text-right">
                        <Button label="Guardar" icon="pi pi-check" className="p-button-primary" />
                    </div>
                </div>
            </div>
            <div className="surface-card border-round shadow-2 col-12 md:col-4">

            </div>
        </div>
        </>
    );
}

export default TtblCpLicenciaJustificadaAdd