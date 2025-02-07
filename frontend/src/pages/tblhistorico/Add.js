import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblhistoricoAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		his_tipo_abm: yup.string().nullable().label("His Tipo Abm"),
		his_nom_tabla: yup.string().nullable().label("His Nom Tabla"),
		his_nom_pk: yup.string().nullable().label("His Nom Pk"),
		his_valor_pk: yup.string().nullable().label("His Valor Pk"),
		his_campos: yup.string().nullable().label("His Campos"),
		his_usuario_creacion: yup.number().nullable().label("His Usuario Creacion"),
		his_fecha_creacion: yup.string().nullable().label("His Fecha Creacion")
	});
	
	//form default values
	const formDefaultValues = {
		his_tipo_abm: '', 
		his_nom_tabla: '', 
		his_nom_pk: '', 
		his_valor_pk: '', 
		his_campos: '', 
		his_usuario_creacion: '', 
		his_fecha_creacion: new Date(), 
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
			app.navigate(`/tblhistorico`);
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
<main id="TblhistoricoAddPage" className="main-page">
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
                                                His Tipo Abm 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="his_tipo_abm"  onChange={formik.handleChange}  value={formik.values.his_tipo_abm}   label="His Tipo Abm" type="text" placeholder="Escribir His Tipo Abm"        className={inputClassName(formik?.errors?.his_tipo_abm)} />
                                                <ErrorMessage name="his_tipo_abm" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                His Nom Tabla 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="his_nom_tabla"  onChange={formik.handleChange}  value={formik.values.his_nom_tabla}   label="His Nom Tabla" type="text" placeholder="Escribir His Nom Tabla"        className={inputClassName(formik?.errors?.his_nom_tabla)} />
                                                <ErrorMessage name="his_nom_tabla" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                His Nom Pk 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="his_nom_pk"  onChange={formik.handleChange}  value={formik.values.his_nom_pk}   label="His Nom Pk" type="text" placeholder="Escribir His Nom Pk"        className={inputClassName(formik?.errors?.his_nom_pk)} />
                                                <ErrorMessage name="his_nom_pk" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                His Valor Pk 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="his_valor_pk"  onChange={formik.handleChange}  value={formik.values.his_valor_pk}   label="His Valor Pk" type="text" placeholder="Escribir His Valor Pk"        className={inputClassName(formik?.errors?.his_valor_pk)} />
                                                <ErrorMessage name="his_valor_pk" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                His Campos 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputTextarea name="his_campos"  className={inputClassName(formik?.errors?.his_campos)}   value={formik.values.his_campos} placeholder="Escribir His Campos" onChange={formik.handleChange}   >
                                                </InputTextarea>
                                                <ErrorMessage name="his_campos" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                His Usuario Creacion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="his_usuario_creacion"  onChange={formik.handleChange}  value={formik.values.his_usuario_creacion}   label="His Usuario Creacion" type="number" placeholder="Escribir His Usuario Creacion"  min={0}  step="any"    className={inputClassName(formik?.errors?.his_usuario_creacion)} />
                                                <ErrorMessage name="his_usuario_creacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                His Fecha Creacion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="his_fecha_creacion" value={formik.values.his_fecha_creacion} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.his_fecha_creacion)}        />
                                                <ErrorMessage name="his_fecha_creacion" component="span" className="p-error" />
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
TblhistoricoAddPage.defaultProps = {
	primaryKey: 'his_id',
	pageName: 'tblhistorico',
	apiPath: 'tblhistorico/add',
	routeName: 'tblhistoricoadd',
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
export default TblhistoricoAddPage;
