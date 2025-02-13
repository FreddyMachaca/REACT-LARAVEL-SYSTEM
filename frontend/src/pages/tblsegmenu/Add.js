import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';  // Agregar esta importación
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useAddPage from 'hooks/useAddPage';
const TblsegmenuAddPage = (props) => {
    const app = useApp();
    
    const validationSchema = yup.object().shape({
        me_descripcion: yup.string().required('La descripción es requerida'),
        me_icono: yup.string().nullable(),
        me_url: yup.string().required('La URL es requerida'),
        me_estado: yup.string().required('El estado es requerido')
    });
    
    const formDefaultValues = {
        me_descripcion: '', 
        me_url: '#',  // Siempre será '#' para menús padre
        me_icono: '', 
        me_id_padre: null,  // Valor por defecto null para menús padre
        me_vista: 1,  // Valor por defecto
        me_orden: 0,  // Valor por defecto
        me_estado: '1', // Activo por defecto
        me_usuario_creacion: '1', // Usuario por defecto
        me_fecha_creacion: new Date()
    };

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
            app.navigate(`/tblsegmenu`);
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
<main id="TblsegmenuAddPage" className="main-page">
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
                    <Title title="Agregar nuevo Menu"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
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
                            <Form className={`${!props.isSubPage ? 'card' : ''}`}>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Descripción *
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_descripcion" onChange={formik.handleChange} value={formik.values.me_descripcion} placeholder="Nombre del menú" className={inputClassName(formik?.errors?.me_descripcion)} />
                                                <ErrorMessage name="me_descripcion" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                URL {/** Solo editable para hijos */}
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText 
                                                    name="me_url" 
                                                    onChange={formik.handleChange} 
                                                    value={formik.values.me_url} 
                                                    placeholder="URL del menú"
                                                    disabled={!formik.values.me_id_padre} 
                                                    className={inputClassName(formik?.errors?.me_url)} 
                                                />
                                                <ErrorMessage name="me_url" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                Icono
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="me_icono"  onChange={formik.handleChange}  value={formik.values.me_icono}   label="Me Icono" type="text" placeholder="Ejemplo: pi pi-home"        className={inputClassName(formik?.errors?.me_icono)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                <label className="ml-2">Mostrar en el menú</label>
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <div className="p-field-checkbox">
                                                    <Checkbox
                                                        name="me_estado"
                                                        checked={formik.values.me_estado === '1'}
                                                        onChange={(e) => {
                                                            formik.setFieldValue('me_estado', e.checked ? '1' : '0')
                                                        }}
                                                    />
                                                </div>
                                                <ErrorMessage name="me_estado" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { props.showFooter && 
                                <div className="text-center my-3">
                                    <Button onClick={(e) => handleSubmit(e, formik)} className="p-button-primary" type="submit" label="Guardar" icon="pi pi-save" loading={saving} />
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
TblsegmenuAddPage.defaultProps = {
    primaryKey: 'me_id',
    pageName: 'tblsegmenu',
    apiPath: 'tblsegmenu/add',
    routeName: 'tblsegmenuadd',
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
export default TblsegmenuAddPage;