import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblmabonoantiguedadescalaAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		ba_id: yup.number().required().label("Ba Id"),
		ba_tiempo_minimo: yup.number().nullable().label("Ba Tiempo Minimo"),
		ba_tiempo_maximo: yup.number().nullable().label("Ba Tiempo Maximo"),
		ba_porcentaje: yup.number().nullable().label("Ba Porcentaje"),
		ba_estado: yup.string().nullable().label("Ba Estado")
	});
	
	//form default values
	const formDefaultValues = {
		ba_id: '', 
		ba_tiempo_minimo: '', 
		ba_tiempo_maximo: '', 
		ba_porcentaje: '', 
		ba_estado: '', 
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
			app.navigate(`/tblmabonoantiguedadescala`);
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
<main id="TblmabonoantiguedadescalaAddPage" className="main-page">
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
                                                Ba Id *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ba_id"  onChange={formik.handleChange}  value={formik.values.ba_id}   label="Ba Id" type="number" placeholder="Escribir Ba Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.ba_id)} />
                                                <ErrorMessage name="ba_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ba Tiempo Minimo 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ba_tiempo_minimo"  onChange={formik.handleChange}  value={formik.values.ba_tiempo_minimo}   label="Ba Tiempo Minimo" type="number" placeholder="Escribir Ba Tiempo Minimo"  min={0}  step="any"    className={inputClassName(formik?.errors?.ba_tiempo_minimo)} />
                                                <ErrorMessage name="ba_tiempo_minimo" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ba Tiempo Maximo 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ba_tiempo_maximo"  onChange={formik.handleChange}  value={formik.values.ba_tiempo_maximo}   label="Ba Tiempo Maximo" type="number" placeholder="Escribir Ba Tiempo Maximo"  min={0}  step="any"    className={inputClassName(formik?.errors?.ba_tiempo_maximo)} />
                                                <ErrorMessage name="ba_tiempo_maximo" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ba Porcentaje 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ba_porcentaje"  onChange={formik.handleChange}  value={formik.values.ba_porcentaje}   label="Ba Porcentaje" type="number" placeholder="Escribir Ba Porcentaje"  min={0}  step={0.1}    className={inputClassName(formik?.errors?.ba_porcentaje)} />
                                                <ErrorMessage name="ba_porcentaje" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ba Estado 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ba_estado"  onChange={formik.handleChange}  value={formik.values.ba_estado}   label="Ba Estado" type="text" placeholder="Escribir Ba Estado"        className={inputClassName(formik?.errors?.ba_estado)} />
                                                <ErrorMessage name="ba_estado" component="span" className="p-error" />
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
TblmabonoantiguedadescalaAddPage.defaultProps = {
	primaryKey: 'ba_id',
	pageName: 'tblmabonoantiguedadescala',
	apiPath: 'tblmabonoantiguedadescala/add',
	routeName: 'tblmabonoantiguedadescalaadd',
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
export default TblmabonoantiguedadescalaAddPage;
