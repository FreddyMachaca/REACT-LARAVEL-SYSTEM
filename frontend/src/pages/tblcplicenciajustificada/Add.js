import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";

function TtblCpLicenciaJustificadaAdd() {
    const [tipoLicencia, setTipoLicencia] = useState(null);
    const [habilitarTexto, setHabilitarTexto] = useState(true);

    return (
        <>
        <div className="flex flex-wrap gap-5">
            <div className="p-4 surface-card border-round shadow-2 md:col-7">
                <h5 className="mb-4">Datos para el registro de la Licencia</h5>
                <div className="grid formgrid">
                    <div className="field col-12">
                        <label htmlFor="tipoLicencia">Tipo Licencia</label>
                        <Dropdown onChange={(e) => setTipoLicencia(e.value)}placeholder="Seleccionar..." className="w-full" />
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
                        <Dropdown placeholder="Seleccionar autorizador" className="w-full" />
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