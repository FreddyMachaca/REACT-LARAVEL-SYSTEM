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
const TblglosaEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		gl_valor_pk: yup.string().required().label("Gl Valor Pk"),
		gl_nombre_pk: yup.string().required().label("Gl Nombre Pk"),
		gl_tabla: yup.string().required().label("Gl Tabla"),
		gl_tipo_mov: yup.number().required().label("Gl Tipo Mov"),
		gl_tipo_doc: yup.number().required().label("Gl Tipo Doc"),
		gl_glosa: yup.string().required().label("Gl Glosa"),
		gl_numero_doc: yup.string().nullable().label("Gl Numero Doc"),
		gl_fecha_doc: yup.string().required().label("Gl Fecha Doc"),
		gl_estado: yup.string().required().label("Gl Estado"),
		gl_usuario: yup.number().nullable().label("Gl Usuario"),
		gl_fecha_registro: yup.string().nullable().label("Gl Fecha Registro")
	});
	// form default values
	const formDefaultValues = {
		gl_valor_pk: '', 
		gl_nombre_pk: '', 
		gl_tabla: '', 
		gl_tipo_mov: '', 
		gl_tipo_doc: '', 
		gl_glosa: '', 
		gl_numero_doc: '', 
		gl_fecha_doc: new Date(), 
		gl_estado: '', 
		gl_usuario: '', 
		gl_fecha_registro: new Date(), 
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
			app.navigate(`/tblglosa`);
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
<main id="TblglosaEditPage" className="main-page">
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
                                                Gl Valor Pk *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="gl_valor_pk"  onChange={formik.handleChange}  value={formik.values.gl_valor_pk}   label="Gl Valor Pk" type="text" placeholder="Escribir Gl Valor Pk"        className={inputClassName(formik?.errors?.gl_valor_pk)} />
                                                <ErrorMessage name="gl_valor_pk" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Nombre Pk *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="gl_nombre_pk"  onChange={formik.handleChange}  value={formik.values.gl_nombre_pk}   label="Gl Nombre Pk" type="text" placeholder="Escribir Gl Nombre Pk"        className={inputClassName(formik?.errors?.gl_nombre_pk)} />
                                                <ErrorMessage name="gl_nombre_pk" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Tabla *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="gl_tabla"  onChange={formik.handleChange}  value={formik.values.gl_tabla}   label="Gl Tabla" type="text" placeholder="Escribir Gl Tabla"        className={inputClassName(formik?.errors?.gl_tabla)} />
                                                <ErrorMessage name="gl_tabla" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Tipo Mov *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="gl_tipo_mov"  onChange={formik.handleChange}  value={formik.values.gl_tipo_mov}   label="Gl Tipo Mov" type="number" placeholder="Escribir Gl Tipo Mov"  min={0}  step="any"    className={inputClassName(formik?.errors?.gl_tipo_mov)} />
                                                <ErrorMessage name="gl_tipo_mov" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Tipo Doc *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="gl_tipo_doc"  onChange={formik.handleChange}  value={formik.values.gl_tipo_doc}   label="Gl Tipo Doc" type="number" placeholder="Escribir Gl Tipo Doc"  min={0}  step="any"    className={inputClassName(formik?.errors?.gl_tipo_doc)} />
                                                <ErrorMessage name="gl_tipo_doc" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Glosa *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputTextarea name="gl_glosa"  className={inputClassName(formik?.errors?.gl_glosa)}   value={formik.values.gl_glosa} placeholder="Escribir Gl Glosa" onChange={formik.handleChange}   >
                                                </InputTextarea>
                                                <ErrorMessage name="gl_glosa" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Numero Doc 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="gl_numero_doc"  onChange={formik.handleChange}  value={formik.values.gl_numero_doc}   label="Gl Numero Doc" type="text" placeholder="Escribir Gl Numero Doc"        className={inputClassName(formik?.errors?.gl_numero_doc)} />
                                                <ErrorMessage name="gl_numero_doc" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Fecha Doc *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="gl_fecha_doc" value={formik.values.gl_fecha_doc} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.gl_fecha_doc)}        />
                                                <ErrorMessage name="gl_fecha_doc" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="gl_estado"  onChange={formik.handleChange}  value={formik.values.gl_estado}   label="Gl Estado" type="text" placeholder="Escribir Gl Estado"        className={inputClassName(formik?.errors?.gl_estado)} />
                                                <ErrorMessage name="gl_estado" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Usuario 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="gl_usuario"  onChange={formik.handleChange}  value={formik.values.gl_usuario}   label="Gl Usuario" type="number" placeholder="Escribir Gl Usuario"  min={0}  step="any"    className={inputClassName(formik?.errors?.gl_usuario)} />
                                                <ErrorMessage name="gl_usuario" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Gl Fecha Registro 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="gl_fecha_registro" value={formik.values.gl_fecha_registro} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.gl_fecha_registro)}        />
                                                <ErrorMessage name="gl_fecha_registro" component="span" className="p-error" />
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
TblglosaEditPage.defaultProps = {
	primaryKey: 'gl_id',
	pageName: 'tblglosa',
	apiPath: 'tblglosa/edit',
	routeName: 'tblglosaedit',
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
export default TblglosaEditPage;
