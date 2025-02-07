import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const TblbsegsEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		egs_abr: yup.string().nullable().label("Egs Abr"),
		egs_descripcion: yup.string().nullable().label("Egs Descripcion"),
		egs_fa_id: yup.number().nullable().label("Egs Fa Id"),
		egs_ca_entidad: yup.number().nullable().label("Egs Ca Entidad")
	});
	// form default values
	const formDefaultValues = {
		egs_abr: '', 
		egs_descripcion: '', 
		egs_fa_id: '', 
		egs_ca_entidad: '', 
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
			app.navigate(`/tblbsegs`);
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
<main id="TblbsegsEditPage" className="main-page">
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
                                                Egs Abr 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="egs_abr"  onChange={formik.handleChange}  value={formik.values.egs_abr}   label="Egs Abr" type="text" placeholder="Escribir Egs Abr"        className={inputClassName(formik?.errors?.egs_abr)} />
                                                <ErrorMessage name="egs_abr" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Egs Descripcion 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="egs_descripcion"  onChange={formik.handleChange}  value={formik.values.egs_descripcion}   label="Egs Descripcion" type="text" placeholder="Escribir Egs Descripcion"        className={inputClassName(formik?.errors?.egs_descripcion)} />
                                                <ErrorMessage name="egs_descripcion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Egs Fa Id 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="egs_fa_id"  onChange={formik.handleChange}  value={formik.values.egs_fa_id}   label="Egs Fa Id" type="number" placeholder="Escribir Egs Fa Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.egs_fa_id)} />
                                                <ErrorMessage name="egs_fa_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Egs Ca Entidad 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="egs_ca_entidad"  onChange={formik.handleChange}  value={formik.values.egs_ca_entidad}   label="Egs Ca Entidad" type="number" placeholder="Escribir Egs Ca Entidad"  min={0}  step="any"    className={inputClassName(formik?.errors?.egs_ca_entidad)} />
                                                <ErrorMessage name="egs_ca_entidad" component="span" className="p-error" />
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
TblbsegsEditPage.defaultProps = {
	primaryKey: 'egs_id',
	pageName: 'tblbsegs',
	apiPath: 'tblbsegs/edit',
	routeName: 'tblbsegsedit',
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
export default TblbsegsEditPage;
