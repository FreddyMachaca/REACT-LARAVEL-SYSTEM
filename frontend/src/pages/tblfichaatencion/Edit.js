import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const TblfichaatencionEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		fic_correlativo: yup.number().nullable().label("Fic Correlativo"),
		fic_atencionsolicitud: yup.string().nullable().label("Fic Atencionsolicitud"),
		fic_atencioninicio: yup.string().nullable().label("Fic Atencioninicio"),
		fic_atencionfinal: yup.string().nullable().label("Fic Atencionfinal"),
		fic_usr_id: yup.number().nullable().label("Fic Usr Id"),
		fic_usrname: yup.string().nullable().label("Fic Usrname"),
		fic_estado: yup.string().nullable().label("Fic Estado")
	});
	// form default values
	const formDefaultValues = {
		fic_correlativo: '', 
		fic_atencionsolicitud: new Date(), 
		fic_atencioninicio: new Date(), 
		fic_atencionfinal: new Date(), 
		fic_usr_id: '', 
		fic_usrname: '', 
		fic_estado: '', 
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
			app.navigate(`/tblfichaatencion`);
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
<main id="TblfichaatencionEditPage" className="main-page">
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
                                                Fic Correlativo 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="fic_correlativo"  onChange={formik.handleChange}  value={formik.values.fic_correlativo}   label="Fic Correlativo" type="number" placeholder="Escribir Fic Correlativo"  min={0}  step="any"    className={inputClassName(formik?.errors?.fic_correlativo)} />
                                                <ErrorMessage name="fic_correlativo" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Fic Atencionsolicitud 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="fic_atencionsolicitud" value={formik.values.fic_atencionsolicitud} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.fic_atencionsolicitud)}        />
                                                <ErrorMessage name="fic_atencionsolicitud" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Fic Atencioninicio 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="fic_atencioninicio" value={formik.values.fic_atencioninicio} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.fic_atencioninicio)}        />
                                                <ErrorMessage name="fic_atencioninicio" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Fic Atencionfinal 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="fic_atencionfinal" value={formik.values.fic_atencionfinal} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.fic_atencionfinal)}        />
                                                <ErrorMessage name="fic_atencionfinal" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Fic Usr Id 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="fic_usr_id"  onChange={formik.handleChange}  value={formik.values.fic_usr_id}   label="Fic Usr Id" type="number" placeholder="Escribir Fic Usr Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.fic_usr_id)} />
                                                <ErrorMessage name="fic_usr_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Fic Usrname 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputTextarea name="fic_usrname"  className={inputClassName(formik?.errors?.fic_usrname)}   value={formik.values.fic_usrname} placeholder="Escribir Fic Usrname" onChange={formik.handleChange}   >
                                                </InputTextarea>
                                                <ErrorMessage name="fic_usrname" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Fic Estado 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="fic_estado"  onChange={formik.handleChange}  value={formik.values.fic_estado}   label="Fic Estado" type="text" placeholder="Escribir Fic Estado"        className={inputClassName(formik?.errors?.fic_estado)} />
                                                <ErrorMessage name="fic_estado" component="span" className="p-error" />
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
TblfichaatencionEditPage.defaultProps = {
	primaryKey: 'fic_id',
	pageName: 'tblfichaatencion',
	apiPath: 'tblfichaatencion/edit',
	routeName: 'tblfichaatencionedit',
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
export default TblfichaatencionEditPage;
