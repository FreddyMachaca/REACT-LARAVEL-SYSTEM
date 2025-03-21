import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Tag } from "primereact/tag";
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterZoneDialog from "./RegisterZoneDialog";
import useApp from 'hooks/useApp';
import PageLoading from '../../components/PageLoading'
import axios from 'axios'

function TblpersonaAdd() {
    const app = useApp();
    const navigate = useNavigate();
    const [selectValues, setSelectValues] = useState({tipo_documento_impreso:[], lug_exp:[], estado_civil:[], nacionalidad:[], lug_nac:[], ciudad_localidad:[], zona:[], tipo_via:[], pais: [], departamento: [], provincia: [], tipo_via: []});
    const [formData, setFormData] = useState({});
    const [formDataZone, setFormDataZone] = useState({});
    const [dialogZone, setDialogZone] = useState(false);
    const [loading, setLoading] = useState(false);
    

    const formik = useFormik({
        initialValues: {
            per_nombres: '',
            per_ap_paterno: '',
            per_ap_materno: '',
            per_ap_casada: '',
            per_sexo: null,
            per_tipo_doc: null,
            per_num_doc: '',
            per_lugar_exp: null,
            per_estado_civil: null,
            per_fecha_nac: null,
            per_lugar_nac: null,
            per_procedencia: null,

            perd_ciudad_residencia: null,
            perd_zona: null,
            perd_tipo_via: null,
            perd_descripcion_via: '',
            perd_numero: 0,
        },
        validate: (data) => {
            let errors = {};

            if (!data.per_nombres) {
                errors.per_nombres = 'El campo NOMBRE(S) es requerido.';
            }
            if (!data.per_ap_paterno) {
                errors.per_ap_paterno = 'El campo APELLIDO PATERNO es requerido.';
            }
            if (!data.per_ap_materno) {
                errors.per_ap_materno = 'El campo APELLIDO MATERNO es requerido.';
            }
            if (!data.per_tipo_doc) {
                errors.per_tipo_doc = 'El campo TIPO DE DOCUMENTO es requerido.';
            } 
            if (!data.per_sexo) {
                errors.per_sexo = 'Este campo es requerido.';
            } 
            if (!data.per_num_doc) {
                errors.per_num_doc = 'El campo NUMERO DE DOCUMENTO es requerido.';
            } 
            if (!data.per_lugar_exp) {
                errors.per_lugar_exp = 'El campo LUGAR EXPEDIDO es requerido.';
            } 
            if (!data.per_lugar_nac) {
                errors.per_lugar_nac = 'El campo LUGAR DE NACIMIENTO es requerido.';
            } 
            if (!data.per_procedencia) {
                errors.per_procedencia = 'El campo NACIONALIDAD es requerido.';
            } 
            if (!data.perd_ciudad_residencia) {
                errors.perd_ciudad_residencia = 'El campo CIUDAD DE RESIDENCIA es requerido.';
            } 
            if (!data.perd_zona) {
                errors.perd_zona = 'El campo ZONA es requerido.';
            } 
            if (!data.per_estado_civil) {
                errors.per_estado_civil = 'El campo ESTADO CIVIL es requerido.';
            } 
            if (!data.perd_tipo_via) {
                errors.perd_tipo_via = 'Este campo es requerido.';
            } 
            if (!data.perd_descripcion_via) {
                errors.perd_descripcion_via = 'Este campo es requerido.';
            }
            if (!data.perd_numero) {
                errors.perd_numero = 'Este campo es requerido.';
            }
            if (!data.per_fecha_nac) {
                errors.per_fecha_nac = 'Este campo es requerido.';
            }

            return errors;
        },
        onSubmit: (data) => {
            setFormData(data);

            formik.resetForm();
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    useEffect(() => {
        if(Object.keys(formData).length > 0){
            setLoading(true);
            handleSubmit('tblpersona/add/personwithhome', formData);
            setTimeout(() => {
                setLoading(false);            
                navigate('/MovimientoPersonal/Persona'); 
            }, 2000); 
        }
    }, [formData]);

    useEffect(() => {
        const keys = ["tipo_documento_impreso", "estado_civil", "pais", "ciudad_localidad", "zona", "departamento", "provincia", "tipo_via"];

        axios.get("tblcatalogo/add/persona")
        .then(response => {
            setSelectValues(
                Object.fromEntries(
                keys.map(key => [
                    key,
                    response.data[key].map(item => ({
                    label: item.cat_descripcion,
                    value: item.cat_id,
                    }))
                ])
                )
            )
        })
        .catch(error => console.error("Error al obtener registros: ", error))
    },[]); 

    useEffect(() => {
        if(!formik.values.perd_ciudad_residencia) return;
        const catId = formik.values.perd_ciudad_residencia;
        axios.get(`tblcatalogo/catalogos/childs/${catId}`)
        .then(response => {
            setSelectValues(prev => ({
                ...prev,
                'zona': response.data.map(item => ({
                    label: item.cat_descripcion,
                    value: item.cat_id
                }))
            }))
        })
        .catch(error => console.error("Error al obtener catálogos hijos:", error));
    }, [formik.values.perd_ciudad_residencia]);

    useEffect(() => {
        if(Object.keys(formDataZone).length > 0){
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                handleSubmit('tblcatalogo/add/zone', formDataZone);
            }, 2000);
        }
    }, [formDataZone])
    

    const handleSubmit = async (url, data) => {
        try{
            const response = await axios.post(url, data);
            app.flashMsg('Crear registro', 'Grabar agregado exitosamente');
            
            return response.data;
        } catch(error) {
            console.warn('Error al enviar datos:', error);
            app.flashMsg('Error', 'No se pudo enviar la información');
            return null;
        }
    }

    const showDialogAddZone = () => setDialogZone(!dialogZone);

  return (
    <>
    {loading && (<div className="page-loading-overlay">
        <PageLoading />
    </div>)}
    <form onSubmit={formik.handleSubmit} className="p-fluid">
      <div className="flex flex-wrap gap-5">
        {/* ---------FIRTS CARD-------- */}
        <div className="card col-12 md:col-7">
          <div className="border-left-2 border-primary-500 w-full m-2 surface-overlay p-2">
            <strong>Datos personales</strong>
            <p>En el siguiente formulario puede ingresar los datos del nuevo personal.</p>
          </div>
          <Divider />
          <Tag>
            <strong>Código de funcionario: </strong> 578140
          </Tag>

                <div className="grid p-fluid mb-2 mt-5">
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="per_nombres" name="per_nombres" value={formik.values.per_nombres} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('per_nombres') })} />
                            <label htmlFor="per_nombres" className={classNames({ 'p-error': isFormFieldValid('per_nombres') })}>NOMBRE(S)</label>
                        </span>
                        {getFormErrorMessage('per_nombres')}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="per_ap_paterno" name="per_ap_paterno" value={formik.values.per_ap_paterno} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('per_ap_paterno') })} />
                            <label htmlFor="per_ap_paterno" className={classNames({ 'p-error': isFormFieldValid('per_ap_paterno') })}>APELLIDO PATERNO</label>
                        </span>
                        {getFormErrorMessage('per_ap_paterno')}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="per_ap_materno" name="per_ap_materno" value={formik.values.per_ap_materno} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('per_ap_materno') })} />
                            <label htmlFor="per_ap_materno" className={classNames({ 'p-error': isFormFieldValid('per_ap_materno') })}>APELLIDO MATERNO</label>
                        </span>
                        {getFormErrorMessage('per_ap_materno')}
                    </div>
                </div>
                <div className="grid p-fluid mb-2 mt-2">
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="per_ap_casada" name="per_ap_casada" value={formik.values.per_ap_casada} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('per_ap_casada') })} />
                            <label htmlFor="per_ap_casada" className={classNames({ 'p-error': isFormFieldValid('per_ap_casada') })}>APELLIDO DEL ESPOSO (Si corresponde)</label>
                        </span>
                    </div>
                    <div className="field col-12 md:col-4">
                        <p style={{margin: 0}} className={classNames({ 'p-error': isFormFieldValid('per_sexo') })}>SEXO / GÉNERO</p>
                        <div className="flex justify-content-evenly mt-2">
                            <div className="field-radiobutton">
                                <RadioButton inputId="rb-masculino" name="per_sexo" value="M" onChange={(e) => formik.setFieldValue("per_sexo", e.value)} checked={formik.values.per_sexo === 'M'} />
                                <label htmlFor="rb-masculino">Masculino</label>
                            </div>
                            <div className="field-radiobutton">
                                <RadioButton inputId="rb-femenino" name="per_sexo" value="F" onChange={(e) => formik.setFieldValue("per_sexo", e.value)} checked={formik.values.per_sexo === 'F'} />
                                <label htmlFor="rb-femenino">Femenino</label>
                            </div>
                        </div>
                        {getFormErrorMessage('per_sexo')}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Dropdown id="per_tipo_doc" name="per_tipo_doc" value={formik.values.per_tipo_doc} onChange={(e) => formik.setFieldValue("per_tipo_doc", e.value)} options={selectValues.tipo_documento_impreso} optionLabel="label" />
                            <label htmlFor="per_tipo_doc" className={classNames({ 'p-error': isFormFieldValid('per_tipo_doc') })}>TIPO DE DOCUMENTO</label>
                        </span>
                        {getFormErrorMessage('per_tipo_doc')}
                    </div>
                </div>
                <div className="grid p-fluid mb-2 mt-2">
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="per_num_doc" name="per_num_doc" value={formik.values.per_num_doc} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('per_num_doc') })} />
                            <label htmlFor="per_num_doc" className={classNames({ 'p-error': isFormFieldValid('per_num_doc') })}>NUMERO DE DOCUMENTO</label>
                        </span>
                        {getFormErrorMessage('per_num_doc')}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Dropdown id="per_lugar_exp" name="per_lugar_exp" value={formik.values.per_lugar_exp} onChange={(e) => formik.setFieldValue("per_lugar_exp", e.value)} options={selectValues.departamento} optionLabel="label" />
                            <label htmlFor="per_lugar_exp" className={classNames({ 'p-error': isFormFieldValid('per_lugar_exp') })}>LUGAR EXPEDIDO</label>
                        </span>
                        {getFormErrorMessage('per_lugar_exp')}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Dropdown id="per_estado_civil" name="per_estado_civil" value={formik.values.per_estado_civil} onChange={(e) => formik.setFieldValue("per_estado_civil", e.value)} options={selectValues.estado_civil} optionLabel="label" />
                            <label htmlFor="per_estado_civil" className={classNames({ 'p-error': isFormFieldValid('per_estado_civil') })}>ESTADO CIVIL</label>
                        </span>
                        {getFormErrorMessage('per_estado_civil')}
                    </div>
                </div>
                <div className="grid p-fluid mb-2 mt-2">
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Calendar id="per_fecha_nac" name="per_fecha_nac" value={formik.values.per_fecha_nac} onChange={formik.handleChange} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                            <label htmlFor="per_fecha_nac" className={classNames({ 'p-error': isFormFieldValid('per_fecha_nac') })}>FECHA DE NACIMIENTO</label>
                        </span>
                        {getFormErrorMessage('per_fecha_nac')}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Dropdown id="per_procedencia" name="per_procedencia" value={formik.values.per_procedencia} onChange={(e) => formik.setFieldValue("per_procedencia", e.value)} options={selectValues.pais} optionLabel="label" />
                            <label htmlFor="per_procedencia" className={classNames({ 'p-error': isFormFieldValid('per_procedencia') })}>NACIONALIDAD</label>
                        </span>
                        {getFormErrorMessage('per_procedencia')}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Dropdown id="per_lugar_nac" name="per_lugar_nac" value={formik.values.per_lugar_nac} onChange={(e) => formik.setFieldValue("per_lugar_nac", e.value)} options={selectValues.provincia} optionLabel="label" filter showClear filterBy="label" placeholder="Seleccione..."/>
                            <label htmlFor="per_lugar_nac" className={classNames({ 'p-error': isFormFieldValid('per_lugar_nac') })}>LUGAR DE NACIMIENTO</label>
                        </span>
                        {getFormErrorMessage('per_lugar_nac')}
                    </div>
                </div>
        </div>
        {/* ---------SECOND CARD-------- */}
        <div className="card col-12 md:col-4">
            <div className="border-left-2 border-primary-500 w-full m-2 surface-overlay p-2">
                <strong>Domicilio</strong>
                <p>En el siguiente formulario puede ingresar los datos de la dirección actual de residencia.</p>
            </div>
            <Divider />
            <div className="grid p-fluid mb-2 mt-5">
                <div className="field col-12 md:col-5">
                    <span className="p-float-label">
                        <Dropdown id="perd_ciudad_residencia" name="perd_ciudad_residencia" value={formik.values.perd_ciudad_residencia} onChange={formik.handleChange} options={selectValues.ciudad_localidad} optionLabel="label" filter showClear filterBy="label" placeholder="Seleccione.."/>
                        <label htmlFor="perd_ciudad_residencia" className={classNames({ 'p-error': isFormFieldValid('perd_ciudad_residencia') })}>CIUDAD DE RESIDENCIA</label>
                    </span>
                    {getFormErrorMessage('perd_ciudad_residencia')}
                </div>
                <div className="field col-12 md:col-5">
                    <span className="p-float-label">
                        <Dropdown id="perd_zona" name="perd_zona" value={formik.values.perd_zona} onChange={(e) => formik.setFieldValue("perd_zona", e.value)} options={selectValues.zona} optionLabel="label" filter showClear filterBy="label"
                        disabled={formik.values.perd_ciudad_residencia===null}/>
                        <label htmlFor="perd_zona" className={classNames({ 'p-error': isFormFieldValid('perd_zona') })}>ZONA</label>
                    </span>
                    {getFormErrorMessage('perd_zona')}
                </div>
                <div className="flex mt-2 align-items-and mx-auto">
                    <Button icon="pi pi-plus" type="button" className="p-button-rounded p-button-primary"
                    onClick={ showDialogAddZone }/>
                </div>
            </div>
            <div className="grid p-fluid mb-2">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown id="perd_tipo_via" name="perd_tipo_via" value={formik.values.perd_tipo_via} onChange={(e) => formik.setFieldValue("perd_tipo_via", e.value)} options={selectValues.tipo_via} optionLabel="label" />
                        <label htmlFor="perd_tipo_via" className={classNames({ 'p-error': isFormFieldValid('perd_tipo_via') })}>Selecione...</label>
                    </span>
                    {getFormErrorMessage('perd_tipo_via')}
                </div>
                <div className="field col-12 md:col-8">
                    <span className="p-float-label">
                        <InputText id="perd_descripcion_via" name="perd_descripcion_via" value={formik.values.perd_descripcion_via} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('perd_descripcion_via') })} />
                        <label htmlFor="perd_descripcion_via" className={classNames({ 'p-error': isFormFieldValid('perd_descripcion_via') })}></label>
                    </span>
                    {getFormErrorMessage('perd_descripcion_via')}
                </div>
            </div>
            <div className="grid p-fluid mb-2">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber id="perd_numero" name="perd_numero" value={formik.values.perd_numero} onChange={(e) => formik.setFieldValue("perd_numero", e.value)} className={classNames({ 'p-invalid': isFormFieldValid('perd_numero') })} />
                        <label htmlFor="perd_numero" className={classNames({ 'p-error': isFormFieldValid('perd_numero') })}># DOMICILIO</label>
                    </span>
                    {getFormErrorMessage('perd_numero')}
                </div>
            </div>
            <div className="grid p-fluid mb-2">
                <Button type="submit" label="Guardar" className="field col-12 md:col-4" />
            </div>
        </div>
      </div>
    </form>
        <RegisterZoneDialog 
        dialogZone={dialogZone} 
        showDialogAddZone={showDialogAddZone} 
        selectValue={selectValues.departamento}
        setFormData={setFormDataZone}/>
    </>
  )
}

export default TblpersonaAdd