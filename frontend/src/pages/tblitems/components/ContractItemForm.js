import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import useApp from 'hooks/useApp';

const ContractItemForm = ({ structuralItem, onSave, isSubPage }) => {
    const app = useApp();
    const [submitting, setSubmitting] = useState(false);

    const tiemposJornada = [
        { label: 'Completa', value: 'Completa' },
        { label: 'Media', value: 'Media' },
        { label: 'Por horas', value: 'Por horas' }
    ];

    const validationSchema = yup.object().shape({
        cargo: yup.string().required('El cargo es requerido'),
        codigo_item: yup.string().required('El código de ítem es requerido'),
        haber_basico: yup.number().required('El haber básico es requerido').min(0, 'No puede ser negativo'),
        unidad_organizacional: yup.string().required('La unidad organizacional es requerida'),
        tiempoJornada: yup.string().required('El tiempo de jornada es requerido'),
        cantidad: yup.number().required('La cantidad es requerida').min(1, 'Debe ser al menos 1')
    });

    const initialValues = {
        cargo: '',
        codigo_item: '',
        haber_basico: 0,
        unidad_organizacional: '',
        tiempoJornada: '',
        cantidad: 1,
        id: structuralItem.id 
    };

    const handleSubmit = (values, { setSubmitting, setFieldError }) => {
        if (submitting) return;
        
        setSubmitting(true);
        
        try {
            const contratoData = {
                ...values,
                haber_basico: parseFloat(values.haber_basico),
                cantidad: parseInt(values.cantidad, 10),
                id: structuralItem.id,
                title: structuralItem.title,
                categoriaPragmatica: structuralItem.categoriaPragmatica,
                categoriaAdministrativa: structuralItem.categoriaAdministrativa,
                fecha_creacion: new Date().toISOString()
            };
            
            onSave(contratoData)
                .catch(error => {
                    if (error.response && error.response.status === 422) {
                        const validationErrors = error.response.data.errors;
                        
                        Object.keys(validationErrors).forEach(field => {
                            setFieldError(field, validationErrors[field][0]);
                        });
                        
                        app.flashMsg("Error", "Por favor corrija los errores del formulario", "error");
                    } else {
                        throw error;
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
        } catch (error) {
            console.error("Error al guardar el contrato:", error);
            app.flashMsg("Error", "Ocurrió un error al guardar el contrato", "error");
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        app.closeDialogs();
    };

    const inputClassName = (error) => `w-full ${error ? 'p-invalid' : ''}`;

    return (
        <div className={isSubPage ? '' : 'card shadow-2'}>
            {!isSubPage && (
                <div className="card-header bg-primary text-white p-3">
                    <h5 className="m-0">Nuevo Contrato</h5>
                </div>
            )}
            <div className="p-3">
                <div className="mb-3">
                    <div className="font-medium text-lg mb-1">Ítem estructural:</div>
                    <div className="surface-100 p-2 border-round">
                        <span className="font-semibold">{structuralItem.title}</span> ({structuralItem.categoriaAdministrativa} - {structuralItem.categoriaPragmatica})
                    </div>
                </div>
                
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                        <Form>
                            <input 
                                type="hidden" 
                                name="id" 
                                value={values.id} 
                            />
                            
                            <div className="grid">
                                <div className="col-12 md:col-6 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="codigo_item" className="font-medium block mb-2">Código Item *</label>
                                        <InputText 
                                            id="codigo_item"
                                            name="codigo_item"
                                            value={values.codigo_item}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName(touched.codigo_item && errors.codigo_item)}
                                            placeholder="Ingrese el código del ítem"
                                        />
                                        <ErrorMessage name="codigo_item" component="small" className="p-error" />
                                    </div>
                                </div>

                                <div className="col-12 md:col-6 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="unidad_organizacional" className="font-medium block mb-2">Unidad Organizacional *</label>
                                        <InputText 
                                            id="unidad_organizacional"
                                            name="unidad_organizacional"
                                            value={values.unidad_organizacional}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName(touched.unidad_organizacional && errors.unidad_organizacional)}
                                            placeholder="Ingrese la unidad organizacional"
                                        />
                                        <ErrorMessage name="unidad_organizacional" component="small" className="p-error" />
                                    </div>
                                </div>

                                <div className="col-12 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="cargo" className="font-medium block mb-2">Cargo *</label>
                                        <InputText 
                                            id="cargo"
                                            name="cargo"
                                            value={values.cargo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName(touched.cargo && errors.cargo)}
                                            placeholder="Ingrese el cargo"
                                        />
                                        <ErrorMessage name="cargo" component="small" className="p-error" />
                                    </div>
                                </div>

                                <div className="col-12 md:col-6 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="haber_basico" className="font-medium block mb-2">Haber Básico *</label>
                                        <InputNumber 
                                            id="haber_basico"
                                            name="haber_basico"
                                            value={values.haber_basico}
                                            onValueChange={(e) => setFieldValue('haber_basico', e.value)}
                                            mode="decimal" 
                                            minFractionDigits={2}
                                            maxFractionDigits={2}
                                            locale="es-BO"
                                            placeholder="Ingrese el monto"
                                            prefix="Bs. "
                                            min={0}
                                            className={inputClassName(touched.haber_basico && errors.haber_basico)}
                                            tooltip="Ingrese el haber básico sin símbolos, solo números"
                                            tooltipOptions={{ position: 'top' }}
                                        />
                                        <small className="block mt-1 text-blue-500">Ejemplo: 3500.00</small>
                                        <ErrorMessage name="haber_basico" component="small" className="p-error" />
                                    </div>
                                </div>

                                <div className="col-12 md:col-6 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="tiempoJornada" className="font-medium block mb-2">Tiempo Jornada *</label>
                                        <Dropdown
                                            id="tiempoJornada"
                                            name="tiempoJornada"
                                            value={values.tiempoJornada}
                                            options={tiemposJornada}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName(touched.tiempoJornada && errors.tiempoJornada)}
                                            placeholder="Seleccione el tiempo de jornada"
                                        />
                                        <ErrorMessage name="tiempoJornada" component="small" className="p-error" />
                                    </div>
                                </div>

                                <div className="col-12 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="cantidad" className="font-medium block mb-2">Cantidad *</label>
                                        <InputNumber 
                                            id="cantidad"
                                            name="cantidad"
                                            value={values.cantidad}
                                            onValueChange={(e) => setFieldValue('cantidad', e.value)}
                                            min={1}
                                            className={inputClassName(touched.cantidad && errors.cantidad)}
                                            showButtons
                                            buttonLayout="horizontal"
                                            decrementButtonClassName="p-button-secondary"
                                            incrementButtonClassName="p-button-secondary"
                                            incrementButtonIcon="pi pi-plus"
                                            decrementButtonIcon="pi pi-minus"
                                        />
                                        <ErrorMessage name="cantidad" component="small" className="p-error" />
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            <div className="flex justify-content-end">
                                <div className="flex gap-2">
                                    <Button 
                                        type="button" 
                                        label="Cancelar" 
                                        icon="pi pi-times" 
                                        className="p-button-outlined p-button-secondary" 
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                    />
                                    <Button 
                                        type="submit" 
                                        label="Guardar" 
                                        icon="pi pi-save" 
                                        className="p-button-primary" 
                                        loading={isSubmitting}
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

ContractItemForm.defaultProps = {
    isSubPage: false
};

export default ContractItemForm;
