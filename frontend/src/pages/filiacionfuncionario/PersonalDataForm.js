
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import axios from 'axios';

function PersonalDataForm({data, perd_per_id}) {
    const [dataCity, setDataCity] = useState([]);
    const [dataZone, setDataZone] = useState([]);
    const [dataVia, setDataVia] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const { data } = await axios.get('tblcatalogo/get/domicilio/data');

                const cityData = [];
                const zoneData = [];
                const viaData = [];

                data.forEach(item => {
                    const dataFormated = {
                        cat_id: item.cat_id,
                        cat_descripcion: item.cat_descripcion,
                    }

                    if(item.cat_tabla === 'ciudad_localidad') cityData.push(dataFormated);
                    else if(item.cat_tabla === 'zona') zoneData.push(dataFormated);
                    else if(item.cat_tabla === 'tipo_via') viaData.push(dataFormated);
                })

                setDataCity(cityData);
                setDataZone(zoneData);
                setDataVia(viaData);
                
            } catch(error){
                console.log(`Error al obtener datos ${error}`)
            }
        }

        fetchData();
    }, []);

    const onSubmit = async (values) => {
        values.perd_per_id = perd_per_id;
        console.log(values)
        try {
            const cleanedData = Object.fromEntries(
                Object.entries(values).map(([key, value]) => [key, value === "" ? null : value])
            );
    
            const response = await axios.post(`tblpersonadomicilio/edit/${values.perd_per_id}`, cleanedData);
    
            console.log("Datos actualizados con éxito:", response.data);
        } catch (error) {
            console.error("Error al actualizar los datos:", error.response?.data || error.message);
        }
    };

    const formik = useFormik({
        initialValues: {
            perd_per_id: null,
            perd_ciudad_residencia: null, 
            perd_zona: null, 
            perd_tipo_via: null,

            perd_descripcion_via: '',            
            perd_numero: null,            

            perd_celular: '',
            perd_email_personal: '',

            perd_tel_emergencia: '',
            perd_dir_emergencia: '',
            perd_fam_emergencia: '',

            perd_edificio: '',
            perd_bloque: '',
            perd_piso: '',
            perd_dpto: '',
            perd_telefono: null,
            perd_email_trabajo: '',
        },
        validate: (data) => {
            let errors = {};

            if (!data.perd_ciudad_residencia) {
                errors.perd_ciudad_residencia = 'Este campo es requerido.';
            }
            if (!data.perd_zona) {
                errors.perd_zona = 'Este campo es requerido.';
            }
            if (!data.perd_tipo_via) {
                errors.perd_tipo_via = 'Este campo es requerido.';
            }
            if (!data.perd_tel_emergencia) {
                errors.perd_tel_emergencia = 'Este campo es requerido.';
            }
            if (!data.perd_dir_emergencia) {
                errors.perd_dir_emergencia = 'Este campo es requerido.';
            }
            if (!data.perd_fam_emergencia) {
                errors.perd_fam_emergencia = 'Este campo es requerido.';
            }
            if (!data.perd_celular) {
                errors.perd_celular = 'Este campo es requerido.';
            }
            if (!data.perd_email_personal) {
                errors.perd_email_personal = 'Este campo es requerido.';
            }
            if (!data.perd_descripcion_via) {
                errors.perd_descripcion_via = 'Este campo es requerido.';
            }
            if (!data.perd_numero) {
                errors.perd_numero = 'Este campo es requerido.';
            }

            return errors;
        },
        onSubmit
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    useEffect(() => {
        if (data) {
            formik.setValues({
                perd_per_id: parseInt(perd_per_id),
                perd_ciudad_residencia: data.perd_ciudad_residencia || null, 
                perd_zona: data.perd_zona || null, 
                perd_tipo_via: data.perd_tipo_via || null,
                perd_descripcion_via: data.perd_descripcion_via || '',            
                perd_numero: parseInt(data.perd_numero) || '',            
                perd_celular: data.perd_celular || '',
                perd_email_personal: data.perd_email_personal || '',
                perd_tel_emergencia: data.perd_tel_emergencia || '',
                perd_dir_emergencia: data.perd_dir_emergencia || '',
                perd_fam_emergencia: data.perd_fam_emergencia || '',
                perd_edificio: data.perd_edificio || '',
                perd_bloque: data.perd_bloque || '',
                perd_piso: data.perd_piso || '',
                perd_dpto: data.perd_dpto || '',
                perd_telefono: data.perd_telefono || '',
                perd_email_trabajo: data.perd_email_trabajo || '',
            });
        }
    }, [data]);

  return (
    <>
        <form onSubmit={formik.handleSubmit}>
            <div className='grid p-fluid mb-2'>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_ciudad_residencia" className={classNames({ 'p-error': isFormFieldValid('perd_ciudad_residencia') })}>CIUDAD/LOCALIDAD</label>
                    <Dropdown id='perd_ciudad_residencia' name='perd_ciudad_residencia' value={formik.values.perd_ciudad_residencia} onChange={formik.handleChange} optionLabel="cat_descripcion" optionValue='cat_id' options={dataCity} filter filterBy='cat_descripcion'/>
                    {getFormErrorMessage('perd_ciudad_residencia')}
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_zona" className={classNames({ 'p-error': isFormFieldValid('perd_zona') })}>ZONA</label>
                    <Dropdown id='perd_zona' name='perd_zona' optionLabel="cat_descripcion" optionValue='cat_id' options={dataZone}
                    value={formik.values.perd_zona} onChange={formik.handleChange} filter filterBy='cat_descripcion'/>
                    {getFormErrorMessage('perd_zona')}
                </div>
                <div className="col-12 md:col-2">
                    <label htmlFor="perd_tipo_via" className={classNames({ 'p-error': isFormFieldValid('perd_tipo_via') })}>TIPO VÍA</label>
                    <Dropdown optionLabel="cat_descripcion" optionValue='cat_id' id='perd_tipo_via' name='perd_tipo_via' options={dataVia} 
                    value={formik.values.perd_tipo_via} onChange={formik.handleChange} filter filterBy='cat_descripcion'/>
                    {getFormErrorMessage('perd_tipo_via')}
                </div>
                <div className="col-12 md:col-2">
                    <label htmlFor="perd_descripcion_via" className={classNames({ 'p-error': isFormFieldValid('perd_descripcion_via') })}>NOMBRE VÍA</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-home" />
                        <InputText id="perd_descripcion_via" name='perd_descripcion_via' value={formik.values.perd_descripcion_via} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('perd_descripcion_via') })}/>
                    </span>
                    {getFormErrorMessage('perd_descripcion_via')}
                </div>
                <div className="col-12 md:col-2">
                    <label htmlFor="perd_numero" className={classNames({ 'p-error': isFormFieldValid('perd_numero') })}>NÚMERO</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-home" />
                        <InputText type='number' id="perd_numero" name='perd_numero' value={formik.values.perd_numero} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('perd_numero') })}/>
                    </span>
                    {getFormErrorMessage('perd_numero')}
                </div>
            </div>

            <div className='grid p-fluid mb-2'>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_edificio" className="block">EDIFICIO</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-home" />
                        <InputText id="perd_edificio" name='perd_edificio' value={formik.values.perd_edificio} onChange={formik.handleChange}/>
                    </span>
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_bloque" className="block">BLOQUE</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-home" />
                        <InputText id="perd_bloque" name='perd_bloque' value={formik.values.perd_bloque} onChange={formik.handleChange}/>
                    </span>
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_piso" className="block">PISO</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-home" />
                        <InputText id="perd_piso" name='perd_piso' value={formik.values.perd_piso} onChange={formik.handleChange}/>
                    </span>
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_dpto" className="block">DEPARTAMENTO</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-home" />
                        <InputText id="perd_dpto" name='perd_dpto' value={formik.values.perd_dpto} onChange={formik.handleChange}/>
                    </span>
                </div>
            </div>

            <div className='grid p-fluid mb-2'>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_telefono">TELÉFONO</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-mobile" />
                        <InputText type='number' id="perd_telefono" name='perd_telefono' value={formik.values.perd_telefono} onChange={formik.handleChange}/>
                    </span>
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_celular" className={classNames({ 'p-error': isFormFieldValid('perd_celular') })}>CELULAR</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-mobile" />
                        <InputText type='number' id="perd_celular" name='perd_celular' value={formik.values.perd_celular} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('perd_celular') })}/>
                    </span>
                    {getFormErrorMessage('perd_celular')}
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_email_trabajo">EMAIL TRABAJO</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-envelope" />
                        <InputText type='email' id="perd_email_trabajo" name='perd_email_trabajo' value={formik.values.perd_email_trabajo} onChange={formik.handleChange}/>
                    </span>
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_email_personal" className={classNames({ 'p-error': isFormFieldValid('perd_email_personal') })}>EMAIL PERSONAL</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-envelope" />
                        <InputText type='email' id="perd_email_personal" name='perd_email_personal' value={formik.values.perd_email_personal} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('perd_email_personal') })}/>
                    </span>
                    {getFormErrorMessage('perd_email_personal')}
                </div>
            </div>

            <div className='grid p-fluid mb-2'>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_fam_emergencia" className={classNames({ 'p-error': isFormFieldValid('perd_fam_emergencia') })}>EN CASO DE EMERGENCIA LLAMAR</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-phone" />
                        <InputText type='number' id="perd_fam_emergencia" name='perd_fam_emergencia' value={formik.values.perd_fam_emergencia} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('perd_fam_emergencia') })} />
                    </span>
                    {getFormErrorMessage('perd_fam_emergencia')}
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_dir_emergencia" className={classNames({ 'p-error': isFormFieldValid('perd_dir_emergencia') })}>DIRECCIÓN DE EMERGENCIA</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-map-marker" />
                        <InputText id="perd_dir_emergencia" name='perd_dir_emergencia' value={formik.values.perd_dir_emergencia} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('perd_dir_emergencia') })} />
                    </span>
                    {getFormErrorMessage('perd_dir_emergencia')}
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="perd_tel_emergencia" className={classNames({ 'p-error': isFormFieldValid('perd_tel_emergencia') })}>TELÉFONO DE EMERGENCIA</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-mobile" />
                        <InputText type='number' id="perd_tel_emergencia" name="perd_tel_emergencia" value={formik.values.perd_tel_emergencia} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('perd_tel_emergencia') })}/>
                    </span>
                    {getFormErrorMessage('perd_tel_emergencia')}
                </div>
                <div className="col-12 md:col-3">
                    <label htmlFor="per_serie_libreta_militar">Nº LIBRETA DE SERVICIO MILITAR</label>
                    <span className="p-input-icon-left">
                        <i className="pi pi-file-edit" />
                        <InputText type='number' id="per_serie_libreta_militar" name='per_serie_libreta_militar' value={formik.values.per_serie_libreta_militar} onChange={formik.handleChange}/>
                    </span>
                </div>
            </div>
                
            <div className='flex justify-content-end'>
            <Button className='w-2 text-center' type='submit' label='Guardar'/>
            </div>
        </form>
    </>
  )
}

export default PersonalDataForm