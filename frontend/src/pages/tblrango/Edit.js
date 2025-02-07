import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const TblrangoEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		ra_id: yup.number().required().label("Ra Id"),
		ra_minimo: yup.number().nullable().label("Ra Minimo"),
		ra_maximo: yup.number().nullable().label("Ra Maximo"),
		ra_valor: yup.number().nullable().label("Ra Valor"),
		ra_tabla: yup.string().nullable().label("Ra Tabla"),
		ra_estado: yup.string().nullable().label("Ra Estado")
	});
	// form default values
	const formDefaultValues = {
		ra_id: '', 
		ra_minimo: '', 
		ra_maximo: '', 
		ra_valor: '', 
		ra_tabla: '', 
		ra_estado: '', 
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
			app.navigate(`/tblrango`);
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
<main id="TblrangoEditPage" className="main-page">
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
                                                Ra Id *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ra_id"  onChange={formik.handleChange}  value={formik.values.ra_id}   label="Ra Id" type="number" placeholder="Escribir Ra Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.ra_id)} />
                                                <ErrorMessage name="ra_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ra Minimo 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ra_minimo"  onChange={formik.handleChange}  value={formik.values.ra_minimo}   label="Ra Minimo" type="number" placeholder="Escribir Ra Minimo"  min={0}  step="any"    className={inputClassName(formik?.errors?.ra_minimo)} />
                                                <ErrorMessage name="ra_minimo" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ra Maximo 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ra_maximo"  onChange={formik.handleChange}  value={formik.values.ra_maximo}   label="Ra Maximo" type="number" placeholder="Escribir Ra Maximo"  min={0}  step="any"    className={inputClassName(formik?.errors?.ra_maximo)} />
                                                <ErrorMessage name="ra_maximo" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ra Valor 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ra_valor"  onChange={formik.handleChange}  value={formik.values.ra_valor}   label="Ra Valor" type="number" placeholder="Escribir Ra Valor"  min={0}  step={0.1}    className={inputClassName(formik?.errors?.ra_valor)} />
                                                <ErrorMessage name="ra_valor" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ra Tabla 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ra_tabla"  onChange={formik.handleChange}  value={formik.values.ra_tabla}   label="Ra Tabla" type="text" placeholder="Escribir Ra Tabla"        className={inputClassName(formik?.errors?.ra_tabla)} />
                                                <ErrorMessage name="ra_tabla" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ra Estado 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ra_estado"  onChange={formik.handleChange}  value={formik.values.ra_estado}   label="Ra Estado" type="text" placeholder="Escribir Ra Estado"        className={inputClassName(formik?.errors?.ra_estado)} />
                                                <ErrorMessage name="ra_estado" component="span" className="p-error" />
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
TblrangoEditPage.defaultProps = {
	primaryKey: 'ra_id',
	pageName: 'tblrango',
	apiPath: 'tblrango/edit',
	routeName: 'tblrangoedit',
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
export default TblrangoEditPage;
