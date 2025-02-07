import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TbltipoeventoacademicoAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		eac_nombre: yup.string().nullable().label("Eac Nombre"),
		eac_prefijo: yup.string().nullable().label("Eac Prefijo"),
		eac_estado: yup.string().nullable().label("Eac Estado")
	});
	
	//form default values
	const formDefaultValues = {
		eac_nombre: '', 
		eac_prefijo: '', 
		eac_estado: '', 
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
			app.navigate(`/tbltipoeventoacademico`);
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
<main id="TbltipoeventoacademicoAddPage" className="main-page">
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
                                                Eac Nombre 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="eac_nombre"  onChange={formik.handleChange}  value={formik.values.eac_nombre}   label="Eac Nombre" type="text" placeholder="Escribir Eac Nombre"        className={inputClassName(formik?.errors?.eac_nombre)} />
                                                <ErrorMessage name="eac_nombre" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Eac Prefijo 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="eac_prefijo"  onChange={formik.handleChange}  value={formik.values.eac_prefijo}   label="Eac Prefijo" type="text" placeholder="Escribir Eac Prefijo"        className={inputClassName(formik?.errors?.eac_prefijo)} />
                                                <ErrorMessage name="eac_prefijo" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Eac Estado 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="eac_estado"  onChange={formik.handleChange}  value={formik.values.eac_estado}   label="Eac Estado" type="text" placeholder="Escribir Eac Estado"        className={inputClassName(formik?.errors?.eac_estado)} />
                                                <ErrorMessage name="eac_estado" component="span" className="p-error" />
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
TbltipoeventoacademicoAddPage.defaultProps = {
	primaryKey: 'eac_id',
	pageName: 'tbltipoeventoacademico',
	apiPath: 'tbltipoeventoacademico/add',
	routeName: 'tbltipoeventoacademicoadd',
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
export default TbltipoeventoacademicoAddPage;
