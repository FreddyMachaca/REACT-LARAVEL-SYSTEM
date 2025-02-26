import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import useEditPage from 'hooks/useEditPage';

const TblItemsEditPage = (props) => {
    const app = useApp();
    
    const validationSchema = yup.object().shape({
        codigo_item: yup.string().required('El código del item es requerido'),
        cargo: yup.string().required('El cargo es requerido'),
        haber_basico: yup.number().required('El haber básico es requerido'),
        unidad_organizacional: yup.string().required('La unidad organizacional es requerida')
    });

    const formDefaultValues = {
        codigo_item: '', 
        cargo: '', 
        haber_basico: '', 
        unidad_organizacional: ''
    }

    const pageController = useEditPage({ props, formDefaultValues, afterSubmit });
    
    const { formData, handleSubmit, submitForm, pageReady, loading, saving, apiRequestError, inputClassName } = pageController

    function afterSubmit(response){
        app.flashMsg(props.msgTitle, props.msgAfterSave);
        if(props.onSave) {
            props.onSave(response);
        }
        else if(app.isDialogOpen()){
            app.closeDialogs();
        }
        else if(props.redirect) {
            app.navigate(`/tblitems`);
        }
    }

    if(loading){
        return (
            <div className="p-3 text-center">
                <ProgressSpinner style={{width:'50px', height:'50px'}} />
            </div>
        );
    }

    if(apiRequestError){
        return (
            <PageRequestError error={apiRequestError} />
        );
    }

    if(pageReady){
        return (
            <main id="TblItemsEditPage" className="main-page">
                {props.showHeader && (
                    <section className="page-section mb-3" >
                        <div className="container">
                            <div className="grid justify-content-between align-items-center">
                                { !props.isSubPage && 
                                <div className="col-fixed " >
                                    <Button onClick={() => app.navigate(-1)} label=""  className="p-button p-button-text " icon="pi pi-arrow-left"  />
                                </div>
                                }
                                <div className="col" >
                                    <Title title="Editar Item" titleClass="text-2xl text-primary font-bold" subTitleClass="text-500" separator={false} />
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
                                                    {/* Código Item */}
                                                    <div className="col-12">
                                                        <div className="formgrid grid">
                                                            <div className="col-12 md:col-3">
                                                                <label htmlFor="codigo_item" className="font-medium">
                                                                    Código Item *
                                                                </label>
                                                            </div>
                                                            <div className="col-12 md:col-9">
                                                                <InputText
                                                                    id="codigo_item"
                                                                    name="codigo_item"
                                                                    value={formik.values.codigo_item}
                                                                    onChange={formik.handleChange}
                                                                    className={inputClassName(formik?.errors?.codigo_item)}
                                                                />
                                                                <ErrorMessage name="codigo_item" component="small" className="p-error" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Cargo */}
                                                    <div className="col-12">
                                                        <div className="formgrid grid">
                                                            <div className="col-12 md:col-3">
                                                                <label htmlFor="cargo" className="font-medium">
                                                                    Cargo *
                                                                </label>
                                                            </div>
                                                            <div className="col-12 md:col-9">
                                                                <InputText
                                                                    id="cargo"
                                                                    name="cargo"
                                                                    value={formik.values.cargo}
                                                                    onChange={formik.handleChange}
                                                                    className={inputClassName(formik?.errors?.cargo)}
                                                                />
                                                                <ErrorMessage name="cargo" component="small" className="p-error" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Haber Básico */}
                                                    <div className="col-12">
                                                        <div className="formgrid grid">
                                                            <div className="col-12 md:col-3">
                                                                <label htmlFor="haber_basico" className="font-medium">
                                                                    Haber Básico *
                                                                </label>
                                                            </div>
                                                            <div className="col-12 md:col-9">
                                                                <InputText
                                                                    id="haber_basico"
                                                                    name="haber_basico"
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={formik.values.haber_basico}
                                                                    onChange={formik.handleChange}
                                                                    className={inputClassName(formik?.errors?.haber_basico)}
                                                                />
                                                                <ErrorMessage name="haber_basico" component="small" className="p-error" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Unidad Organizacional */}
                                                    <div className="col-12">
                                                        <div className="formgrid grid">
                                                            <div className="col-12 md:col-3">
                                                                <label htmlFor="unidad_organizacional" className="font-medium">
                                                                    Unidad Organizacional *
                                                                </label>
                                                            </div>
                                                            <div className="col-12 md:col-9">
                                                                <InputText
                                                                    id="unidad_organizacional"
                                                                    name="unidad_organizacional"
                                                                    value={formik.values.unidad_organizacional}
                                                                    onChange={formik.handleChange}
                                                                    className={inputClassName(formik?.errors?.unidad_organizacional)}
                                                                />
                                                                <ErrorMessage name="unidad_organizacional" component="small" className="p-error" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

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

TblItemsEditPage.defaultProps = {
    primaryKey: 'id',
    pageName: 'tblitem',
    apiPath: 'tblitem/edit',
    routeName: 'tblitemsedit',
    submitButtonLabel: "Actualizar",
    formValidationError: "El formulario no es válido",
    formValidationMsg: "Por favor complete el formulario",
    msgTitle: "Actualizar Item",
    msgAfterSave: "Item actualizado con éxito",
    msgBeforeSave: "",
    showHeader: true,
    showFooter: true,
    redirect: true,
    isSubPage: false
}

export default TblItemsEditPage;
