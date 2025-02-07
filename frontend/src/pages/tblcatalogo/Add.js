import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblcatalogoAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		cat_tabla: yup.string().nullable().label("Cat Tabla"),
		cat_secuencial: yup.number().required().label("Cat Secuencial"),
		cat_descripcion: yup.string().nullable().label("Cat Descripcion"),
		cat_abreviacion: yup.string().nullable().label("Cat Abreviacion"),
		cat_estado: yup.string().required().label("Cat Estado"),
		cat_id_superior: yup.number().nullable().label("Cat Id Superior"),
		cat_adicional: yup.string().nullable().label("Cat Adicional")
	});
	
	//form default values
	const formDefaultValues = {
		cat_tabla: '', 
		cat_secuencial: '', 
		cat_descripcion: '', 
		cat_abreviacion: '', 
		cat_estado: '', 
		cat_id_superior: '', 
		cat_adicional: '', 
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
			app.navigate(`/tblcatalogo`);
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
<main id="TblcatalogoAddPage" className="main-page">
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
                                                Cat Tabla 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="cat_tabla"  onChange={formik.handleChange}  value={formik.values.cat_tabla}   label="Cat Tabla" type="text" placeholder="Escribir Cat Tabla"        className={inputClassName(formik?.errors?.cat_tabla)} />
                                                <ErrorMessage name="cat_tabla" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Cat Secuencial *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="cat_secuencial"  onChange={formik.handleChange}  value={formik.values.cat_secuencial}   label="Cat Secuencial" type="number" placeholder="Escribir Cat Secuencial"  min={0}  step="any"    className={inputClassName(formik?.errors?.cat_secuencial)} />
                                                <ErrorMessage name="cat_secuencial" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Cat Descripcion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="cat_descripcion"  onChange={formik.handleChange}  value={formik.values.cat_descripcion}   label="Cat Descripcion" type="text" placeholder="Escribir Cat Descripcion"        className={inputClassName(formik?.errors?.cat_descripcion)} />
                                                <ErrorMessage name="cat_descripcion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Cat Abreviacion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="cat_abreviacion"  onChange={formik.handleChange}  value={formik.values.cat_abreviacion}   label="Cat Abreviacion" type="text" placeholder="Escribir Cat Abreviacion"        className={inputClassName(formik?.errors?.cat_abreviacion)} />
                                                <ErrorMessage name="cat_abreviacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Cat Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="cat_estado"  onChange={formik.handleChange}  value={formik.values.cat_estado}   label="Cat Estado" type="text" placeholder="Escribir Cat Estado"        className={inputClassName(formik?.errors?.cat_estado)} />
                                                <ErrorMessage name="cat_estado" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Cat Id Superior 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="cat_id_superior"  onChange={formik.handleChange}  value={formik.values.cat_id_superior}   label="Cat Id Superior" type="number" placeholder="Escribir Cat Id Superior"  min={0}  step="any"    className={inputClassName(formik?.errors?.cat_id_superior)} />
                                                <ErrorMessage name="cat_id_superior" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Cat Adicional 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="cat_adicional"  onChange={formik.handleChange}  value={formik.values.cat_adicional}   label="Cat Adicional" type="text" placeholder="Escribir Cat Adicional"        className={inputClassName(formik?.errors?.cat_adicional)} />
                                                <ErrorMessage name="cat_adicional" component="span" className="p-error" />
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
TblcatalogoAddPage.defaultProps = {
	primaryKey: 'cat_id',
	pageName: 'tblcatalogo',
	apiPath: 'tblcatalogo/add',
	routeName: 'tblcatalogoadd',
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
export default TblcatalogoAddPage;
