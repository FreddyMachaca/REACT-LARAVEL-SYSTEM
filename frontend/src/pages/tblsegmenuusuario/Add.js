import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblsegmenuusuarioAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		meus_me_id: yup.number().nullable().label("Meus Me Id"),
		meus_us_id: yup.number().nullable().label("Meus Us Id"),
		meus_estado: yup.string().required().label("Meus Estado"),
		meus_fecha_creacion: yup.string().required().label("Meus Fecha Creacion"),
		meus_usuario_creacion: yup.number().required().label("Meus Usuario Creacion")
	});
	
	//form default values
	const formDefaultValues = {
		meus_me_id: '', 
		meus_us_id: '', 
		meus_estado: '', 
		meus_fecha_creacion: new Date(), 
		meus_usuario_creacion: '', 
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
			app.navigate(`/tblsegmenuusuario`);
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
<main id="TblsegmenuusuarioAddPage" className="main-page">
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
                                                Meus Me Id 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="meus_me_id"  onChange={formik.handleChange}  value={formik.values.meus_me_id}   label="Meus Me Id" type="number" placeholder="Escribir Meus Me Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.meus_me_id)} />
                                                <ErrorMessage name="meus_me_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Meus Us Id 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="meus_us_id"  onChange={formik.handleChange}  value={formik.values.meus_us_id}   label="Meus Us Id" type="number" placeholder="Escribir Meus Us Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.meus_us_id)} />
                                                <ErrorMessage name="meus_us_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Meus Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="meus_estado"  onChange={formik.handleChange}  value={formik.values.meus_estado}   label="Meus Estado" type="text" placeholder="Escribir Meus Estado"        className={inputClassName(formik?.errors?.meus_estado)} />
                                                <ErrorMessage name="meus_estado" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Meus Fecha Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <Calendar name="meus_fecha_creacion" value={formik.values.meus_fecha_creacion} onChange={formik.handleChange} showButtonBar showTime dateFormat="yy-mm-dd" hourFormat="24"showIcon className={inputClassName(formik?.errors?.meus_fecha_creacion)}        />
                                                <ErrorMessage name="meus_fecha_creacion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Meus Usuario Creacion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="meus_usuario_creacion"  onChange={formik.handleChange}  value={formik.values.meus_usuario_creacion}   label="Meus Usuario Creacion" type="number" placeholder="Escribir Meus Usuario Creacion"  min={0}  step="any"    className={inputClassName(formik?.errors?.meus_usuario_creacion)} />
                                                <ErrorMessage name="meus_usuario_creacion" component="span" className="p-error" />
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
TblsegmenuusuarioAddPage.defaultProps = {
	primaryKey: 'meus_id',
	pageName: 'tblsegmenuusuario',
	apiPath: 'tblsegmenuusuario/add',
	routeName: 'tblsegmenuusuarioadd',
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
export default TblsegmenuusuarioAddPage;
