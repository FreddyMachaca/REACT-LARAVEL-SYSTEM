import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const TblacreedoresEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		ac_id: yup.number().required().label("Ac Id"),
		ac_descripcion: yup.string().required().label("Ac Descripcion"),
		ac_tipo: yup.string().required().label("Ac Tipo"),
		ac_documento: yup.string().nullable().label("Ac Documento"),
		ac_estado: yup.string().required().label("Ac Estado")
	});
	// form default values
	const formDefaultValues = {
		ac_id: '', 
		ac_descripcion: '', 
		ac_tipo: '', 
		ac_documento: '', 
		ac_estado: '', 
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
			app.navigate(`/tblacreedores`);
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
<main id="TblacreedoresEditPage" className="main-page">
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
                                                Ac Id *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ac_id"  onChange={formik.handleChange}  value={formik.values.ac_id}   label="Ac Id" type="number" placeholder="Escribir Ac Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.ac_id)} />
                                                <ErrorMessage name="ac_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ac Descripcion *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ac_descripcion"  onChange={formik.handleChange}  value={formik.values.ac_descripcion}   label="Ac Descripcion" type="text" placeholder="Escribir Ac Descripcion"        className={inputClassName(formik?.errors?.ac_descripcion)} />
                                                <ErrorMessage name="ac_descripcion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ac Tipo *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ac_tipo"  onChange={formik.handleChange}  value={formik.values.ac_tipo}   label="Ac Tipo" type="text" placeholder="Escribir Ac Tipo"        className={inputClassName(formik?.errors?.ac_tipo)} />
                                                <ErrorMessage name="ac_tipo" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ac Documento 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ac_documento"  onChange={formik.handleChange}  value={formik.values.ac_documento}   label="Ac Documento" type="text" placeholder="Escribir Ac Documento"        className={inputClassName(formik?.errors?.ac_documento)} />
                                                <ErrorMessage name="ac_documento" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Ac Estado *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="ac_estado"  onChange={formik.handleChange}  value={formik.values.ac_estado}   label="Ac Estado" type="text" placeholder="Escribir Ac Estado"        className={inputClassName(formik?.errors?.ac_estado)} />
                                                <ErrorMessage name="ac_estado" component="span" className="p-error" />
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
TblacreedoresEditPage.defaultProps = {
	primaryKey: 'ac_id',
	pageName: 'tblacreedores',
	apiPath: 'tblacreedores/edit',
	routeName: 'tblacreedoresedit',
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
export default TblacreedoresEditPage;
