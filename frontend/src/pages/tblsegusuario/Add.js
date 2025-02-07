import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblsegusuarioAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		us_usuario: yup.string().required().label("Us Usuario"),
		us_contrasena: yup.string().nullable().label("Us Contrasena"),
		us_per_id: yup.number().required().label("Us Per Id"),
		us_estado_clave: yup.number().nullable().label("Us Estado Clave"),
		us_estado_sesion: yup.number().nullable().label("Us Estado Sesion"),
		us_correo_interno: yup.string().required().label("Us Correo Interno"),
		us_nombre_equipo: yup.string().nullable().label("Us Nombre Equipo"),
		us_fecha_inicio: yup.string().nullable().label("Us Fecha Inicio"),
		us_fecha_fin: yup.string().nullable().label("Us Fecha Fin"),
		us_estado: yup.string().required().label("Us Estado"),
		us_usuario_creacion: yup.number().required().label("Us Usuario Creacion"),
		us_fecha_creacion: yup.string().nullable().label("Us Fecha Creacion")
	});
	
	//form default values
	const formDefaultValues = {
		us_usuario: '', 
		us_contrasena: '', 
		us_per_id: '', 
		us_estado_clave: '', 
		us_estado_sesion: '', 
		us_correo_interno: '', 
		us_nombre_equipo: '', 
		us_fecha_inicio: new Date(), 
		us_fecha_fin: new Date(), 
		us_estado: '', 
		us_usuario_creacion: '', 
		us_fecha_creacion: new Date(), 
	}
	
	//page hook where logics resides
	const pageController =  useAddPage({ props, formDefaultValues, afterSubmit });
	
	// destructure and grab what the page needs
	const { formData, resetForm, handleSubmit, submitForm, pageReady, loading, saving, inputClassName } = pageController;
	
	//event raised after form submit
	function afterSubmit(response){
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		resetForm();
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigate(`/tblsegusuario`);
		}
	}
	
	// page loading form data from api
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}
	
	//page has loaded any required data and ready to render
	if(pageReady){
		return (
<main id="TblsegusuarioAddPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container">
            <div className="grid justify-content-between align-items-center">
                { !props.isSubPage && 
                <div className="col-fixed " >
                    <Button onClick={() => app.navigate(-1)} label=""  className="p-button p-button-text " icon="pi pi-arrow-left"  />
                </div>
                }
                <div className="col " >
                    <Title title="Agregar nuevo"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
                </div>
            </div>
        </div>
    </section>
    }
    <section className="page-section " >
        <div className="container">
            <div className="grid ">
                <div className="md:col-9 sm:col-12 comp-grid" >
                    <div >
                        <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={(values, actions) =>submitForm(values)}>
                            {(formik) => 
                            <>
                            <Form className={`${!props.isSubPage ? 'card  ' : ''}`}>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Usuario *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_usuario"  onChange={formik.handleChange}  value={formik.values.us_usuario}   label="Us Usuario" type="text" placeholder="Escribir Us Usuario"        className={inputClassName(formik?.errors?.us_usuario)} />
                                                <ErrorMessage name="us_usuario" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Contrasena 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_contrasena"  onChange={formik.handleChange}  value={formik.values.us_contrasena}   label="Us Contrasena" type="text" placeholder="Escribir Us Contrasena"        className={inputClassName(formik?.errors?.us_contrasena)} />
                                                <ErrorMessage name="us_contrasena" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Per Id *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_per_id"  onChange={formik.handleChange}  value={formik.values.us_per_id}   label="Us Per Id" type="number" placeholder="Escribir Us Per Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.us_per_id)} />
                                                <ErrorMessage name="us_per_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Estado Clave 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_estado_clave"  onChange={formik.handleChange}  value={formik.values.us_estado_clave}   label="Us Estado Clave" type="number" placeholder="Escribir Us Estado Clave"  min={0}  step="any"    className={inputClassName(formik?.errors?.us_estado_clave)} />
                                                <ErrorMessage name="us_estado_clave" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Estado Sesion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_estado_sesion"  onChange={formik.handleChange}  value={formik.values.us_estado_sesion}   label="Us Estado Sesion" type="number" placeholder="Escribir Us Estado Sesion"  min={0}  step="any"    className={inputClassName(formik?.errors?.us_estado_sesion)} />
                                                <ErrorMessage name="us_estado_sesion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Correo Interno *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_correo_interno"  onChange={formik.handleChange}  value={formik.values.us_correo_interno}   label="Us Correo Interno" type="text" placeholder="Escribir Us Correo Interno"        className={inputClassName(formik?.errors?.us_correo_interno)} />
                                                <ErrorMessage name="us_correo_interno" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Nombre Equipo 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_nombre_equipo"  onChange={formik.handleChange}  value={formik.values.us_nombre_equipo}   label="Us Nombre Equipo" type="text" placeholder="Escribir Us Nombre Equipo"        className={inputClassName(formik?.errors?.us_nombre_equipo)} />
                                                <ErrorMessage name="us_nombre_equipo" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Fecha Inicio 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="us_fecha_inicio" showButtonBar className={inputClassName(formik?.errors?.us_fecha_inicio)} dateFormat="yy-mm-dd" value={formik.values.us_fecha_inicio} onChange={formik.handleChange} showIcon        />
                                                <ErrorMessage name="us_fecha_inicio" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Fecha Fin 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="us_fecha_fin" showButtonBar className={inputClassName(formik?.errors?.us_fecha_fin)} dateFormat="yy-mm-dd" value={formik.values.us_fecha_fin} onChange={formik.handleChange} showIcon        />
                                                <ErrorMessage name="us_fecha_fin" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_estado"  onChange={formik.handleChange}  value={formik.values.us_estado}   label="Us Estado" type="text" placeholder="Escribir Us Estado"        className={inputClassName(formik?.errors?.us_estado)} />
                                                <ErrorMessage name="us_estado" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Usuario Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="us_usuario_creacion"  onChange={formik.handleChange}  value={formik.values.us_usuario_creacion}   label="Us Usuario Creacion" type="number" placeholder="Escribir Us Usuario Creacion"  min={0}  step="any"    className={inputClassName(formik?.errors?.us_usuario_creacion)} />
                                                <ErrorMessage name="us_usuario_creacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Us Fecha Creacion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="us_fecha_creacion" value={formik.values.us_fecha_creacion} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.us_fecha_creacion)}        />
                                                <ErrorMessage name="us_fecha_creacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { props.showFooter && 
                                <div className="text-center my-3">
                                    <Button onClick={(e) => handleSubmit(e, formik)} className="p-button-primary" type="submit" label="Entregar" icon="pi pi-send" loading={saving} />
                                </div>
                                }
                            </Form>
                            </>
                            }
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
		);
	}
}

//page props and default values
TblsegusuarioAddPage.defaultProps = {
	primaryKey: 'us_id',
	pageName: 'tblsegusuario',
	apiPath: 'tblsegusuario/add',
	routeName: 'tblsegusuarioadd',
	submitButtonLabel: "Entregar",
	formValidationError: "El formulario no es válido",
	formValidationMsg: "Por favor complete el formulario",
	msgTitle: "Crear registro",
	msgAfterSave: "Grabar agregado exitosamente",
	msgBeforeSave: "",
	showHeader: true,
	showFooter: true,
	redirect: true,
	isSubPage: false
}
export default TblsegusuarioAddPage;
