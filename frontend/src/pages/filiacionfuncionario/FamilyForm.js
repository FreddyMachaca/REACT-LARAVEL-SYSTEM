import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import axios from 'axios'

function FamilyForm({perd_per_id, addMember}) {
    const [dataRelationship, setDataRelationship] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: {records} } = await axios.get(`tblcatalogo/index/cat_tabla/parentesco`);
            setDataRelationship(
                records.filter(item => item.cat_estado === 'V')
                .map(item => ({
                    cat_id: item.cat_id,
                    cat_descripcion: item.cat_descripcion,
                }))
            );
        }
        fetchData();
    }, []);

    const onSubmit = async (values) => {
        try {
            const cleanedData = Object.fromEntries(
                Object.entries(values).map(([key, value]) => [key, value === "" ? null : value])
            );
    
            const response = await axios.post(`tblpersonafamiliares/add`, cleanedData);
    
            console.log("Datos actualizados con éxito:", response.data);
        } catch (error) {
            console.error("Error al actualizar los datos:", error.response?.data || error.message);
        } finally{
            rechargeList();
        }
    };

    const rechargeList = async() => {
        const { data } = await axios.get(`tblpersonafamiliares/index/pf_per_id/${perd_per_id}`);
        addMember(data);
    }

    const formik = useFormik({
        initialValues: {
            pf_per_id: parseInt(perd_per_id),
            pf_ap_esposo: '',
            pf_paterno: '',            
            pf_materno: '',            
            pf_nombres: '',     
            
            pf_fecha_nac: '',
            pf_tipo_parentesco: null,
            pf_estado: 'V',
        },
        enableReinitialize: true,   
        validate: (data) => {
            let errors = {};

            if (!data.pf_materno) {
                errors.pf_materno = 'Este campo es requerido.';
            }
            if (!data.pf_nombres) {
                errors.pf_nombres = 'Este campo es requerido.';
            }
            if (!data.pf_fecha_nac) {
                errors.pf_fecha_nac = 'Este campo es requerido.';
            }
            if (!data.pf_tipo_parentesco) {
                errors.pf_tipo_parentesco = 'Este campo es requerido.';
            }

            return errors;
        },
        onSubmit
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

  return (
    <>
        <div className='flex justify-content-center'>
            <Avatar image="/images/icons/family-icon.jpeg" className="my-5"  shape="circle" style={{ width: "125px", height: "125px" }}  />
        </div>
        <div>
            <p>En el siguiente formulario registra los datos requeridos.</p>
        </div>
        <div className='mt-5'>
            <form onSubmit={formik.handleSubmit}>
                <input type='hidden' value={formik.values.pf_estado} id='pf_estado' name='pf_estado'/>
                <div className='grid p-fluid mt-2'>
                    <div className="col-12 md:col-4">
                        <label htmlFor="pf_paterno" >APELLIDO PATERNO</label>
                        <InputText id="pf_paterno" name="pf_paterno" value={formik.values.pf_paterno} onChange={formik.handleChange}/>
                    </div>


                    <div className="col-12 md:col-4">
                        <label htmlFor="pf_materno" className={classNames({ 'p-error': isFormFieldValid('pf_materno') })}>APELLIDO MATERNO</label>
                        <InputText id="pf_materno" name="pf_materno"  value={formik.values.pf_materno} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('pf_materno') })}/>
                        {getFormErrorMessage('pf_materno')}
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="pf_nombres" className={classNames({ 'p-error': isFormFieldValid('pf_nombres') })}>NOMBRES</label>
                        <InputText id="pf_nombres" name="pf_nombres" value={formik.values.pf_nombres} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('pf_nombres') })}/>
                        {getFormErrorMessage('pf_nombres')}
                    </div>
                </div>

                <div className='grid p-fluid mt-2'>
                    <div className="col-12 md:col-4">
                        <label htmlFor="pf_ap_esposo">APELLIDO ESPOSO</label>
                        <InputText id="pf_ap_esposo" name="pf_ap_esposo" value={formik.values.pf_ap_esposo} onChange={formik.handleChange}/>
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="pf_fecha_nac" className={classNames({ 'p-error': isFormFieldValid('pf_fecha_nac') })}>FECHA NACIMIENTO</label>
                        <Calendar id="pf_fecha_nac" name="pf_fecha_nac" value={formik.values.pf_fecha_nac} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('pf_fecha_nac') })}/>
                        {getFormErrorMessage('pf_fecha_nac')}
                    </div>

                    <div className="col-12 md:col-4">
                        <label htmlFor="pf_tipo_parentesco" className={classNames({ 'p-error': isFormFieldValid('pf_tipo_parentesco') })}>TIPO PARENTESTO</label>
                        <Dropdown id='pf_tipo_parentesco' name='pf_tipo_parentesco' optionLabel='cat_descripcion' options={dataRelationship} value={formik.values.pf_tipo_parentesco} onChange={formik.handleChange} optionValue='cat_id' filter filterBy='cat_descripcion'/>
                        {getFormErrorMessage('pf_tipo_parentesco')}
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

export default FamilyForm