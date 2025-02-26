import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import useApp from 'hooks/useApp';

const ItemFormPage = ({ parentId, itemToEdit, onSave, onDelete, isSubPage }) => {
    const app = useApp();
    const [submitting, setSubmitting] = useState(false);

    const categoriasPragmaticas = [
        { label: 'Estratégica', value: 'Estratégica' },
        { label: 'Táctica', value: 'Táctica' },
        { label: 'Operativa', value: 'Operativa' }
    ];
    
    const categoriasAdministrativas = [
        { label: 'Dirección', value: 'Dirección' },
        { label: 'Gerencia', value: 'Gerencia' },
        { label: 'Departamento', value: 'Departamento' },
        { label: 'Unidad', value: 'Unidad' }
    ];
    
    const tiemposJornada = [
        { label: 'Completa', value: 'Completa' },
        { label: 'Media', value: 'Media' },
        { label: 'Por horas', value: 'Por horas' }
    ];

    // Eliminamos la validación de menuItem
    const validationSchema = yup.object().shape({
        title: yup.string().required('El título es requerido'),
        categoriaPragmatica: yup.string().required('La categoría pragmática es requerida'),
        categoriaAdministrativa: yup.string().required('La categoría administrativa es requerida'),
        cargo: yup.string().required('El cargo es requerido'),
        tiempoJornada: yup.string().required('El tiempo de jornada es requerido'),
        cantidad: yup.number().required('La cantidad es requerida').min(1, 'Debe ser al menos 1')
    });

    // Mantenemos menuItem en los valores iniciales para compatibilidad con el código existente,
    // pero ya no lo mostraremos en la interfaz
    const initialValues = itemToEdit ? {
        ...itemToEdit,
        parentId: itemToEdit.parentId || parentId
    } : {
        title: '',
        categoriaPragmatica: '',
        categoriaAdministrativa: '',
        cargo: '',
        tiempoJornada: '',
        cantidad: 1,
        parentId: parentId
    };

    const handleSubmit = (values, { setSubmitting }) => {
        if (submitting) return;
        
        setSubmitting(true);
        
        try {
            // Agregamos un objeto menuItem vacío para mantener compatibilidad
            const formData = {
                ...values,
                menuItem: {
                    addToMenu: false,
                    description: '',
                    url: '',
                    icon: 'pi pi-folder',
                    visible: true
                }
            };
            onSave(formData);
        } catch (error) {
            console.error("Error al guardar el ítem:", error);
            app.flashMsg("Error", "Ocurrió un error al guardar el ítem", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        app.closeDialogs();
    };
    
    const handleDelete = () => {
        if (onDelete && itemToEdit && itemToEdit.id) {
            app.confirmDialog({
                message: '¿Está seguro que desea eliminar este elemento?',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí, eliminar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    onDelete(itemToEdit.id);
                }
            });
        }
    };

    const inputClassName = (error) => `w-full ${error ? 'p-invalid' : ''}`;

    return (
        <div className={isSubPage ? '' : 'card shadow-2'}>
            {!isSubPage && (
                <div className="card-header bg-primary text-white p-3">
                    <h5 className="m-0">
                        {itemToEdit ? 'Editar Ítem' : parentId ? 'Agregar Nuevo Ítem' : 'Crear Elemento Raíz'}
                    </h5>
                </div>
            )}
            <div className="p-3">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                        <Form>
                            {/* Eliminamos TabView y mostramos directamente los campos */}
                            <div className="grid">
                                <div className="col-12 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="title" className="font-medium block mb-2">Título *</label>
                                        <InputText 
                                            id="title"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName(touched.title && errors.title)}
                                            placeholder="Ingrese el título del ítem"
                                        />
                                        <ErrorMessage name="title" component="small" className="p-error" />
                                    </div>
                                </div>

                                <div className="col-12 md:col-6 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="categoriaPragmatica" className="font-medium block mb-2">Categoría Pragmática *</label>
                                        <Dropdown
                                            id="categoriaPragmatica"
                                            name="categoriaPragmatica"
                                            value={values.categoriaPragmatica}
                                            options={categoriasPragmaticas}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName(touched.categoriaPragmatica && errors.categoriaPragmatica)}
                                            placeholder="Seleccione una categoría"
                                        />
                                        <ErrorMessage name="categoriaPragmatica" component="small" className="p-error" />
                                    </div>
                                </div>

                                <div className="col-12 md:col-6 mb-3">
                                    <div className="p-field">
                                        <label htmlFor="categoriaAdministrativa" className="font-medium block mb-2">Categoría Administrativa *</label>
                                        <Dropdown
                                            id="categoriaAdministrativa"
                                            name="categoriaAdministrativa"
                                            value={values.categoriaAdministrativa}
                                            options={categoriasAdministrativas}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName(touched.categoriaAdministrativa && errors.categoriaAdministrativa)}
                                            placeholder="Seleccione una categoría"
                                        />
                                        <ErrorMessage name="categoriaAdministrativa" component="small" className="p-error" />
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

                                <div className="col-12 md:col-6 mb-3">
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

                            <div className="flex justify-content-between">
                                {itemToEdit && (
                                    <Button 
                                        type="button" 
                                        label="Eliminar" 
                                        icon="pi pi-trash" 
                                        className="p-button-danger" 
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                    />
                                )}
                                <div className="ml-auto flex gap-2">
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

ItemFormPage.defaultProps = {
    isSubPage: false,
    itemToEdit: null
};

export default ItemFormPage;
