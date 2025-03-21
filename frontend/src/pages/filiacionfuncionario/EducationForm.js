import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';

function EducatioForm({ef_per_id, addEducation}) {
    const [dataLevelInst, setDataLevelInst] = useState([]);
    const [dataTrCenter, setDataTrCenter] = useState([]);
    const [dataCareer, setDataCareer] = useState([]);
    const [dataDegrees, setDataDegrees] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get('tblcatalogo/get/education/data');

            const categorizedData = {
                nivel_instruccion: [],
                centro_formacion_kd: [],
                carrera: [],
                titulos: []
            };

            data.forEach(({ cat_id, cat_tabla, cat_descripcion }) => {
                if (categorizedData[cat_tabla]) {
                    categorizedData[cat_tabla].push({ cat_id, cat_descripcion });
                }
            });

            setDataLevelInst(categorizedData.nivel_instruccion);
            setDataTrCenter(categorizedData.centro_formacion_kd);
            setDataCareer(categorizedData.carrera);
            setDataDegrees(categorizedData.titulos);
        }

        fetchData();
    }, [])

    const formik = useFormik({
        initialValues: {  
            ef_per_id: parseInt(ef_per_id),
            ef_nivel_instruccion: null,
            ef_centro_form: null,
            ef_carrera_especialidad: null,
            ef_titulo_obtenido: null,
            
            ef_nro_titulo: '',
            ef_fecha_ini: '',
            ef_fecha_fin: '',
            ef_anios_estudio: '',
            ef_fecha_titulo_obtenido: '',
            ef_estado: 'V',
        },
        validate: (data) => {
            let errors = {};

            if (!data.ef_nivel_instruccion) {
                errors.ef_nivel_instruccion = 'Este campo es requerido.';
            }
            if (!data.ef_centro_form) {
                errors.ef_centro_form = 'Este campo es requerido.';
            }
            if (!data.ef_carrera_especialidad) {
                errors.ef_carrera_especialidad = 'Este campo es requerido.';
            }
            if (!data.ef_titulo_obtenido) {
                errors.ef_titulo_obtenido = 'Este campo es requerido.';
            }

            if (!data.ef_nro_titulo) {
                errors.ef_nro_titulo = 'Este campo es requerido.';
            }
            if (!data.ef_fecha_ini) {
                errors.ef_fecha_ini = 'Este campo es requerido.';
            }
            if (!data.ef_fecha_fin) {
                errors.ef_fecha_fin = 'Este campo es requerido.';
            }
            if (!data.ef_anios_estudio) {
                errors.ef_anios_estudio = 'Este campo es requerido.';
            }
            if (!data.ef_fecha_titulo_obtenido) {
                errors.ef_fecha_titulo_obtenido = 'Este campo es requerido.';
            }

            return errors;
        },
        onSubmit: (data) => {
            handleSubmit(data);
        }
    });

    const handleSubmit = async(data) => {
        try{    
            const response = await axios.post('tblkdeducacionformal/add', data);

            console.log("Datos enviados con éxito:", response.data);
        }catch(error){
            console.error("Error al actualizar los datos:", error.response?.data || error.message);
        } finally {
            rechargeList();
        }
    }

    const rechargeList = async() => {
        const { data } = await axios.get(`tblkdeducacionformal/index/ef_per_id/${ef_per_id}`);
        addEducation(data);
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    useEffect(() => {
        const fechaInicio = formik.values.ef_fecha_ini;
        const fechaFin = formik.values.ef_fecha_fin;
    
        if (fechaInicio && fechaFin) {
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
    
            if (inicio <= fin) {
                const diferenciaAnios = fin.getFullYear() - inicio.getFullYear();
                formik.setFieldValue("ef_anios_estudio", diferenciaAnios);
            } else {
                formik.setFieldValue("ef_anios_estudio", "");
            }
        }
    }, [formik.values.ef_fecha_ini, formik.values.ef_fecha_fin]);

    const itemTemplate = (option) => {
        return (
            <div className="p-dropdown-item">
                <div>{option.cat_descripcion}</div>
            </div>
        );
    }
  return (
    <>
        <div className='flex justify-content-center'>
            <Avatar image="/images/icons/grade-icon.jpeg" className="mb-5"  shape="circle" style={{ width: "125px", height: "125px" }}  />
        </div>
        <div>
            <p>En el siguiente formulario registra los datos requeridos.</p>
        </div>
        <div className='mt-5'>
            <form onSubmit={formik.handleSubmit}>
                <input type='hidden' value={formik.values.ef_estado} id='ef_estado' name='ef_estado'/>

                <div className='grid p-fluid mt-2'>
                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_nivel_instruccion" className={classNames({ 'p-error': isFormFieldValid('ef_nivel_instruccion') })}>NIVEL DE INSTRUCCIÓN</label>
                        <Dropdown optionLabel='cat_descripcion' optionValue='cat_id' name='ef_nivel_instruccion' id='ef_nivel_instruccion' options={dataLevelInst} value={formik.values.ef_nivel_instruccion} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_nivel_instruccion') })} filter filterBy='cat_descripcion'/>
                        {getFormErrorMessage('ef_nivel_instruccion')}
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_centro_form" className={classNames({ 'p-error': isFormFieldValid('ef_centro_form') })}>CENTRO DE FORMACIÓN</label>
                        <Dropdown optionLabel='cat_descripcion' optionValue='cat_id' name='ef_centro_form' id='ef_centro_form' filter filterBy='cat_descripcion' options={dataTrCenter} value={formik.values.ef_centro_form} 
                        onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_centro_form') })} itemTemplate={itemTemplate} panelClassName="custom-dropdown-panel"/>
                        {getFormErrorMessage('ef_centro_form')}
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_carrera_especialidad" className={classNames({ 'p-error': isFormFieldValid('ef_carrera_especialidad') })}>CARRERA ESPECIALIDAD</label>
                        <Dropdown optionLabel='cat_descripcion' optionValue='cat_id' name='ef_carrera_especialidad' id='ef_carrera_especialidad' filter filterBy='cat_descripcion' options={dataCareer} value={formik.values.ef_carrera_especialidad} 
                        onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_carrera_especialidad') })} itemTemplate={itemTemplate} panelClassName="custom-dropdown-panel"/>
                        {getFormErrorMessage('ef_carrera_especialidad')}
                    </div>
                </div>

                <div className='grid p-fluid mt-2'>
                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_titulo_obtenido" className={classNames({ 'p-error': isFormFieldValid('ef_titulo_obtenido') })}>TITULO OBTENIDO</label>
                        <Dropdown optionLabel='cat_descripcion' optionValue='cat_id' name='ef_titulo_obtenido' id='ef_titulo_obtenido' filter filterBy='cat_descripcion' options={dataDegrees} value={formik.values.ef_titulo_obtenido} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_titulo_obtenido') })} itemTemplate={itemTemplate} panelClassName="custom-dropdown-panel" />
                        {getFormErrorMessage('ef_titulo_obtenido')}
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_nro_titulo" className={classNames({ 'p-error': isFormFieldValid('ef_nro_titulo') })}>Nº TITULO</label>
                        <InputText type='number' id="ef_nro_titulo" name='ef_nro_titulo' value={formik.values.ef_nro_titulo} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_nro_titulo') })}/>
                        {getFormErrorMessage('ef_nro_titulo')}
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_fecha_titulo_obtenido" className={classNames({ 'p-error': isFormFieldValid('ef_fecha_titulo_obtenido') })}>FECHA DEL TÍTULO OBTENIDO</label>
                        <Calendar id="ef_fecha_titulo_obtenido" name="ef_fecha_titulo_obtenido" value={formik.values.ef_fecha_titulo_obtenido} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_fecha_titulo_obtenido') })}/>
                        {getFormErrorMessage('ef_fecha_titulo_obtenido')}

                    </div>
                </div>

                <div className='grid p-fluid mt-2'>
                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_fecha_ini" className={classNames({ 'p-error': isFormFieldValid('ef_fecha_ini') })}>FECHA DE INICIO</label>
                        <Calendar id="ef_fecha_ini" name="ef_fecha_ini" value={formik.values.ef_fecha_ini} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_fecha_ini') })}/>
                        {getFormErrorMessage('ef_fecha_ini')}
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_fecha_fin" className={classNames({ 'p-error': isFormFieldValid('ef_fecha_fin') })}>FECHA FINAL</label>
                        <Calendar id="ef_fecha_fin" name="ef_fecha_fin"  value={formik.values.ef_fecha_fin} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_fecha_fin') })}/>
                        {getFormErrorMessage('ef_fecha_fin')}
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="ef_anios_estudio" className={classNames({ 'p-error': isFormFieldValid('ef_anios_estudio') })}>AÑOS DE ESTUDIO</label>
                        <InputText id="ef_anios_estudio" name="ef_anios_estudio" value={formik.values.ef_anios_estudio} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('ef_anios_estudio') })} readOnly/>
                        {getFormErrorMessage('ef_anios_estudio')}
                    </div>
                </div>

                <div className='flex justify-content-end mt-5'>
                    <Button label='Guardar' type='submit'/>
                </div>
            </form>
        </div>
    </>
  )
}

export default EducatioForm