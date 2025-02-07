import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const TblempleadorEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		em_id: yup.number().required().label("Em Id"),
		em_nombre: yup.string().nullable().label("Em Nombre"),
		em_razon_social: yup.string().nullable().label("Em Razon Social"),
		em_nit: yup.string().nullable().label("Em Nit"),
		em_departamento: yup.string().nullable().label("Em Departamento"),
		em_provincia: yup.string().nullable().label("Em Provincia"),
		em_localidad: yup.string().nullable().label("Em Localidad"),
		em_zona: yup.string().nullable().label("Em Zona"),
		em_tipovia: yup.string().nullable().label("Em Tipovia"),
		em_nombrevia: yup.string().nullable().label("Em Nombrevia"),
		em_numero: yup.string().nullable().label("Em Numero"),
		em_telefono: yup.string().nullable().label("Em Telefono"),
		em_fax: yup.string().nullable().label("Em Fax"),
		em_otros: yup.string().nullable().label("Em Otros"),
		em_actividad: yup.string().nullable().label("Em Actividad"),
		em_estado: yup.string().nullable().label("Em Estado")
	});
	// form default values
	const formDefaultValues = {
		em_id: '', 
		em_nombre: '', 
		em_razon_social: '', 
		em_nit: '', 
		em_departamento: '', 
		em_provincia: '', 
		em_localidad: '', 
		em_zona: '', 
		em_tipovia: '', 
		em_nombrevia: '', 
		em_numero: '', 
		em_telefono: '', 
		em_fax: '', 
		em_otros: '', 
		em_actividad: '', 
		em_estado: '', 
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
			app.navigate(`/tblempleador`);
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
<main id="TblempleadorEditPage" className="main-page">
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
                                                Em Id *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_id"  onChange={formik.handleChange}  value={formik.values.em_id}   label="Em Id" type="number" placeholder="Escribir Em Id"  min={0}  step="any"    className={inputClassName(formik?.errors?.em_id)} />
                                                <ErrorMessage name="em_id" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Nombre 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_nombre"  onChange={formik.handleChange}  value={formik.values.em_nombre}   label="Em Nombre" type="text" placeholder="Escribir Em Nombre"        className={inputClassName(formik?.errors?.em_nombre)} />
                                                <ErrorMessage name="em_nombre" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Razon Social 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_razon_social"  onChange={formik.handleChange}  value={formik.values.em_razon_social}   label="Em Razon Social" type="text" placeholder="Escribir Em Razon Social"        className={inputClassName(formik?.errors?.em_razon_social)} />
                                                <ErrorMessage name="em_razon_social" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Nit 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_nit"  onChange={formik.handleChange}  value={formik.values.em_nit}   label="Em Nit" type="text" placeholder="Escribir Em Nit"        className={inputClassName(formik?.errors?.em_nit)} />
                                                <ErrorMessage name="em_nit" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Departamento 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_departamento"  onChange={formik.handleChange}  value={formik.values.em_departamento}   label="Em Departamento" type="text" placeholder="Escribir Em Departamento"        className={inputClassName(formik?.errors?.em_departamento)} />
                                                <ErrorMessage name="em_departamento" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Provincia 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_provincia"  onChange={formik.handleChange}  value={formik.values.em_provincia}   label="Em Provincia" type="text" placeholder="Escribir Em Provincia"        className={inputClassName(formik?.errors?.em_provincia)} />
                                                <ErrorMessage name="em_provincia" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Localidad 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_localidad"  onChange={formik.handleChange}  value={formik.values.em_localidad}   label="Em Localidad" type="text" placeholder="Escribir Em Localidad"        className={inputClassName(formik?.errors?.em_localidad)} />
                                                <ErrorMessage name="em_localidad" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Zona 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_zona"  onChange={formik.handleChange}  value={formik.values.em_zona}   label="Em Zona" type="text" placeholder="Escribir Em Zona"        className={inputClassName(formik?.errors?.em_zona)} />
                                                <ErrorMessage name="em_zona" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Tipovia 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_tipovia"  onChange={formik.handleChange}  value={formik.values.em_tipovia}   label="Em Tipovia" type="text" placeholder="Escribir Em Tipovia"        className={inputClassName(formik?.errors?.em_tipovia)} />
                                                <ErrorMessage name="em_tipovia" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Nombrevia 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_nombrevia"  onChange={formik.handleChange}  value={formik.values.em_nombrevia}   label="Em Nombrevia" type="text" placeholder="Escribir Em Nombrevia"        className={inputClassName(formik?.errors?.em_nombrevia)} />
                                                <ErrorMessage name="em_nombrevia" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Numero 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_numero"  onChange={formik.handleChange}  value={formik.values.em_numero}   label="Em Numero" type="text" placeholder="Escribir Em Numero"        className={inputClassName(formik?.errors?.em_numero)} />
                                                <ErrorMessage name="em_numero" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Telefono 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_telefono"  onChange={formik.handleChange}  value={formik.values.em_telefono}   label="Em Telefono" type="text" placeholder="Escribir Em Telefono"        className={inputClassName(formik?.errors?.em_telefono)} />
                                                <ErrorMessage name="em_telefono" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Fax 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_fax"  onChange={formik.handleChange}  value={formik.values.em_fax}   label="Em Fax" type="text" placeholder="Escribir Em Fax"        className={inputClassName(formik?.errors?.em_fax)} />
                                                <ErrorMessage name="em_fax" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Otros 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_otros"  onChange={formik.handleChange}  value={formik.values.em_otros}   label="Em Otros" type="text" placeholder="Escribir Em Otros"        className={inputClassName(formik?.errors?.em_otros)} />
                                                <ErrorMessage name="em_otros" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Actividad 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_actividad"  onChange={formik.handleChange}  value={formik.values.em_actividad}   label="Em Actividad" type="text" placeholder="Escribir Em Actividad"        className={inputClassName(formik?.errors?.em_actividad)} />
                                                <ErrorMessage name="em_actividad" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Em Estado 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="em_estado"  onChange={formik.handleChange}  value={formik.values.em_estado}   label="Em Estado" type="text" placeholder="Escribir Em Estado"        className={inputClassName(formik?.errors?.em_estado)} />
                                                <ErrorMessage name="em_estado" component="span" className="p-error" />
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
TblempleadorEditPage.defaultProps = {
	primaryKey: 'em_id',
	pageName: 'tblempleador',
	apiPath: 'tblempleador/edit',
	routeName: 'tblempleadoredit',
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
export default TblempleadorEditPage;
