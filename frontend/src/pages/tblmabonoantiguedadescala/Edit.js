import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const TblmabonoantiguedadescalaEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		ba_id: yup.number().required().label("Ba Id"),
		ba_tiempo_minimo: yup.number().nullable().label("Ba Tiempo Minimo"),
		ba_tiempo_maximo: yup.number().nullable().label("Ba Tiempo Maximo"),
		ba_porcentaje: yup.number().nullable().label("Ba Porcentaje"),
		ba_estado: yup.string().nullable().label("Ba Estado")
	});
	// form default values
	const formDefaultValues = {
		ba_id: '', 
		ba_tiempo_minimo: '', 
		ba_tiempo_maximo: '', 
		ba_porcentaje: '', 
		ba_estado: '', 
	}
	//where page logics resides
	const pageController = useEditPage({ props, formDefaultValues, afterSubmit });
	//destructure and grab what we need
	const { formData, handleSubmit, submitForm, pageReady, loading, saving, apiRequestError, inputClassName } = pageController
	//Event raised on form submit success
	function afterSubmit(response){
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigate(`/tblmabonoantiguedadescala`);
		}
	}
	// loading form data from api
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}
	//display error page 
	if(apiRequestError){
		return (
			<PageRequestError error={apiRequestError} />
		);
	}
	//page is ready when formdata loaded successfully
	if(pageReady){
		return (
<main id="TblmabonoantiguedadescalaEditPage" className="main-page">
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
                    <Title title="Editar"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
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
                        <Formik
                            initialValues={formData}
                            validationSchema={validationSchema} 
                            onSubmit={(values, actions) => {
                            submitForm(values);
                            }
                            }
                            >
                            { (formik) => {
                            return (
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
                                    <Button onClick={(e) => handleSubmit(e, formik)}  type="submit" label="Actualizar" icon="pi pi-send" loading={saving} />
                                </div>
                                }
                            </Form>
                            );
                            }
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
TblmabonoantiguedadescalaEditPage.defaultProps = {
	primaryKey: 'ba_id',
	pageName: 'tblmabonoantiguedadescala',
	apiPath: 'tblmabonoantiguedadescala/edit',
	routeName: 'tblmabonoantiguedadescalaedit',
	submitButtonLabel: "Actualizar",
	formValidationError: "El formulario no es válido",
	formValidationMsg: "Por favor complete el formulario",
	msgTitle: "Actualizar registro",
	msgAfterSave: "Registro actualizado con éxito",
	msgBeforeSave: "",
	showHeader: true,
	showFooter: true,
	redirect: true,
	isSubPage: false
}
export default TblmabonoantiguedadescalaEditPage;
