import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const TblsegusuariorolEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		usrol_us_id: yup.number().nullable().label("Usrol Us Id"),
		usrol_rol_id: yup.number().nullable().label("Usrol Rol Id"),
		usrol_estado: yup.string().required().label("Usrol Estado"),
		usrol_fecha_creacion: yup.string().required().label("Usrol Fecha Creacion"),
		usrol_usuario_creacion: yup.string().required().label("Usrol Usuario Creacion")
	});
	// form default values
	const formDefaultValues = {
		usrol_us_id: '', 
		usrol_rol_id: '', 
		usrol_estado: '', 
		usrol_fecha_creacion: new Date(), 
		usrol_usuario_creacion: '', 
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
			app.navigate(`/tblsegusuariorol`);
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
<main id="TblsegusuariorolEditPage" className="main-page">
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
                                                Usrol Us Id 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="usrol_us_id"  onChange={formik.handleChange}  value={formik.values.usrol_us_id}   label="Usrol Us Id" type="number" placeholder="Escribir Usrol Us Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.usrol_us_id)} />
                                                <ErrorMessage name="usrol_us_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Usrol Rol Id 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="usrol_rol_id"  onChange={formik.handleChange}  value={formik.values.usrol_rol_id}   label="Usrol Rol Id" type="number" placeholder="Escribir Usrol Rol Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.usrol_rol_id)} />
                                                <ErrorMessage name="usrol_rol_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Usrol Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="usrol_estado"  onChange={formik.handleChange}  value={formik.values.usrol_estado}   label="Usrol Estado" type="text" placeholder="Escribir Usrol Estado"        className={inputClassName(formik?.errors?.usrol_estado)} />
                                                <ErrorMessage name="usrol_estado" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Usrol Fecha Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="usrol_fecha_creacion" value={formik.values.usrol_fecha_creacion} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.usrol_fecha_creacion)}        />
                                                <ErrorMessage name="usrol_fecha_creacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Usrol Usuario Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="usrol_usuario_creacion"  onChange={formik.handleChange}  value={formik.values.usrol_usuario_creacion}   label="Usrol Usuario Creacion" type="text" placeholder="Escribir Usrol Usuario Creacion"        className={inputClassName(formik?.errors?.usrol_usuario_creacion)} />
                                                <ErrorMessage name="usrol_usuario_creacion" component="span" className="p-error" />
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
TblsegusuariorolEditPage.defaultProps = {
	primaryKey: 'usrol_id',
	pageName: 'tblsegusuariorol',
	apiPath: 'tblsegusuariorol/edit',
	routeName: 'tblsegusuarioroledit',
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
export default TblsegusuariorolEditPage;
