import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const mapToTreeNodes = (nodes) => {
    return nodes.map(node => ({
        key: String(node.me_id), 
        label: node.me_descripcion,
        me_id: node.me_id,
        me_descripcion: node.me_descripcion,
        me_url: node.me_url,
        me_icono: node.me_icono,
        me_id_padre: node.me_id_padre,
        me_estado: node.me_estado,
        children: node.children ? mapToTreeNodes(node.children) : []
    }));
};

const MenuTreePage = () => {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [formMode, setFormMode] = useState(null); 
    const [formValues, setFormValues] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const initialFormValues = {
        me_descripcion: '',
        me_url: '',
        me_icono: '',
        me_estado: true, 
        me_id_padre: null
    };

    useEffect(() => {
        const fetchTree = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/tblsegmenu/manageMenuTree');
                setTreeData(mapToTreeNodes(response.data));
            } catch (err) {
                console.error('Error al cargar el menú:', err);
            }
            setLoading(false);
        };

        fetchTree();
    }, [refresh]);

    const onNodeSelect = (e) => {
        setSelectedNode(e.node);
        setFormMode('edit');
        setFormValues({
            me_descripcion: e.node.me_descripcion || '',
            me_url: e.node.me_url || '',
            me_icono: e.node.me_icono || '',
            me_estado: (e.node.me_estado === '1' || e.node.me_estado === true),
            me_id_padre: e.node.me_id_padre || null,
            me_id: e.node.me_id
        });
    };

    const onAddRoot = () => {
        setSelectedNode(null);
        setFormMode('add');
        setFormValues({ ...initialFormValues, me_id_padre: null });
    };

    const onAddBranch = () => {
        if (!selectedNode) return;
        setFormMode('add');
        setFormValues({ ...initialFormValues, me_id_padre: selectedNode.me_id });
    };

    const validationSchema = yup.object().shape({
        me_descripcion: yup.string().required('La descripción es obligatoria'),
        me_url: yup.string().nullable(),
        me_icono: yup.string().nullable(),
        me_estado: yup.boolean().required('Este campo es obligatorio')
    });

    const onSubmit = async (values, actions) => {
        try {
            if (formMode === 'edit') {
                await axios.post(`/tblsegmenu/edit/${values.me_id}`, values);
            } else if (formMode === 'add') {
                await axios.post('/tblsegmenu/add', values);
            }
            setRefresh(!refresh);
            actions.resetForm();
            setFormMode(null);
            setSelectedNode(null);
        } catch (err) {
            console.error('Error al guardar:', err);
        }
    };

    const onDelete = async () => {
        if (!selectedNode) return;
        if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;
        try {
            await axios.delete(`/tblsegmenu/delete/${selectedNode.me_id}`);
            setRefresh(!refresh);
            setFormMode(null);
            setSelectedNode(null);
        } catch (err) {
            console.error('Error al eliminar:', err);
        }
    };

    return (
        <div className="p-grid" style={{ padding: '1em' }}>
            <div className="p-col-4" style={{ borderRight: '1px solid #ccc' }}>
                <h3>Menú del Sistema</h3>
                <div className="p-mb-2">
                    <Button label="Agregar raíz" icon="pi pi-plus" onClick={onAddRoot} />
                    {selectedNode && (
                        <Button
                            label="Agregar rama"
                            icon="pi pi-plus"
                            onClick={onAddBranch}
                            className="p-ml-2"
                        />
                    )}
                </div>
                {loading ? (
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                ) : (
                    <Tree
                        value={treeData}
                        selectionMode="single"
                        selectionKeys={selectedNode ? { [String(selectedNode.me_id)]: true } : null}
                        onSelect={onNodeSelect}
                    />
                )}
            </div>

            <div className="p-col-8">
                <h3>
                    {formMode === 'edit'
                        ? 'Editar menú'
                        : formMode === 'add'
                        ? 'Agregar menú'
                        : 'Selecciona un elemento o agrega uno nuevo'}
                </h3>
                {(formMode === 'edit' || formMode === 'add') && formValues && (
                    <Formik
                        enableReinitialize
                        initialValues={formValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <div className="p-field p-mb-3">
                                    <label htmlFor="me_descripcion">Descripción</label>
                                    <InputText
                                        id="me_descripcion"
                                        name="me_descripcion"
                                        value={values.me_descripcion}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="me_descripcion" component="small" className="p-error" />
                                </div>
                                <div className="p-field p-mb-3">
                                    <label htmlFor="me_url">Ruta</label>
                                    <InputText
                                        id="me_url"
                                        name="me_url"
                                        value={values.me_url}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="me_url" component="small" className="p-error" />
                                </div>
                                <div className="p-field p-mb-3">
                                    <label htmlFor="me_icono">Icono</label>
                                    <InputText
                                        id="me_icono"
                                        name="me_icono"
                                        value={values.me_icono}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="me_icono" component="small" className="p-error" />
                                </div>
                                <div className="p-field-checkbox p-mb-3">
                                    <Checkbox
                                        inputId="me_estado"
                                        name="me_estado"
                                        checked={values.me_estado}
                                        onChange={e =>
                                            setFieldValue('me_estado', e.checked)
                                        }
                                    />
                                    <label htmlFor="me_estado" className="p-checkbox-label">
                                        Mostrar en menú
                                    </label>
                                    <ErrorMessage name="me_estado" component="small" className="p-error" />
                                </div>
                                <div className="p-field p-mb-3">
                                    <Button
                                        label="Guardar"
                                        icon="pi pi-save"
                                        type="submit"
                                        disabled={isSubmitting}
                                    />
                                    {formMode === 'edit' && (
                                        <Button
                                            label="Eliminar"
                                            icon="pi pi-trash"
                                            onClick={onDelete}
                                            className="p-button-danger p-ml-2"
                                        />
                                    )}
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default MenuTreePage;
