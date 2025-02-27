import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Title } from 'components/Title';
import { ProgressSpinner } from 'primereact/progressspinner';
import useApp from 'hooks/useApp';
import useApi from 'hooks/useApi';

const TblItemsAdd = (props) => {
    const app = useApp();
    const api = useApi();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // Redirigir al usuario a la estructura organizacional
        navigate('/tblitems/estructura-organizacional');
    }, [navigate]);
    
    const validationSchema = yup.object().shape({
        codigo_item: yup.string().required('El código del item es requerido'),
        cargo: yup.string().required('El cargo es requerido'),
        haber_basico: yup.number().required('El haber básico es requerido').min(0, 'No puede ser negativo'),
        unidad_organizacional: yup.string().required('La unidad organizacional es requerida'),
        tiempo_jornada: yup.string().required('El tiempo de jornada es requerido'),
        cantidad: yup.number().required('La cantidad es requerida').min(1, 'Debe ser al menos 1')
    });
    
    const tiemposJornada = [
        { label: 'Completa', value: 'Completa' },
        { label: 'Media', value: 'Media' },
        { label: 'Por horas', value: 'Por horas' }
    ];
    
    const initialValues = {
        codigo_item: '',
        cargo: '',
        haber_basico: 0,
        unidad_organizacional: '',
        tiempo_jornada: '',
        cantidad: 1
    };
    
    const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
        try {
            setLoading(true);
            const response = await api.post('tblitem/add', values);
            
            if (response.error) {
                app.flashMsg('Error', response.error, 'error');
            } else {
                app.flashMsg('Éxito', 'Item creado correctamente');
                resetForm();
                if (props.redirect) {
                    navigate('/tblitems');
                }
            }
        } catch (error) {
            console.error("Error al crear el item:", error);
            
            // Manejar errores de validación del servidor
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors || {};
                setErrors(errors);
            } else {
                app.flashMsg('Error', 'Error al crear el item', 'error');
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };
    
    return (
        <div className="p-grid p-fluid">
            <Title text="Agregar Item" />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="codigo_item">Código del Item</label>
                            <InputText
                                id="codigo_item"
                                name="codigo_item"
                                value={values.codigo_item}
                                onChange={(e) => setFieldValue('codigo_item', e.target.value)}
                            />
                            <ErrorMessage name="codigo_item" component="small" className="p-error" />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="cargo">Cargo</label>
                            <InputText
                                id="cargo"
                                name="cargo"
                                value={values.cargo}
                                onChange={(e) => setFieldValue('cargo', e.target.value)}
                            />
                            <ErrorMessage name="cargo" component="small" className="p-error" />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="haber_basico">Haber Básico</label>
                            <InputNumber
                                id="haber_basico"
                                name="haber_basico"
                                value={values.haber_basico}
                                onValueChange={(e) => setFieldValue('haber_basico', e.value)}
                                mode="currency"
                                currency="BOB"
                                locale="es-BO"
                            />
                            <ErrorMessage name="haber_basico" component="small" className="p-error" />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="unidad_organizacional">Unidad Organizacional</label>
                            <InputText
                                id="unidad_organizacional"
                                name="unidad_organizacional"
                                value={values.unidad_organizacional}
                                onChange={(e) => setFieldValue('unidad_organizacional', e.target.value)}
                            />
                            <ErrorMessage name="unidad_organizacional" component="small" className="p-error" />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="tiempo_jornada">Tiempo de Jornada</label>
                            <Dropdown
                                id="tiempo_jornada"
                                name="tiempo_jornada"
                                value={values.tiempo_jornada}
                                options={tiemposJornada}
                                onChange={(e) => setFieldValue('tiempo_jornada', e.value)}
                                placeholder="Seleccione un tiempo de jornada"
                            />
                            <ErrorMessage name="tiempo_jornada" component="small" className="p-error" />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="cantidad">Cantidad</label>
                            <InputNumber
                                id="cantidad"
                                name="cantidad"
                                value={values.cantidad}
                                onValueChange={(e) => setFieldValue('cantidad', e.value)}
                                min={1}
                            />
                            <ErrorMessage name="cantidad" component="small" className="p-error" />
                        </div>
                        <div className="p-col-12">
                            <Button type="submit" label="Guardar" icon="pi pi-check" loading={isSubmitting || loading} />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default TblItemsAdd;
