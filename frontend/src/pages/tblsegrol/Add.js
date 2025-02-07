import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblsegrolAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		rol_descripcion: yup.string().nullable().label("Rol Descripcion"),
		rol_estado: yup.string().required().label("Rol Estado"),
		rol_fecha_creacion: yup.string().required().label("Rol Fecha Creacion"),
		rol_usuario_creacion: yup.string().required().label("Rol Usuario Creacion")
	});
	
	//form default values
	const formDefaultValues = {
		rol_descripcion: '', 
		rol_estado: '', 
		rol_fecha_creacion: new Date(), 
		rol_usuario_creacion: '', 
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
			app.navigate(`/tblsegrol`);
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
<main id="TblsegrolAddPage" className="main-page">
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
                                                Rol Descripcion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rol_descripcion"  onChange={formik.handleChange}  value={formik.values.rol_descripcion}   label="Rol Descripcion" type="text" placeholder="Escribir Rol Descripcion"        className={inputClassName(formik?.errors?.rol_descripcion)} />
                                                <ErrorMessage name="rol_descripcion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rol Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rol_estado"  onChange={formik.handleChange}  value={formik.values.rol_estado}   label="Rol Estado" type="text" placeholder="Escribir Rol Estado"        className={inputClassName(formik?.errors?.rol_estado)} />
                                                <ErrorMessage name="rol_estado" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rol Fecha Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="rol_fecha_creacion" value={formik.values.rol_fecha_creacion} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.rol_fecha_creacion)}        />
                                                <ErrorMessage name="rol_fecha_creacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rol Usuario Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rol_usuario_creacion"  onChange={formik.handleChange}  value={formik.values.rol_usuario_creacion}   label="Rol Usuario Creacion" type="text" placeholder="Escribir Rol Usuario Creacion"        className={inputClassName(formik?.errors?.rol_usuario_creacion)} />
                                                <ErrorMessage name="rol_usuario_creacion" component="span" className="p-error" />
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
TblsegrolAddPage.defaultProps = {
	primaryKey: 'rol_id',
	pageName: 'tblsegrol',
	apiPath: 'tblsegrol/add',
	routeName: 'tblsegroladd',
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
export default TblsegrolAddPage;
