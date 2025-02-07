import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblinstitucionesAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		it_nombre: yup.string().nullable().label("It Nombre"),
		it_depto: yup.number().nullable().label("It Depto"),
		it_provincia: yup.number().nullable().label("It Provincia"),
		it_ciudad: yup.number().nullable().label("It Ciudad"),
		it_observacion: yup.string().nullable().label("It Observacion"),
		it_estado: yup.string().nullable().label("It Estado")
	});
	
	//form default values
	const formDefaultValues = {
		it_nombre: '', 
		it_depto: '', 
		it_provincia: '', 
		it_ciudad: '', 
		it_observacion: '', 
		it_estado: '', 
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
			app.navigate(`/tblinstituciones`);
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
<main id="TblinstitucionesAddPage" className="main-page">
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
                                                It Nombre 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="it_nombre"  onChange={formik.handleChange}  value={formik.values.it_nombre}   label="It Nombre" type="text" placeholder="Escribir It Nombre"        className={inputClassName(formik?.errors?.it_nombre)} />
                                                <ErrorMessage name="it_nombre" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                It Depto 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="it_depto"  onChange={formik.handleChange}  value={formik.values.it_depto}   label="It Depto" type="number" placeholder="Escribir It Depto"  min={0}  step="any"    className={inputClassName(formik?.errors?.it_depto)} />
                                                <ErrorMessage name="it_depto" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                It Provincia 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="it_provincia"  onChange={formik.handleChange}  value={formik.values.it_provincia}   label="It Provincia" type="number" placeholder="Escribir It Provincia"  min={0}  step="any"    className={inputClassName(formik?.errors?.it_provincia)} />
                                                <ErrorMessage name="it_provincia" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                It Ciudad 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="it_ciudad"  onChange={formik.handleChange}  value={formik.values.it_ciudad}   label="It Ciudad" type="number" placeholder="Escribir It Ciudad"  min={0}  step="any"    className={inputClassName(formik?.errors?.it_ciudad)} />
                                                <ErrorMessage name="it_ciudad" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                It Observacion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="it_observacion"  onChange={formik.handleChange}  value={formik.values.it_observacion}   label="It Observacion" type="text" placeholder="Escribir It Observacion"        className={inputClassName(formik?.errors?.it_observacion)} />
                                                <ErrorMessage name="it_observacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                It Estado 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="it_estado"  onChange={formik.handleChange}  value={formik.values.it_estado}   label="It Estado" type="text" placeholder="Escribir It Estado"        className={inputClassName(formik?.errors?.it_estado)} />
                                                <ErrorMessage name="it_estado" component="span" className="p-error" />
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
TblinstitucionesAddPage.defaultProps = {
	primaryKey: 'it_id',
	pageName: 'tblinstituciones',
	apiPath: 'tblinstituciones/add',
	routeName: 'tblinstitucionesadd',
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
export default TblinstitucionesAddPage;
