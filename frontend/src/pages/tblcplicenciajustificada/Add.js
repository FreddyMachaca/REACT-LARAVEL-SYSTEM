import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { classNames } from 'primereact/utils';
import useApp from 'hooks/useApp';
import axios from "axios";

function TtblCpLicenciaJustificadaAdd() {
    const app = useApp();
    const { personaId } = useParams();
    const [tiposLicencia, setTiposLicencia] = useState(null);
    const [autorizadores, setAutorizadores] = useState(null);
    const [persona, setPersona] = useState(null);
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

            const [personaResponse, infoResponse] = await Promise.all([
                axios.get(`/tblpersona/view/${personaId}`),
                axios.get(`/tbltipoaportante/personaInfo/${personaId}`)
            ]);
            setPersona({...personaResponse.data, ...infoResponse.data});

            const tiposLicencia = resLicencias.data;
            const autorizadores = resAutorizadores.data;

            setTiposLicencia(tiposLicencia);
            setAutorizadores(autorizadores);

        } catch(error){
            console.error(error);
        }
    };  
    
    const validationSchema = Yup.object().shape({
        lj_tipo_licencia: Yup.number()
            .required('El tipo de licencia es obligatorio')
            .nullable(),
        lj_motivo: Yup.string()
            .required('El motivo es obligatorio')
            .max(100, 'El motivo no puede tener más de 100 caracteres'),
        lj_lugar: Yup.string()
            .required('El lugar es obligatorio')
            .max(100, 'El lugar no puede tener más de 100 caracteres'),
        lj_fecha_inicial: Yup.date()
            .required('La fecha de inicio es obligatoria')
            .nullable(),
        lj_fecha_final: Yup.date()
            .required('La fecha de fin es obligatoria')
            // .min(
            //     Yup.ref('fechaInicio'),
            //     'La fecha de fin debe ser posterior a la fecha de inicio'
            // )
            .nullable(),
        lj_hora_salida: Yup.date()
            .required('La hora de inicio es obligatoria')
            .nullable(),
        lj_hora_retorno: Yup.date()
            .required('La hora de fin es obligatoria')
            .nullable(),
            // .test(
            //     'is-greater',
            //     'La hora de fin debe ser posterior a la hora de inicio',
            //     function(value, context) {
            //         const { lj_hora_salida } = context.parent;
            //         if (!lj_hora_salida || !value) return true;
                    
            //         return new Date(value).getTime() > new Date(lj_hora_salida).getTime();
            //     }
            // ),
        lj_per_id_autoriza: Yup.number()
            .required('El autorizador es obligatorio')
            .nullable()
    });
    
    const initialValues = {
        lj_tipo_licencia: null,
        lj_motivo: '',
        lj_lugar: '',
        lj_fecha_inicial: null,
        lj_fecha_final: null,
        lj_hora_salida: null,
        lj_hora_retorno: null,
        lj_per_id_autoriza: null
    };

    const formatHora = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };    
    
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        values = {
            ...values,
            lj_per_id: personaId,
            lj_hora_salida: formatHora(values.lj_hora_salida),
            lj_hora_retorno: formatHora(values.lj_hora_retorno),
        }

        try {
            axios.post('tblcplicenciajustificada/add', values)
            app.flashMsg('Éxito', 'Licencia registrada registrado correctamente', 'success');
            
            resetForm();
        } catch (error){
            app.flashMsg('Error', `Error: ${error}`, 'error');
        }
    };

    const FormError = ({ name }) => (
        <ErrorMessage name={name}>
            {msg => <small className="p-error block">{msg}</small>}
        </ErrorMessage>
    );

    return (
        <>
        <div className="flex flex-wrap gap-5">
            <div className="p-4 surface-card border-round shadow-2 md:col-7">
                <h5 className="mb-4">Datos para el registro de la Licencia</h5>
                <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="grid formgrid">
                                <div className="field col-12">
                                    <label htmlFor="lj_tipo_licencia">Tipo Licencia</label>
                                    <Dropdown
                                        id="lj_tipo_licencia"
                                        name="lj_tipo_licencia"
                                        options={tiposLicencia}
                                        optionValue="cat_id"
                                        optionLabel="cat_descripcion"
                                        placeholder="Seleccionar..."
                                        className={classNames('w-full', { 'p-invalid': errors.lj_tipo_licencia && touched.lj_tipo_licencia })}
                                        value={values.lj_tipo_licencia}
                                        onChange={(e) => setFieldValue('lj_tipo_licencia', e.value)}
                                    />
                                    <FormError name="lj_tipo_licencia" />
                                </div>
                                
                                <div className="field col-6">
                                    <label htmlFor="lj_motivo">Motivo</label>
                                    <InputText
                                        id="lj_motivo"
                                        name="lj_motivo"
                                        className={classNames('w-full', { 'p-invalid': errors.lj_motivo && touched.lj_motivo })}
                                        value={values.lj_motivo}
                                        onChange={(e) => setFieldValue('lj_motivo', e.target.value)}
                                    />
                                    <FormError name="lj_motivo" />
                                </div>
                                
                                <div className="field col-6">
                                    <label htmlFor="lj_lugar">Lugar</label>
                                    <InputText
                                        id="lj_lugar"
                                        name="lj_lugar"
                                        className={classNames('w-full', { 'p-invalid': errors.lj_lugar && touched.lj_lugar })}
                                        value={values.lj_lugar}
                                        onChange={(e) => setFieldValue('lj_lugar', e.target.value)}
                                    />
                                    <FormError name="lj_lugar" />
                                </div>
                                
                                <div className="field col-6">
                                    <label htmlFor="lj_fecha_inicial">Fecha Inicio</label>
                                    <Calendar
                                        id="lj_fecha_inicial"
                                        name="lj_fecha_inicial"
                                        showIcon
                                        className={classNames('w-full', { 'p-invalid': errors.lj_fecha_inicial && touched.lj_fecha_inicial })}
                                        value={values.lj_fecha_inicial}
                                        onChange={(e) => setFieldValue('lj_fecha_inicial', e.value)}
                                    />
                                    <FormError name="lj_fecha_inicial" />
                                </div>
                                
                                <div className="field col-6">
                                    <label htmlFor="lj_fecha_final">Fecha Fin</label>
                                    <Calendar
                                        id="lj_fecha_final"
                                        name="lj_fecha_final"
                                        showIcon
                                        className={classNames('w-full', { 'p-invalid': errors.lj_fecha_final && touched.lj_fecha_final })}
                                        value={values.lj_fecha_final}
                                        onChange={(e) => setFieldValue('lj_fecha_final', e.value)}
                                    />
                                    <FormError name="lj_fecha_final" />
                                </div>
                                
                                <div className="field col-6">
                                    <label htmlFor="lj_hora_salida">Hora Inicio</label>
                                    <Calendar
                                        id="lj_hora_salida"
                                        name="lj_hora_salida"
                                        timeOnly
                                        showIcon
                                        className={classNames('w-full', { 'p-invalid': errors.lj_hora_salida && touched.lj_hora_salida })}
                                        value={values.lj_hora_salida}
                                        onChange={(e) => setFieldValue('lj_hora_salida', e.value)}
                                    />
                                    <FormError name="lj_hora_salida" />
                                </div>
                                
                                <div className="field col-6">
                                    <label htmlFor="lj_hora_retorno">Hora Fin</label>
                                    <Calendar
                                        id="lj_hora_retorno"
                                        name="lj_hora_retorno"
                                        timeOnly
                                        showIcon
                                        className={classNames('w-full', { 'p-invalid': errors.lj_hora_retorno && touched.lj_hora_retorno })}
                                        value={values.lj_hora_retorno}
                                        onChange={(e) => setFieldValue('lj_hora_retorno', e.value)}
                                    />
                                    <FormError name="lj_hora_retorno" />
                                </div>
                                
                                <div className="field col-6 flex align-items-center gap-2">
                                    <label htmlFor="habilitarTexto" className="mb-0">¿Habilitar texto?</label>
                                    <InputSwitch
                                        id="habilitarTexto"
                                        checked={habilitarTexto}
                                        onChange={(e) => setHabilitarTexto(e.value)}
                                    />
                                </div>
                                
                                <div className="field col-6">
                                    <label htmlFor="lj_per_id_autoriza">Autorizado por</label>
                                    <Dropdown
                                        id="lj_per_id_autoriza"
                                        name="lj_per_id_autoriza"
                                        options={autorizadores}
                                        optionValue="per_id"
                                        optionLabel={(option) => `${option.per_nombres} ${option?.per_ap_materno} ${option?.per_ap_paterno}`}
                                        placeholder="Seleccionar autorizador"
                                        className={classNames('w-full', { 'p-invalid': errors.lj_per_id_autoriza && touched.lj_per_id_autoriza })}
                                        value={values.lj_per_id_autoriza}
                                        onChange={(e) => setFieldValue('lj_per_id_autoriza', e.value)}
                                    />
                                    <FormError name="lj_per_id_autoriza" />
                                </div>
                                
                                <div className="field col-12 text-right">
                                    <Button
                                        type="submit"
                                        label="Guardar"
                                        icon="pi pi-check"
                                        className="p-button-primary"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="surface-card border-round shadow-2 col-4 p-3">
                <div className="flex align-items-center justify-content-center mt-4 mb-3 md:mb-0" style={{minWidth: '200px'}}>
                    <div className="bg-primary w-8rem h-8rem border-circle flex align-items-center justify-content-center">
                        <i className="pi pi-user text-white" style={{ fontSize: '4rem' }}></i>
                    </div>
                </div>
                <div className="grid">
                    <div className="col-12">
                        <h3 className="text-lg font-semibold mb-3">Información Laboral</h3>
                        <div className="flex flex-column gap-3">
                            <div className="flex align-items-center justify-content-between">
                                <div className="flex align-items-center">
                                    <i className="pi pi-briefcase text-primary mr-2"></i>
                                    <span className="text-600">Puesto</span>
                                </div>
                                <span className="font-medium">{persona?.cargo_descripcion || 'No asignado'}</span>
                            </div>
                            <div className="flex align-items-center justify-content-between">
                                <div className="flex align-items-center">
                                    <i className="pi pi-money-bill text-primary mr-2"></i>
                                    <span className="text-600">Haber Básico</span>
                                </div>
                                <span className="text-primary font-bold">
                                    {persona?.ns_haber_basico 
                                        ? new Intl.NumberFormat('es-BO', { 
                                            style: 'currency', 
                                            currency: 'BOB' 
                                        }).format(persona.ns_haber_basico)
                                        : 'No asignado'
                                    }
                                </span>
                            </div>
                            <div className="flex align-items-center justify-content-between">
                                <div className="flex align-items-center">
                                    <i className="pi pi-chart-line text-primary mr-2"></i>
                                    <span className="text-600">Escalafón</span>
                                </div>
                                <span className="font-medium">{persona?.es_escalafon || 'No asignado'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <h3 className="text-lg font-semibold mb-3">Categorías</h3>
                        <div className="flex flex-column gap-3">
                            <div className="p-2 border-round bg-gray-50">
                                <div className="flex align-items-center mb-2">
                                    <i className="pi pi-sitemap text-primary mr-2"></i>
                                    <span className="text-600">Categoría Administrativa</span>
                                </div>
                                <div className="flex flex-column">
                                    <span className="font-medium mb-2">
                                        {persona?.categoria_administrativa || 'No asignada'}
                                    </span>
                                    <div className="flex align-items-center gap-2">
                                        <span className="text-sm text-500">CATEGORÍA</span>
                                        <span className="text-sm bg-primary-100 text-primary-700 p-2 border-round">
                                            {persona?.codigo_administrativo || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 border-round bg-gray-50">
                                <div className="flex align-items-center mb-2">
                                    <i className="pi pi-bookmark text-primary mr-2"></i>
                                    <span className="text-600">Categoría Programática</span>
                                </div>
                                <div className="flex flex-column">
                                    <span className="font-medium mb-2">
                                        {persona?.categoria_programatica || 'No asignada'}
                                    </span>
                                    <div className="flex align-items-center gap-2">
                                        <span className="text-sm text-500">CATEGORÍA</span>
                                        <span className="text-sm bg-primary-100 text-primary-700 p-2 border-round">
                                            {persona?.codigo_programatico || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <h3 className="text-lg font-semibold mb-3">Información Personal</h3>
                        <div className="flex flex-column gap-3">
                            <div className="flex align-items-center justify-content-between">
                                <div className="flex align-items-center">
                                    <i className="pi pi-calendar text-primary mr-2"></i>
                                    <span className="text-600">Fecha Nacimiento</span>
                                </div>
                                <span className="font-medium">
                                    {persona?.per_fecha_nac ? new Date(persona.per_fecha_nac).toLocaleDateString() : 'No registrada'}
                                </span>
                            </div>
                            <div className="flex align-items-center justify-content-between">
                                <div className="flex align-items-center">
                                    <i className="pi pi-id-card text-primary mr-2"></i>
                                    <span className="text-600">CI</span>
                                </div>
                                <span className="font-medium">{persona?.per_num_doc || 'No registrado'}</span>
                            </div>

                            <h3 className="text-lg font-semibold mt-3 mb-2">Fechas</h3>
                            <div className="flex align-items-center justify-content-between">
                                <div className="flex align-items-center">
                                    <i className="pi pi-calendar-plus text-primary mr-2"></i>
                                    <span className="text-600">Alta</span>
                                </div>
                                <span className="font-medium">
                                    {persona?.as_fecha_inicio ? new Date(persona.as_fecha_inicio).toLocaleDateString() : 'No asignada'}
                                </span>
                            </div>
                            <div className="flex align-items-center justify-content-between">
                                <div className="flex align-items-center">
                                    <i className="pi pi-calendar-minus text-primary mr-2"></i>
                                    <span className="text-600">Baja</span>
                                </div>
                                <span className="font-medium">
                                    {persona?.as_fecha_fin ? new Date(persona.as_fecha_fin).toLocaleDateString() : 'No asignada'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default TtblCpLicenciaJustificadaAdd