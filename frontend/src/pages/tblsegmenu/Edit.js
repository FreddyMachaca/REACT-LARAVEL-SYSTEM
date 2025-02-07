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
const TblsegmenuEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		me_descripcion: yup.string().nullable().label("Me Descripcion"),
		me_url: yup.string().nullable().label("Me Url"),
		me_icono: yup.string().nullable().label("Me Icono"),
		me_id_padre: yup.number().nullable().label("Me Id Padre"),
		me_vista: yup.number().nullable().label("Me Vista"),
		me_orden: yup.number().nullable().label("Me Orden"),
		me_estado: yup.string().required().label("Me Estado"),
		me_usuario_creacion: yup.number().required().label("Me Usuario Creacion"),
		me_fecha_creacion: yup.string().required().label("Me Fecha Creacion")
	});
	// form default values
	const formDefaultValues = {
		me_descripcion: '', 
		me_url: '', 
		me_icono: '', 
		me_id_padre: '', 
		me_vista: '', 
		me_orden: '', 
		me_estado: '', 
		me_usuario_creacion: '', 
		me_fecha_creacion: new Date(), 
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
			app.navigate(`/tblsegmenu`);
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
<main id="TblsegmenuEditPage" className="main-page">
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
                                                Me Descripcion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_descripcion"  onChange={formik.handleChange}  value={formik.values.me_descripcion}   label="Me Descripcion" type="text" placeholder="Escribir Me Descripcion"        className={inputClassName(formik?.errors?.me_descripcion)} />
                                                <ErrorMessage name="me_descripcion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Me Url 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_url"  onChange={formik.handleChange}  value={formik.values.me_url}   label="Me Url" type="text" placeholder="Escribir Me Url"        className={inputClassName(formik?.errors?.me_url)} />
                                                <ErrorMessage name="me_url" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Me Icono 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_icono"  onChange={formik.handleChange}  value={formik.values.me_icono}   label="Me Icono" type="text" placeholder="Escribir Me Icono"        className={inputClassName(formik?.errors?.me_icono)} />
                                                <ErrorMessage name="me_icono" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Me Id Padre 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_id_padre"  onChange={formik.handleChange}  value={formik.values.me_id_padre}   label="Me Id Padre" type="number" placeholder="Escribir Me Id Padre"  min={0}  step="any"    className={inputClassName(formik?.errors?.me_id_padre)} />
                                                <ErrorMessage name="me_id_padre" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Me Vista 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_vista"  onChange={formik.handleChange}  value={formik.values.me_vista}   label="Me Vista" type="number" placeholder="Escribir Me Vista"  min={0}  step="any"    className={inputClassName(formik?.errors?.me_vista)} />
                                                <ErrorMessage name="me_vista" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Me Orden 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_orden"  onChange={formik.handleChange}  value={formik.values.me_orden}   label="Me Orden" type="number" placeholder="Escribir Me Orden"  min={0}  step="any"    className={inputClassName(formik?.errors?.me_orden)} />
                                                <ErrorMessage name="me_orden" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Me Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_estado"  onChange={formik.handleChange}  value={formik.values.me_estado}   label="Me Estado" type="text" placeholder="Escribir Me Estado"        className={inputClassName(formik?.errors?.me_estado)} />
                                                <ErrorMessage name="me_estado" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Me Usuario Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_usuario_creacion"  onChange={formik.handleChange}  value={formik.values.me_usuario_creacion}   label="Me Usuario Creacion" type="number" placeholder="Escribir Me Usuario Creacion"  min={0}  step="any"    className={inputClassName(formik?.errors?.me_usuario_creacion)} />
                                                <ErrorMessage name="me_usuario_creacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Me Fecha Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="me_fecha_creacion" value={formik.values.me_fecha_creacion} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.me_fecha_creacion)}        />
                                                <ErrorMessage name="me_fecha_creacion" component="span" className="p-error" />
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
TblsegmenuEditPage.defaultProps = {
	primaryKey: 'me_id',
	pageName: 'tblsegmenu',
	apiPath: 'tblsegmenu/edit',
	routeName: 'tblsegmenuedit',
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
export default TblsegmenuEditPage;
