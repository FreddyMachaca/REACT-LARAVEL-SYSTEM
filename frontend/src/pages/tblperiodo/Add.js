import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblperiodoAddPage = (props) => {
		const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		pr_id: yup.number().required().label("Pr Id"),
		pr_gestion: yup.number().required().label("Pr Gestion"),
		pr_secuencial: yup.number().required().label("Pr Secuencial"),
		pr_estado: yup.string().required().label("Pr Estado")
	});
	
	//form default values
	const formDefaultValues = {
		pr_id: '', 
		pr_gestion: '', 
		pr_secuencial: '', 
		pr_estado: '', 
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
			app.navigate(`/tblperiodo`);
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
<main id="TblperiodoAddPage" className="main-page">
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
                                                Pr Id *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="pr_id"  onChange={formik.handleChange}  value={formik.values.pr_id}   label="Pr Id" type="number" placeholder="Escribir Pr Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.pr_id)} />
                                                <ErrorMessage name="pr_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Pr Gestion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="pr_gestion"  onChange={formik.handleChange}  value={formik.values.pr_gestion}   label="Pr Gestion" type="number" placeholder="Escribir Pr Gestion"  min={0}  step="any"    className={inputClassName(formik?.errors?.pr_gestion)} />
                                                <ErrorMessage name="pr_gestion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Pr Secuencial *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="pr_secuencial"  onChange={formik.handleChange}  value={formik.values.pr_secuencial}   label="Pr Secuencial" type="number" placeholder="Escribir Pr Secuencial"  min={0}  step="any"    className={inputClassName(formik?.errors?.pr_secuencial)} />
                                                <ErrorMessage name="pr_secuencial" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Pr Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="pr_estado"  onChange={formik.handleChange}  value={formik.values.pr_estado}   label="Pr Estado" type="text" placeholder="Escribir Pr Estado"        className={inputClassName(formik?.errors?.pr_estado)} />
                                                <ErrorMessage name="pr_estado" component="span" className="p-error" />
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
TblperiodoAddPage.defaultProps = {
	primaryKey: 'pr_id',
	pageName: 'tblperiodo',
	apiPath: 'tblperiodo/add',
	routeName: 'tblperiodoadd',
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
export default TblperiodoAddPage;
