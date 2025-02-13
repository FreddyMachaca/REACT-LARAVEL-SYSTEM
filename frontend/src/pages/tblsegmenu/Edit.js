import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';  // Agregar esta importación
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const TblsegmenuEditPage = (props) => {
    const app = useApp();
    
    const validationSchema = yup.object().shape({
        me_descripcion: yup.string().required('La descripción es requerida'),
        me_icono: yup.string().nullable(),
        me_estado: yup.string().required('El estado es requerido')
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
        if(props.onSave) {
            props.onSave(response);
        }
        else if(app.isDialogOpen()){
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
                {props.showHeader && (
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
                )}
                <section className="page-section">
                    <div className="container">
                        <div className="grid">
                            <div className="md:col-9 sm:col-12 comp-grid">
                                <div>
                                    <Formik
                                        initialValues={formData}
                                        validationSchema={validationSchema}
                                        onSubmit={(values, actions) => submitForm(values)}
                                    >
                                        {(formik) => (
                                            <Form className={`${!props.isSubPage ? 'card' : ''}`}>
                                                <div className="grid">
                                                    {/* Descripción */}
                                                    <div className="col-12">
                                                        <div className="formgrid grid">
                                                            <div className="col-12 md:col-3">
                                                                <label htmlFor="me_descripcion" className="font-medium">
                                                                    Descripción *
                                                                </label>
                                                            </div>
                                                            <div className="col-12 md:col-9">
                                                                <InputText
                                                                    id="me_descripcion"
                                                                    name="me_descripcion"
                                                                    value={formik.values.me_descripcion}
                                                                    onChange={formik.handleChange}
                                                                    placeholder="Nombre del menú"
                                                                    className={inputClassName(formik?.errors?.me_descripcion)}
                                                                />
                                                                <ErrorMessage name="me_descripcion" component="small" className="p-error" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* URL */}
                                                    <div className="col-12">
                                                        <div className="formgrid grid">
                                                            <div className="col-12 md:col-3">
                                                                <label htmlFor="me_url" className="font-medium">URL</label>
                                                            </div>
                                                            <div className="col-12 md:col-9">
                                                                <InputText 
                                                                    id="me_url"
                                                                    name="me_url" 
                                                                    onChange={formik.handleChange} 
                                                                    value={formik.values.me_url} 
                                                                    placeholder="URL del menú" 
                                                                    disabled={!formik.values.me_id_padre} 
                                                                    className={inputClassName(formik?.errors?.me_url)} 
                                                                />
                                                                <ErrorMessage name="me_url" component="small" className="p-error" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Icono */}
                                                    <div className="col-12">
                                                        <div className="formgrid grid">
                                                            <div className="col-12 md:col-3">
                                                                <label htmlFor="me_icono" className="font-medium">
                                                                    Icono
                                                                </label>
                                                            </div>
                                                            <div className="col-12 md:col-9">
                                                                <InputText
                                                                    id="me_icono"
                                                                    name="me_icono"
                                                                    value={formik.values.me_icono}
                                                                    onChange={formik.handleChange}
                                                                    placeholder="Ejemplo: pi pi-home"
                                                                    className={inputClassName(formik?.errors?.me_icono)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Estado */}
                                                    <div className="col-12">
                                                        <div className="formgrid grid">
                                                            <div className="col-12 md:col-3">
                                                                <label className="ml-2">Mostrar en el menú</label>
                                                            </div>
                                                            <div className="col-12 md:col-9">
                                                                <div className="p-field-checkbox">
                                                                    <Checkbox
                                                                        checked={formik.values.me_estado === '1'}
                                                                        onChange={e => formik.setFieldValue('me_estado', e.checked ? '1' : '0')}
                                                                    />
                                                                </div>
                                                                <ErrorMessage name="me_estado" component="small" className="p-error" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Botón submit */}
                                                {props.showFooter && (
                                                    <div className="text-center my-3">
                                                        <Button
                                                            onClick={(e) => handleSubmit(e, formik)}
                                                            className="p-button-primary"
                                                            type="submit"
                                                            label="Actualizar"
                                                            icon="pi pi-save"
                                                            loading={saving}
                                                        />
                                                    </div>
                                                )}
                                            </Form>
                                        )}
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
    isSubPage: false,
    onSave: null, // Agregar esta nueva prop
}
export default TblsegmenuEditPage;