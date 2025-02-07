import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblrequisitoformacionAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		rf_id: yup.number().required().label("Rf Id"),
		rf_formacion: yup.string().required().label("Rf Formacion"),
		rf_exp_gral: yup.string().nullable().label("Rf Exp Gral"),
		rf_exp_esp: yup.string().nullable().label("Rf Exp Esp"),
		rf_exp_mun: yup.string().nullable().label("Rf Exp Mun"),
		rf_exp_mun_esp: yup.string().nullable().label("Rf Exp Mun Esp"),
		rf_estado: yup.string().nullable().label("Rf Estado")
	});
	
	//form default values
	const formDefaultValues = {
		rf_id: '', 
		rf_formacion: '', 
		rf_exp_gral: '', 
		rf_exp_esp: '', 
		rf_exp_mun: '', 
		rf_exp_mun_esp: '', 
		rf_estado: '', 
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
			app.navigate(`/tblrequisitoformacion`);
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
<main id="TblrequisitoformacionAddPage" className="main-page">
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
                                                Rf Id *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rf_id"  onChange={formik.handleChange}  value={formik.values.rf_id}   label="Rf Id" type="number" placeholder="Escribir Rf Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.rf_id)} />
                                                <ErrorMessage name="rf_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rf Formacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rf_formacion"  onChange={formik.handleChange}  value={formik.values.rf_formacion}   label="Rf Formacion" type="text" placeholder="Escribir Rf Formacion"        className={inputClassName(formik?.errors?.rf_formacion)} />
                                                <ErrorMessage name="rf_formacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rf Exp Gral 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rf_exp_gral"  onChange={formik.handleChange}  value={formik.values.rf_exp_gral}   label="Rf Exp Gral" type="text" placeholder="Escribir Rf Exp Gral"        className={inputClassName(formik?.errors?.rf_exp_gral)} />
                                                <ErrorMessage name="rf_exp_gral" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rf Exp Esp 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rf_exp_esp"  onChange={formik.handleChange}  value={formik.values.rf_exp_esp}   label="Rf Exp Esp" type="text" placeholder="Escribir Rf Exp Esp"        className={inputClassName(formik?.errors?.rf_exp_esp)} />
                                                <ErrorMessage name="rf_exp_esp" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rf Exp Mun 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rf_exp_mun"  onChange={formik.handleChange}  value={formik.values.rf_exp_mun}   label="Rf Exp Mun" type="text" placeholder="Escribir Rf Exp Mun"        className={inputClassName(formik?.errors?.rf_exp_mun)} />
                                                <ErrorMessage name="rf_exp_mun" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rf Exp Mun Esp 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rf_exp_mun_esp"  onChange={formik.handleChange}  value={formik.values.rf_exp_mun_esp}   label="Rf Exp Mun Esp" type="text" placeholder="Escribir Rf Exp Mun Esp"        className={inputClassName(formik?.errors?.rf_exp_mun_esp)} />
                                                <ErrorMessage name="rf_exp_mun_esp" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Rf Estado 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="rf_estado"  onChange={formik.handleChange}  value={formik.values.rf_estado}   label="Rf Estado" type="text" placeholder="Escribir Rf Estado"        className={inputClassName(formik?.errors?.rf_estado)} />
                                                <ErrorMessage name="rf_estado" component="span" className="p-error" />
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
TblrequisitoformacionAddPage.defaultProps = {
	primaryKey: 'rf_id',
	pageName: 'tblrequisitoformacion',
	apiPath: 'tblrequisitoformacion/add',
	routeName: 'tblrequisitoformacionadd',
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
export default TblrequisitoformacionAddPage;
